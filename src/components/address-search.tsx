"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Search, X, ArrowRight } from "lucide-react";
import { useOrder } from "@/lib/context";
import { searchAddress, AddressItem } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AddressSearch() {
  const { state, updatePostcode, updateAddress, nextStep } = useOrder();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(null);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    houseNumber: ""
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounce the search
    const handler = setTimeout(async () => {
      if (query.length >= 3 && !selectedAddress) {
        setLoading(true);
        try {
          const data = await searchAddress(query);
          setResults(data.Items);
        } catch (error) {
          console.error("Error fetching addresses:", error);
        } finally {
          setLoading(false);
        }
      } else if (query.length === 0) {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, selectedAddress]);

  useEffect(() => {
    // Handle clicks outside of the results dropdown
    function handleClickOutside(event: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAddress = (address: AddressItem) => {
    setSelectedAddress(address);
    setFocused(false);
    setQuery(address.Text);

    // Extract postcode from the description
    const postcodeParts = address.Description.split(" ");
    const postcode = postcodeParts.slice(-2).join(" ");
    
    // Update the state
    updatePostcode(postcode);
    updateAddress(`${address.Text}, ${address.Description}`);
    
    // Populate the form fields
    const streetParts = address.Text.split(" ");
    const houseNumber = streetParts[0];
    const street = streetParts.slice(1).join(" ");
    const city = address.Description.split(" ")[0];
    
    setFormData({
      city,
      street,
      houseNumber
    });
  };

  const handleClearSelection = () => {
    setSelectedAddress(null);
    setQuery("");
    setResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAddress) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-4">
          <Label htmlFor="postcode-search" className="text-foreground">
            Find your address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-muted-foreground" />
            </div>
            <Input
              id="postcode-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Enter your postcode or street name"
              className="pl-10 pr-10 bg-background border-input"
              disabled={!!selectedAddress}
            />
            {query && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent" />
                ) : (
                  selectedAddress && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={18} />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Dropdown results */}
          {focused && results.length > 0 && !selectedAddress && (
            <div 
              ref={resultsRef}
              className="absolute z-10 w-full max-w-lg mt-1 bg-popover border border-input rounded-md shadow-md overflow-hidden"
            >
              <div className="max-h-56 overflow-y-auto">
                {results.map((item) => (
                  <button
                    key={item.Id}
                    type="button"
                    onClick={() => handleSelectAddress(item)}
                    className="w-full text-left px-4 py-2 hover:bg-accent flex items-start gap-3"
                  >
                    <MapPin size={18} className="mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{item.Text}</p>
                      <p className="text-sm text-muted-foreground">{item.Description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedAddress && (
          <div className="flex flex-col gap-4 bg-card p-4 rounded-md border border-input">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="house-number">House/Flat Number</Label>
                <Input 
                  id="house-number"
                  value={formData.houseNumber}
                  onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                  className="bg-background"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input 
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input 
                id="postcode"
                value={state.postcode}
                readOnly
                className="bg-background"
              />
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={!selectedAddress} 
          className={cn(
            "w-full",
            !selectedAddress ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
          )}
        >
          Continue
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>
    </div>
  );
} 