'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Search, X, ArrowRight } from 'lucide-react';
import { useOrder } from '@/lib/context';
import { searchAddress, AddressItem } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/lib/hooks';

export function AddressSearch() {
  const { state, updatePostcode, updateAddress, nextStep } = useOrder();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(
    null
  );
  const [formData, setFormData] = useState({
    city: '',
    street: '',
    houseNumber: '',
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['addresses', debouncedQuery],
    queryFn: () => searchAddress(debouncedQuery),
    enabled: debouncedQuery.length >= 3 && !selectedAddress,
  });

  const results = data?.Items || [];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAddress = (address: AddressItem) => {
    setSelectedAddress(address);
    setFocused(false);
    setQuery(address.Text);

    const postcodeParts = address.Description.split(' ');
    const postcode = postcodeParts.slice(-2).join(' ');

    updatePostcode(postcode);
    updateAddress(`${address.Text}, ${address.Description}`);

    const streetParts = address.Text.split(' ');
    const houseNumber = streetParts[0];
    const street = streetParts.slice(1).join(' ');
    const city = address.Description.split(' ')[0];

    setFormData({
      city,
      street,
      houseNumber,
    });
  };

  const handleClearSelection = () => {
    setSelectedAddress(null);
    setQuery('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAddress) {
      nextStep();
    }
  };

  const showResults = focused && results.length > 0 && !selectedAddress;

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-4">
          <Label
            htmlFor="postcode-search"
            className="text-foreground text-base"
          >
            Find your address
          </Label>
          <div className="relative" ref={inputContainerRef}>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-muted-foreground" />
            </div>
            <Input
              ref={inputRef}
              id="postcode-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Enter your postcode or street name"
              className={cn(
                'pl-10 pr-10 bg-background border-input transition-all duration-200 h-12',
                selectedAddress
                  ? 'ring-2 ring-primary/20'
                  : focused
                  ? 'ring-2 ring-primary/10'
                  : ''
              )}
              disabled={!!selectedAddress}
            />
            <AnimatePresence>
              {query && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent"
                    />
                  ) : (
                    selectedAddress && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        type="button"
                        onClick={handleClearSelection}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={18} />
                      </motion.button>
                    )
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full max-w-lg mt-1 bg-popover border border-input rounded-md shadow-md overflow-hidden"
                style={{
                  top: inputContainerRef.current
                    ? inputContainerRef.current.offsetTop +
                      inputContainerRef.current.offsetHeight +
                      8
                    : 76,
                }}
              >
                <div className="max-h-72 overflow-y-auto">
                  {results.map((item, index) => (
                    <motion.button
                      key={item.Id}
                      type="button"
                      onClick={() => handleSelectAddress(item)}
                      className="w-full text-left px-4 py-3 hover:bg-accent flex items-start gap-3 border-b border-border last:border-0"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.03 }}
                      whileHover={{
                        backgroundColor: 'rgba(var(--accent), 0.7)',
                      }}
                    >
                      <MapPin size={18} className="mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          {item.Text}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.Description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="flex flex-col gap-4 bg-card p-5 rounded-md border border-input shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground">Address details</h3>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="house-number">House/Flat Number</Label>
                  <Input
                    id="house-number"
                    value={formData.houseNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, houseNumber: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
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
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            type="submit"
            disabled={!selectedAddress}
            className={cn('w-full transition-all duration-300')}
          >
            <motion.span
              initial={false}
              animate={{ x: selectedAddress ? [0, 5, 0] : 0 }}
              transition={{
                repeat: selectedAddress ? Infinity : 0,
                repeatDelay: 3,
                duration: 0.6,
              }}
              className="flex items-center justify-center"
            >
              Continue
              <ArrowRight size={18} className="ml-2" />
            </motion.span>
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
