'use client';

import { useState } from 'react';
import { useOrder } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Building,
  Trees,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WasteType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  examples: string[];
}

const wasteTypes: WasteType[] = [
  {
    id: 'household',
    name: 'Household Waste',
    description: 'General household items and furniture',
    icon: Home,
    examples: [
      'Furniture',
      'Appliances',
      'Garden waste',
      'General household items',
    ],
  },
  {
    id: 'construction',
    name: 'Construction Waste',
    description: 'Building materials and renovation debris',
    icon: Building,
    examples: ['Bricks', 'Concrete', 'Timber', 'Plasterboard'],
  },
  {
    id: 'garden',
    name: 'Garden Waste',
    description: 'Green waste and landscaping materials',
    icon: Trees,
    examples: ['Soil', 'Plants', 'Branches', 'Grass cuttings'],
  },
  {
    id: 'commercial',
    name: 'Commercial Waste',
    description: 'Business and office clearance',
    icon: Building2,
    examples: [
      'Office furniture',
      'Equipment',
      'Shop fittings',
      'Commercial debris',
    ],
  },
];

export function WasteTypeSelection() {
  const { state, updateWasteType, prevStep, nextStep } = useOrder();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(state.wasteType);
  const [specialItems, setSpecialItems] = useState({
    plasterboard: false,
    heavyMaterials: false,
  });

  const handleTypeSelect = (typeId: string) => {
    setSelectedTypes((prev) => {
      const isSelected = prev.includes(typeId);
      if (isSelected) {
        return prev.filter((id) => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleSpecialItemChange = (item: keyof typeof specialItems) => {
    setSpecialItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSubmit = () => {
    updateWasteType(selectedTypes);
    nextStep();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center md:text-left">
          Which type of waste best describes what you are disposing of?
        </h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">
          You can select multiple waste types. Some items may require special
          handling.
        </p>
      </header>

      <div className="bg-card border border-border p-4 rounded-lg mb-8">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-600/20 p-2 mt-1">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">
              You can select multiple waste types. Some items may require
              special handling:
            </h3>
            <ul className="mt-2 text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                Plasterboard and drywall materials
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                Heavy construction materials (soil, concrete, etc.)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {wasteTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              'relative overflow-hidden transition-all duration-300 border-2 cursor-pointer',
              selectedTypes.includes(type.id)
                ? 'border-primary'
                : 'border-border hover:border-muted-foreground/50'
            )}
            onClick={() => handleTypeSelect(type.id)}
          >
            <div className="absolute top-4 right-4">
              <Checkbox
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={() => handleTypeSelect(type.id)}
                className="border-primary"
              />
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-border">
                  <type.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {type.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {type.description}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Examples:
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {type.examples.map((example, index) => (
                    <p
                      key={index}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                      {example}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-md:fixed w-full max-md:bottom-0 max-md:border-t flex justify-between max-md:gap-4 max-md:p-4 max-md:left-0 max-md:right-0 max-md:z-10 max-md:bg-background max-md:shadow-sm">
        <Button
          onClick={prevStep}
          variant="outline"
          className="border-border hover:bg-accent"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={selectedTypes.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Continue
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
