import { NextRequest } from 'next/server';
import { fetchRecentDealEmails } from '@/lib/gmail';
import { parseDealEmail } from '@/lib/parse';
import { saveDeals } from '@/lib/store';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        sendUpdate({ status: 'Starting email fetch...', progress: 0, total: 0 });
        
        const raw = await fetchRecentDealEmails({ 
          label: process.env.GMAIL_LABEL || 'Flight Alerts', 
          days: 7 
        });
        
        sendUpdate({ 
          status: `Found ${raw.length} emails to process`, 
          progress: 0, 
          total: raw.length 
        });
        
        const parsed: any[] = [];
        let processedEmails = 0;
        
        for (const m of raw) {
          processedEmails++;
          sendUpdate({ 
            status: `Processing email ${processedEmails}/${raw.length}: ${m.subject.substring(0, 50)}...`, 
            progress: processedEmails, 
            total: raw.length 
          });
          
          const deals = parseDealEmail(m.subject, m.html, m.text);
          
          sendUpdate({ 
            status: `Found ${deals.length} deals in this email`, 
            progress: processedEmails, 
            total: raw.length,
            dealsFound: deals.length
          });
          
          for (const deal of deals) {
            parsed.push({
              ...deal,
              messageId: m.messageId,
              subject: m.subject,
              source: 'gmail',
              receivedAt: m.receivedAt,
            });
          }
        }

        sendUpdate({ 
          status: `Saving ${parsed.length} total deals to Firestore...`, 
          progress: raw.length, 
          total: raw.length 
        });
        
        console.log('💾 About to save deals:', parsed.length);
        console.log('💾 Sample deal:', parsed[0]);
        
        try {
          await saveDeals(parsed);
          console.log('✅ Deals saved successfully');
        } catch (error) {
          console.error('❌ Error saving deals:', error);
          sendUpdate({ 
            status: `Error saving deals: ${error instanceof Error ? error.message : 'Unknown error'}`, 
            error: true, 
            completed: true 
          });
          controller.close();
          return;
        }
        
        sendUpdate({ 
          status: 'Ingest completed successfully!', 
          progress: raw.length, 
          total: raw.length,
          completed: true,
          ingestedCount: parsed.length,
          processedEmails: raw.length
        });
        
        controller.close();
      } catch (error) {
        sendUpdate({ 
          status: 'Error occurred', 
          error: error instanceof Error ? error.message : 'Unknown error',
          completed: true
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
