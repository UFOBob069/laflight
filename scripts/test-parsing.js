const { parseDealEmail } = require('../src/lib/parse.ts');

// Test with your actual email data
const subject = "Your tracked route: Burbank, Los Angeles to Barcelona flights from $538";
const emailText = `
Hello,
We've found some great prices for 1-week trips in October, from Burbank, Los Angeles to Barcelona.

1-week trips in October
6–9 days · Round trip · 1 adult · Economy
	Nonstop
Thu, Oct 30 – Thu, Nov 6
From $618
View
	Iberia · Nonstop · LAX–BCN · 12 hr
 
	Cheapest
Sun, Oct 12 – Tue, Oct 21
SAVE 16%From $538
View
	Aer Lingus · 1 stop · LAX–BCN · 18 hr
 
Mon, Oct 6 – Wed, Oct 15
SAVE 16%From $542
View
	British Airways · 1 stop · LAX–BCN · 15 hr
 
Sun, Oct 19 – Tue, Oct 28
SAVE 13%From $555
View
	British Airways · 1 stop · LAX–BCN · 15 hr
`;

console.log('Testing email parsing...');
console.log('Subject:', subject);
console.log('');

const result = parseDealEmail(subject, null, emailText);
console.log('Parsed result:', JSON.stringify(result, null, 2));
