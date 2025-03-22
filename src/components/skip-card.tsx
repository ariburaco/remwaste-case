"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Truck, Package, Ruler, Dot } from "lucide-react";
import { Skip } from "@/lib/api";
import { useOrder } from "@/lib/context";
import { formatCurrency, formatDimensions, formatCapacity, getSkipSizeLabel, cn } from "@/lib/utils";

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
  
  const sizeLabel = getSkipSizeLabel(skip.capacity);
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 border-2",
      isSelected 
        ? "border-primary shadow-lg shadow-primary/20" 
        : "border-border hover:border-muted-foreground/50"
    )}>
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
          {skip.image ? (
            <img
              src={skip.image}
              alt={skip.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Truck size={60} className="text-muted-foreground" />
          )}
          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-border text-foreground">
              {sizeLabel}
            </Badge>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-foreground">{skip.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{skip.description}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <Package size={16} className="mr-2" />
            <span className="text-sm">
              Capacity: {formatCapacity(skip.capacity.value, skip.capacity.unit)}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Ruler size={16} className="mr-2" />
            <span className="text-sm">
              Dimensions: {formatDimensions(
                skip.dimensions.length,
                skip.dimensions.width,
                skip.dimensions.height,
                skip.dimensions.unit
              )}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-foreground">Suitable for:</h4>
          <div className="flex flex-wrap gap-1">
            {skip.suitableFor.slice(0, 3).map((item, index) => (
              <Badge key={index} variant="outline" className="bg-background border-border text-foreground text-xs">
                {item}
              </Badge>
            ))}
            {skip.suitableFor.length > 3 && (
              <Badge variant="outline" className="bg-background border-border text-foreground text-xs">
                +{skip.suitableFor.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(skip.price.amount, skip.price.currency)}
              </p>
            </div>
            <Button
              onClick={handleSelect}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                isSelected 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "border-border hover:bg-accent"
              )}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 