import { SkipResponse } from "./api";

export const mockSkipData: SkipResponse = {
  skips: [
    {
      id: "skip-1",
      name: "2 Yard Mini Skip",
      description: "Ideal for small household clearances and garden waste. Perfect for projects with limited space.",
      image: "https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-2-yard-mini-skip-hire-wewantwaste.co_.uk-1.webp",
      dimensions: {
        length: 4,
        width: 2.6,
        height: 2.9,
        unit: "ft"
      },
      capacity: {
        value: 2,
        unit: "yd³"
      },
      price: {
        amount: 185,
        currency: "GBP"
      },
      suitableFor: ["Small garden waste", "Household cleanouts", "Small renovation projects"]
    },
    {
      id: "skip-2",
      name: "4 Yard Midi Skip",
      description: "Suitable for medium sized projects like kitchen renovations or garden clearances.",
      image: "https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-4-yard-midi-skip-hire-wewantwaste.co_.uk-1.webp",
      dimensions: {
        length: 5.9,
        width: 3.3,
        height: 3.3,
        unit: "ft"
      },
      capacity: {
        value: 4,
        unit: "yd³"
      },
      price: {
        amount: 225,
        currency: "GBP"
      },
      suitableFor: ["Home renovations", "Garden clearances", "Office clearouts"]
    },
    {
      id: "skip-3",
      name: "6 Yard Maxi Skip",
      description: "Perfect for larger residential projects or commercial waste. Great value for larger jobs.",
      image: "https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-6-yard-maxi-skip-hire-wewantwaste.co_.uk-1.webp",
      dimensions: {
        length: 9.8,
        width: 5.6,
        height: 3.9,
        unit: "ft"
      },
      capacity: {
        value: 6,
        unit: "yd³"
      },
      price: {
        amount: 265,
        currency: "GBP"
      },
      suitableFor: ["Large renovations", "Construction waste", "Retail clearances"]
    },
    {
      id: "skip-4",
      name: "8 Yard Builder Skip",
      description: "Our most popular skip size for construction projects and major home renovations.",
      image: "https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-8-yard-builders-skip-hire-wewantwaste.co_.uk-1.webp",
      dimensions: {
        length: 11.5,
        width: 5.6,
        height: 4.3,
        unit: "ft"
      },
      capacity: {
        value: 8,
        unit: "yd³"
      },
      price: {
        amount: 295,
        currency: "GBP"
      },
      suitableFor: ["Construction sites", "Major renovations", "Factory clearances"]
    },
    {
      id: "skip-5",
      name: "12 Yard Large Skip",
      description: "For significant projects and commercial use where large volumes of waste need removal.",
      image: "https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-12-yard-large-skip-hire-wewantwaste.co_.uk-1.webp",
      dimensions: {
        length: 13.1,
        width: 5.9,
        height: 5.9,
        unit: "ft"
      },
      capacity: {
        value: 12,
        unit: "yd³"
      },
      price: {
        amount: 365,
        currency: "GBP"
      },
      suitableFor: ["Large commercial clearances", "Industrial waste", "Construction sites"]
    },
    {
      id: "skip-6",
      name: "16 Yard Roll-On Roll-Off Skip",
      description: "Designed for major commercial and industrial waste management. Maximum capacity for large-scale needs.",
      image: "https://www.wewantwaste.co.uk/wp-content/uploads/2023/08/skip-16-yard-roll-on-roll-off-skip-hire-wewantwaste.co_.uk-1.webp",
      dimensions: {
        length: 19.7,
        width: 7.2,
        height: 5.9,
        unit: "ft"
      },
      capacity: {
        value: 16,
        unit: "yd³"
      },
      price: {
        amount: 445,
        currency: "GBP"
      },
      suitableFor: ["Large development projects", "Commercial demolition", "Factory clearances"]
    }
  ],
  location: {
    postcode: "NR32",
    area: "Lowestoft"
  }
}; 