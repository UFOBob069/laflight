interface AirportCode {
  code: string;
  city: string;
  country: string;
}

let airportCodes: Map<string, AirportCode> | null = null;

export async function loadAirportCodes(): Promise<Map<string, AirportCode>> {
  if (airportCodes) return airportCodes;

  try {
    const response = await fetch('/api/airports');
    const data = await response.json();
    
    airportCodes = new Map();
    
    for (const [code, info] of Object.entries(data.airportCodes)) {
      airportCodes.set(code, info as AirportCode);
    }
    
    console.log(`📍 Loaded ${airportCodes.size} airport codes`);
    return airportCodes;
  } catch (error) {
    console.error('Error loading airport codes:', error);
    return new Map();
  }
}

export async function getAirportInfo(code: string): Promise<AirportCode | null> {
  const codes = await loadAirportCodes();
  return codes.get(code) || null;
}

export async function getCityName(code: string): Promise<string> {
  const info = await getAirportInfo(code);
  return info ? `${info.city}, ${info.country}` : code;
}

// Client-side function that takes airport codes as parameter
export function getCityNameFromMap(code: string, airportMap: Map<string, AirportCode>): string {
  const info = airportMap.get(code);
  return info ? `${info.city}, ${info.country}` : code;
}
