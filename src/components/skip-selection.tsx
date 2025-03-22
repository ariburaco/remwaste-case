'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Skip, SkipResponse } from '@/lib/api';
import { getSkipsByLocation } from '@/lib/api';
import { useOrder } from '@/lib/context';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, PackageSearch, TruckIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SkipCard } from './skip-card';
import { useQuery } from '@tanstack/react-query';
import { SkipVisualization } from './skip-visualization';
import { Card } from './ui/card';
import { formatCurrency } from '@/lib/utils';

export function SkipSelection() {
  const { state, prevStep, selectSkip, nextStep } = useOrder();
  const [filteredSkips, setFilteredSkips] = useState<Skip[]>([]);
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(state.selectedSkip);
  const [showPreview, setShowPreview] = useState<boolean>(!!state.selectedSkip);

  // Prepare address data for the query
  const getAddressData = () => {
    if (!state.postcode) return null;

    // Extract area from the address if available
    const addressParts = state.address.split(',');
    let area = '';
    if (addressParts.length > 1) {
      // Try to extract area from address (usually the second part contains city/area)
      area = addressParts[1].trim().split(' ')[0];
    }

    // Get just the first part of the postcode (e.g., "LE10" from "LE10 1SH")
    const postcodePrefix = state.postcode.split(' ')[0];

    return { postcodePrefix, area };
  };

  const addressData = getAddressData();

  // Use React Query to fetch skip data
  const { data, isLoading, error } = useQuery<SkipResponse, Error>({
    queryKey: ['skips', addressData?.postcodePrefix, addressData?.area],
    queryFn: () => {
      if (!addressData)
        throw new Error(
          'Please enter a valid postcode to view available skips'
        );
      return getSkipsByLocation(addressData.postcodePrefix, addressData.area);
    },
    enabled: !!addressData, // Only run the query if we have address data
  });

  const skips = data?.skips || [];

  // Update filtered skips when data changes or sort option changes
  useEffect(() => {
    if (!skips) {
      setFilteredSkips([]);
      return;
    }

    let sorted = [...skips];

    switch (sortOption) {
      case 'price-low':
        sorted.sort((a, b) => a.price_before_vat - b.price_before_vat);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price_before_vat - a.price_before_vat);
        break;
      case 'size-small':
        sorted.sort((a, b) => a.size - b.size);
        break;
      case 'size-large':
        sorted.sort((a, b) => b.size - a.size);
        break;
      case 'recommended':
      default:
        // Keep original order which is presumed to be recommended
        break;
    }

    setFilteredSkips(sorted);
  }, [data, sortOption, state.wasteType]);

  // Handle skip selection
  const handleSkipSelect = (skip: Skip) => {
    setSelectedSkip(skip);
    setShowPreview(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (selectedSkip) {
      selectSkip(selectedSkip);
      nextStep();
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setSelectedSkip(null);
  };

  const errorMessage = error
    ? error.message
    : data?.skips.length === 0
    ? 'No skips available in your area'
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center md:text-left text-foreground">
          Select Skip
        </h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">
          Which type of skip best suits your needs?
        </p>
      </header>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid place-items-center py-16"
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">
                Finding available skips in your area...
              </p>
            </div>
          </motion.div>
        ) : errorMessage ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 bg-card rounded-lg border border-border shadow-sm"
          >
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-destructive" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Unable to find skips
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              {errorMessage}
            </p>
            <Button
              onClick={prevStep}
              variant="outline"
              className="border-border hover:bg-accent"
            >
              <ArrowLeft size={18} className="mr-2" />
              Go back and try again
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div className="w-full md:w-auto">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-card p-2 px-4 rounded-full border border-border shadow-sm"
                >
                  <TruckIcon size={18} className="text-primary" />
                  <span className="text-foreground">
                    {filteredSkips.length}{' '}
                    {filteredSkips.length === 1 ? 'skip' : 'skips'} available in
                    your area
                  </span>
                </motion.div>
              </div>

              <div className="flex w-full md:w-auto">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full md:w-[220px] bg-background border-input">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="size-small">
                      Size: Small to Large
                    </SelectItem>
                    <SelectItem value="size-large">
                      Size: Large to Small
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredSkips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkips.map((skip, index) => (
                  <motion.div
                    key={skip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <SkipCard 
                      skip={skip} 
                      isSelected={selectedSkip?.id === skip.id}
                      onSelect={handleSkipSelect}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-card rounded-lg border border-border shadow-sm"
              >
                <div className="flex justify-center mb-4">
                  <PackageSearch size={48} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  No matching skips found
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  We couldn't find any skips that match your requirements. Try
                  adjusting your waste type selection or contact our support
                  team.
                </p>
              </motion.div>
            )}

            <div className="mt-8 flex justify-start">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-border hover:bg-accent"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to waste selection
              </Button>
            </div>

            {/* Skip Preview at the bottom */}
            <AnimatePresence>
              {showPreview && selectedSkip && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                  className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg p-4 z-50"
                >
                  <div className="w-full max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 relative">
                          <SkipVisualization size={selectedSkip.size} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {selectedSkip.size} Yard Skip
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {selectedSkip.hire_period_days} day hire • {formatCurrency(selectedSkip.price_before_vat, 'GBP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          onClick={handleCancelPreview}
                          className="border-border hover:bg-accent"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleConfirm}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Continue <ArrowRight size={18} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
