"use client";

import { useState, useEffect } from "react";
import { useOrder } from "@/lib/context";
import { getSkipsByLocation } from "@/lib/api";
import { mockSkipData } from "@/lib/mock-data";
import { SkipCard } from "./skip-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Filter, TruckIcon, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Skip } from "@/lib/api";
import { cn } from "@/lib/utils";

export function SkipSelection() {
  const { state, prevStep, nextStep } = useOrder();
  const [loading, setLoading] = useState(true);
  const [skips, setSkips] = useState<Skip[]>([]);
  const [filteredSkips, setFilteredSkips] = useState<Skip[]>([]);
  const [sortOption, setSortOption] = useState<string>("recommended");
  
  useEffect(() => {
    const fetchSkips = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would use the actual postcode
        // const data = await getSkipsByLocation(state.postcode);
        
        // For development, we're using mock data
        setSkips(mockSkipData.skips);
        setFilteredSkips(mockSkipData.skips);
      } catch (error) {
        console.error("Error fetching skips:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkips();
  }, []);
  
  useEffect(() => {
    // Apply sorting
    let sorted = [...skips];
    
    switch (sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case "size-small":
        sorted.sort((a, b) => a.capacity.value - b.capacity.value);
        break;
      case "size-large":
        sorted.sort((a, b) => b.capacity.value - a.capacity.value);
        break;
      case "recommended":
      default:
        // Keep original order which is presumed to be recommended
        break;
    }
    
    setFilteredSkips(sorted);
  }, [sortOption, skips]);
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center md:text-left text-foreground">Select Skip</h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">
          Which type of skip best suits your needs?
        </p>
      </header>
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-auto">
          <div className="inline-flex items-center space-x-2 bg-card p-1.5 rounded-full border border-border">
            <TruckIcon size={18} className="text-primary ml-3" />
            <span className="mr-3 text-foreground">
              {filteredSkips.length} {filteredSkips.length === 1 ? 'skip' : 'skips'} available in your area
            </span>
          </div>
        </div>
        
        <div className="flex w-full md:w-auto">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-[220px] bg-background border-input">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="size-small">Size: Small to Large</SelectItem>
              <SelectItem value="size-large">Size: Large to Small</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid place-items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkips.map((skip) => (
              <SkipCard key={skip.id} skip={skip} />
            ))}
          </div>
          
          {filteredSkips.length === 0 && (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <div className="flex justify-center mb-4">
                <AlertCircle size={48} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">No skips available</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                We couldn't find any skips available in your area. Please try a different location or contact our support team.
              </p>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-between">
        <Button 
          onClick={prevStep} 
          variant="outline" 
          className="border-border hover:bg-accent"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={nextStep}
          disabled={!state.selectedSkip}
          className={cn(
            "transition-all",
            state.selectedSkip 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "bg-muted text-muted-foreground"
          )}
        >
          Continue
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
} 