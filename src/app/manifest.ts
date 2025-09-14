import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Best LAX Deals - Find Cheap Flights from Los Angeles',
    short_name: 'Best LAX Deals',
    description: 'Monitor 50+ flight deal sources 24/7 to find the lowest prices from Los Angeles. Save $30-179 per year with our weekly flight deals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['travel', 'lifestyle', 'utilities'],
    lang: 'en',
    orientation: 'portrait',
    scope: '/',
  }
}
