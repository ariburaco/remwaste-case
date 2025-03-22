'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skip } from '@/lib/api';
import { useOrder } from '@/lib/context';
import { cn, formatCurrency } from '@/lib/utils';
import { Check, Truck } from 'lucide-react';

interface SkipCardProps {
  skip: Skip;
}

export function SkipCard({ skip }: SkipCardProps) {
  const { state, selectSkip, nextStep } = useOrder();
  const isSelected = state.selectedSkip?.id === skip.id;

  const handleSelect = () => {
    selectSkip(skip);
    nextStep();
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 border-2',
        isSelected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border hover:border-muted-foreground/50'
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Check size={14} className="mr-1" />
            Selected
          </Badge>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="aspect-video relative bg-gradient-to-br from-card to-background rounded-md flex items-center justify-center mb-3 overflow-hidden">
          <Truck size={60} className="text-muted-foreground" />

          <div className="absolute bottom-2 right-2">
            <Badge
              variant="outline"
              className="bg-background/60 backdrop-blur-sm border-border text-foreground"
            >
              {skip.size} Yards
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-foreground">
            {skip.size} Yard Skip
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {skip.hire_period_days} day hire period
          </p>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(skip.price_before_vat, 'GBP')}{' '}
                <span className="text-xs text-muted-foreground">per week</span>
              </p>
            </div>
            <Button
              onClick={handleSelect}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                isSelected
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-border hover:bg-accent'
              )}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
