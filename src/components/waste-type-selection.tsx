'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOrder } from '@/lib/context';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Building2,
  Home,
  Trees,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface HeavyWasteType {
  id: string;
  name: string;
  description: string;
}

const heavyWasteTypes: HeavyWasteType[] = [
  {
    id: 'soil',
    name: 'Soil',
    description: 'Including topsoil and subsoil',
  },
  {
    id: 'concrete',
    name: 'Concrete',
    description: 'Blocks, slabs, and foundations',
  },
  {
    id: 'bricks',
    name: 'Bricks',
    description: 'Whole or broken bricks',
  },
  {
    id: 'tiles',
    name: 'Tiles',
    description: 'Ceramic, porcelain, or stone tiles',
  },
  {
    id: 'sand',
    name: 'Sand',
    description: 'Building or garden sand',
  },
  {
    id: 'gravel',
    name: 'Gravel',
    description: 'Stone and aggregate',
  },
  {
    id: 'rubble',
    name: 'Rubble',
    description: 'Mixed construction debris',
  },
];

function HeavyWasteDialog({
  open,
  onOpenChange,
  onConfirm,
  initialSelected = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedTypes: string[]) => void;
  initialSelected?: string[];
}) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialSelected);

  useEffect(() => {
    setSelectedTypes(initialSelected);
  }, [initialSelected]);

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

  const handleConfirm = () => {
    onConfirm(selectedTypes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle>Heavy Waste Types</DialogTitle>
          <DialogDescription>
            Heavy waste types have specific requirements and restrictions. Some
            skip sizes may not be available for heavy waste disposal.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="bg-amber-50 border border-amber-300 rounded-md mb-6">
            <div className="flex items-start gap-3 p-4">
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 text-lg">
                  Important Notice
                </h3>
                <p className="text-amber-700 mt-1">
                  Heavy waste types have specific requirements and restrictions.
                  Some skip sizes may not be available for heavy waste disposal.
                </p>
              </div>
            </div>
          </div>

          <p className="text-foreground mb-4 text-lg">
            Please select any heavy waste types you need to dispose of:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {heavyWasteTypes.map((type) => (
              <div
                key={type.id}
                className={cn(
                  'border rounded-md p-4 flex items-start gap-3 cursor-pointer transition-all',
                  selectedTypes.includes(type.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                )}
                onClick={() => handleTypeSelect(type.id)}
              >
                <Checkbox
                  id={`heavy-${type.id}`}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => handleTypeSelect(type.id)}
                  className="mt-1.5 border-primary"
                />
                <div>
                  <label
                    htmlFor={`heavy-${type.id}`}
                    className="font-medium cursor-pointer text-foreground text-lg"
                  >
                    {type.name}
                  </label>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-md mb-6">
            <div className="flex items-start gap-3 p-4">
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 text-lg">
                  Skip Size Restrictions
                </h3>
                <p className="text-blue-200 mt-1">
                  For safety reasons, heavy waste can only be disposed of in
                  skips up to 8 yards. Larger skips will not be available if
                  heavy waste is selected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-2 border-t border-border bg-background">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border hover:bg-accent text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WasteTypeSelection() {
  const { state, updateWasteType, updateHeavyWasteTypes, prevStep, nextStep } =
    useOrder();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(state.wasteType);
  const [showHeavyWasteDialog, setShowHeavyWasteDialog] = useState(false);
  const [selectedHeavyTypes, setSelectedHeavyTypes] = useState<string[]>(
    state.heavyWasteTypes || []
  );

  const needsHeavyWasteSelection = () => {
    return (
      selectedTypes.includes('construction') || selectedTypes.includes('garden')
    );
  };

  useEffect(() => {
    // Check if we need to show heavy waste dialog when waste types change
    if (
      needsHeavyWasteSelection() &&
      !showHeavyWasteDialog &&
      selectedHeavyTypes.length === 0
    ) {
      setShowHeavyWasteDialog(true);
    }
  }, [selectedTypes]);

  const handleTypeSelect = (typeId: string) => {
    setSelectedTypes((prev) => {
      const isSelected = prev.includes(typeId);
      const newTypes = isSelected
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId];

      return newTypes;
    });
  };

  const handleHeavyWasteConfirm = (types: string[]) => {
    setSelectedHeavyTypes(types);
    setShowHeavyWasteDialog(false);
  };

  const handleSubmit = () => {
    // First update the regular waste types
    updateWasteType(selectedTypes);

    // Then update heavy waste types if any were selected
    if (selectedHeavyTypes.length > 0) {
      updateHeavyWasteTypes(selectedHeavyTypes);
    } else if (needsHeavyWasteSelection()) {
      // If user hasn't selected heavy waste types but they should have,
      // show the dialog before proceeding
      setShowHeavyWasteDialog(true);
      return; // Don't proceed until heavy waste selection is done
    }

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

      {needsHeavyWasteSelection() && selectedHeavyTypes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Selected Heavy Waste Types</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHeavyWasteDialog(true)}
            >
              Edit
            </Button>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {selectedHeavyTypes.map((typeId) => {
                const type = heavyWasteTypes.find((t) => t.id === typeId);
                return type ? (
                  <div
                    key={typeId}
                    className="bg-background rounded px-3 py-2 text-sm"
                  >
                    {type.name}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

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

      <HeavyWasteDialog
        open={showHeavyWasteDialog}
        onOpenChange={setShowHeavyWasteDialog}
        onConfirm={handleHeavyWasteConfirm}
        initialSelected={selectedHeavyTypes}
      />
    </div>
  );
}
