import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AirportCode {
  code: string;
  city: string;
  country: string;
}

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'airport-codes.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const airportCodes: Record<string, AirportCode> = {};
    
    const lines = csvContent.split('\n');
    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i].trim();
      if (!line) continue;
      
      const [code, city, country] = line.split(',');
      if (code && city && country) {
        airportCodes[code.trim()] = {
          code: code.trim(),
          city: city.trim(),
          country: country.trim()
        };
      }
    }
    
    return NextResponse.json({ airportCodes });
  } catch (error) {
    console.error('Error loading airport codes:', error);
    return NextResponse.json({ airportCodes: {} });
  }
}
