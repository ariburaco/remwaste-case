/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  transport_cost: number | null;
  per_tonne_cost: number | null;
  price_before_vat: number;
  vat: number;
  postcode: string;
  area: string | null;
  forbidden: boolean;
  created_at: string;
  updated_at: string;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
}

export interface SkipResponse {
  skips: Skip[];
  location: {
    postcode: string;
    area: string;
  };
}

export interface AddressItem {
  Id: string;
  Type: string;
  Text: string;
  Highlight: string;
  Description: string;
}

export interface AddressResponse {
  Items: AddressItem[];
}

export async function getSkipsByLocation(
  postcode: string,
  area?: string
): Promise<SkipResponse> {
  const url = `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}${
    area ? `&area=${area}` : ''
  }`;

  try {
    // Add a timeout to the fetch to avoid hanging if the server doesn't respond
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `API returned status ${response.status}: ${response.statusText}`
      );

      throw new Error(`Failed to fetch skips: ${response.statusText}`);
    }

    // This is for mapping the real API response to our interface
    const data = await response.json();

    // If the API returns an empty array, check if we should use mock data
    if (data.length === 0) {
      // If in production, return an empty response
      return {
        skips: [],
        location: {
          postcode,
          area: area || '',
        },
      };
    }

    return {
      skips: data,
      location: {
        postcode: data[0].postcode,
        area: data[0].area || '',
      },
    };
  } catch (error) {
    console.error('Error fetching skips:', error);

    // In production, rethrow the error
    throw error;
  }
}

export async function searchAddress(query: string): Promise<AddressResponse> {
  const url = `https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.00/json3ex.ws?Key=JP84-GY97-YZ96-GG45&Origin=GBR&Countries=GB&Limit=7&Language=en&Text=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch addresses: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}

// Helper functions to generate mock data based on skip size
function getSkipDescription(size: number): string {
  switch (true) {
    case size <= 4:
      return 'Ideal for small household clearances and garden waste. Perfect for projects with limited space.';
    case size <= 8:
      return 'Suitable for medium sized projects like kitchen renovations or garden clearances.';
    case size <= 12:
      return 'Perfect for larger residential projects or commercial waste. Great value for larger jobs.';
    case size <= 16:
      return 'Our most popular skip size for construction projects and major home renovations.';
    default:
      return 'Designed for major commercial and industrial waste management. Maximum capacity for large-scale needs.';
  }
}

function getSkipImage(size: number): string {
  // Use generic images based on size
  switch (true) {
    case size <= 2:
      return 'https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-2-yard-mini-skip-hire-wewantwaste.co_.uk-1.webp';
    case size <= 4:
      return 'https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-4-yard-midi-skip-hire-wewantwaste.co_.uk-1.webp';
    case size <= 6:
      return 'https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-6-yard-maxi-skip-hire-wewantwaste.co_.uk-1.webp';
    case size <= 8:
      return 'https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-8-yard-builders-skip-hire-wewantwaste.co_.uk-1.webp';
    case size <= 12:
      return 'https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-12-yard-large-skip-hire-wewantwaste.co_.uk-1.webp';
    default:
      return 'https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-16-yard-roll-on-roll-off-skip-hire-wewantwaste.co_.uk-1.webp';
  }
}

function getSkipDimensions(size: number): {
  length: number;
  width: number;
  height: number;
  unit: string;
} {
  // Approximate dimensions based on skip size
  switch (true) {
    case size <= 2:
      return { length: 4, width: 2.6, height: 2.9, unit: 'ft' };
    case size <= 4:
      return { length: 5.9, width: 3.3, height: 3.3, unit: 'ft' };
    case size <= 6:
      return { length: 9.8, width: 5.6, height: 3.9, unit: 'ft' };
    case size <= 8:
      return { length: 11.5, width: 5.6, height: 4.3, unit: 'ft' };
    case size <= 12:
      return { length: 13.1, width: 5.9, height: 5.9, unit: 'ft' };
    case size <= 16:
      return { length: 19.7, width: 7.2, height: 5.9, unit: 'ft' };
    default:
      return { length: 21, width: 7.5, height: 6.5, unit: 'ft' };
  }
}

function getSkipSuitableFor(size: number, allowsHeavyWaste: boolean): string[] {
  const baseItems = ['General waste', 'Household clearance'];

  if (size <= 4) {
    return [...baseItems, 'Small garden waste', 'Small DIY projects'];
  } else if (size <= 8) {
    return [
      ...baseItems,
      'Home renovations',
      'Garden clearances',
      'Office clearouts',
    ];
  } else if (size <= 12) {
    return [
      ...baseItems,
      'Large renovations',
      'Construction waste',
      'Retail clearances',
    ];
  } else {
    const items = [
      'Large commercial clearances',
      'Factory clearances',
      'Development projects',
    ];
    return allowsHeavyWaste ? [...items, 'Heavy construction waste'] : items;
  }
}
