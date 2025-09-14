export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Best LAX Deals",
    "description": "Best LAX Deals monitors 50+ flight deal sources 24/7 to find the lowest prices from Los Angeles. Get weekly flight deals, direct booking links, and save $30-179 per year compared to competitors.",
    "url": process.env.SITE_URL || "https://www.bestlaxdeals.com",
    "logo": `${process.env.SITE_URL || "https://www.bestlaxdeals.com"}/logo.png`,
    "sameAs": [
      "https://twitter.com/bestlaxdeals",
      "https://facebook.com/bestlaxdeals"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@bestlaxdeals.com",
      "contactType": "customer service"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": "Flight Deals Service",
    "offers": {
      "@type": "Offer",
      "name": "Premium Flight Deals Subscription",
      "description": "Weekly flight deals with direct booking links, international destinations, sorting features, and price alerts",
      "price": "20",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "20",
        "priceCurrency": "USD",
        "unitText": "YEAR"
      },
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01",
      "seller": {
        "@type": "Organization",
        "name": "Best LAX Deals"
      }
    }
  }
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Best LAX Deals",
    "description": "Find the best flight deals from Los Angeles (LAX) to destinations worldwide. Monitor 50+ sources 24/7 for the lowest prices.",
    "url": process.env.SITE_URL || "https://www.bestlaxdeals.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.SITE_URL || "https://www.bestlaxdeals.com"}/deals?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Best LAX Deals",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.SITE_URL || "https://www.bestlaxdeals.com"}/logo.png`
      }
    }
  }
}

export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Flight Deals Monitoring Service",
    "description": "Weekly flight deals from Los Angeles with direct booking links, international destinations, and premium features",
    "provider": {
      "@type": "Organization",
      "name": "Best LAX Deals"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": "Travel and Tourism",
    "category": "Flight Deals",
    "offers": {
      "@type": "Offer",
      "name": "Free Flight Deals",
      "description": "Top 5 lowest priced flight deals every week",
      "price": "0",
      "priceCurrency": "USD"
    },
    "additionalOffer": {
      "@type": "Offer",
      "name": "Premium Flight Deals",
      "description": "All flight deals with direct booking links, international destinations, sorting, and price alerts",
      "price": "20",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "20",
        "priceCurrency": "USD",
        "unitText": "YEAR"
      }
    }
  }
}

export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does Best LAX Deals cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Best LAX Deals offers a free tier with the top 5 lowest priced deals every week. Premium subscription is $20/year and includes all deals with direct booking links, international destinations, sorting features, and price alerts."
        }
      },
      {
        "@type": "Question",
        "name": "How do you find flight deals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We monitor 50+ flight deal sources 24/7 using AI to find the best deals from Los Angeles. When a great deal appears, we send it to you immediately via our weekly digest."
        }
      },
      {
        "@type": "Question",
        "name": "What destinations do you cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We cover flights from Los Angeles (LAX) to destinations worldwide. Free users see domestic deals, while premium users get access to international destinations as well."
        }
      },
      {
        "@type": "Question",
        "name": "How often do you send deals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We send a weekly digest every Sunday with the latest flight deals. Premium users also get access to our deals page where they can browse and sort all available deals."
        }
      },
      {
        "@type": "Question",
        "name": "Can I cancel my subscription?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can cancel your subscription anytime. There are no long-term contracts or cancellation fees."
        }
      }
    ]
  }
}
