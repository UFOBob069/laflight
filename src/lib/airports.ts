import fs from 'fs';
import path from 'path';

interface AirportCode {
  code: string;
  city: string;
  country: string;
}

let airportCodes: Map<string, AirportCode> | null = null;

export function loadAirportCodes(): Map<string, AirportCode> {
  if (airportCodes) return airportCodes;

  try {
    const csvPath = path.join(process.cwd(), 'data', 'airport-codes.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    airportCodes = new Map();
    
    const lines = csvContent.split('\n');
    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i].trim();
      if (!line) continue;
      
      const [code, city, country] = line.split(',');
      if (code && city && country) {
        airportCodes.set(code.trim(), {
          code: code.trim(),
          city: city.trim(),
          country: country.trim()
        });
      }
    }
    
    console.log(`📍 Loaded ${airportCodes.size} airport codes`);
    return airportCodes;
  } catch (error) {
    console.error('Error loading airport codes:', error);
    return new Map();
  }
}

export function getAirportInfo(code: string): AirportCode | null {
  const codes = loadAirportCodes();
  return codes.get(code) || null;
}

export function getCityName(code: string): string {
  const info = getAirportInfo(code);
  return info ? `${info.city}, ${info.country}` : code;
}

// Client-side function that takes airport codes as parameter
export function getCityNameFromMap(code: string, airportMap: Map<string, AirportCode>): string {
  const info = airportMap.get(code);
  return info ? `${info.city}, ${info.country}` : code;
}
