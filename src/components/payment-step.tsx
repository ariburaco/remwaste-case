'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkipVisualization } from '@/components/skip-visualization';
import { useOrder } from '@/lib/context';
import { cn, formatCurrency } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, CreditCard, MapPin, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function PaymentStep() {
  const { state, prevStep } = useOrder();
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvc, setCvc] = useState('123');
  const [saveCard, setSaveCard] = useState(false);
  const [country, setCountry] = useState('United Kingdom');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Calculate collection date (delivery date + 14 days)
  const collectionDate = state.date ? addDays(state.date, 14) : null;

  // Dummy values for calculation
  const price = state.selectedSkip?.price_before_vat || 216.00;
  const vat = price * 0.2;
  const permitFee = state.permitRequired ? 84.00 : 0;
  const totalPrice = price + vat + permitFee;

  // Handle payment submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16">
      {!isComplete ? (
        <>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center md:text-left text-foreground">
              Complete Your Order
            </h1>
            <p className="text-muted-foreground mt-2 text-center md:text-left">
              Review your order details and make payment to confirm your booking
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card className="p-6 border-border bg-card shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              {/* Delivery Address */}
              <div className="border-b border-border pb-4 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-base mb-1">Delivery Address</h3>
                    <p className="text-foreground">{state.address}</p>
                    <p className="text-muted-foreground">{state.postcode}</p>
                  </div>
                </div>
              </div>
              
              {/* Delivery & Collection */}
              <div className="border-b border-border pb-4 mb-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="text-primary mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-base mb-1">Delivery & Collection</h3>
                    <div className="grid grid-cols-3 gap-1">
                      <p className="text-muted-foreground col-span-1">Delivery:</p>
                      <p className="text-foreground col-span-2 font-medium">
                        {state.date ? format(state.date, 'EEEE d MMMM yyyy') : 'Not selected'}
                      </p>
                      
                      <p className="text-muted-foreground col-span-1">Collection:</p>
                      <p className="text-foreground col-span-2 font-medium">
                        {collectionDate ? format(collectionDate, 'EEEE d MMMM yyyy') : 'Not selected'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skip Details */}
              {state.selectedSkip && (
                <div className="border-b border-border pb-4 mb-4">
                  <div className="flex">
                    <div className="w-24 h-24 mr-4">
                      <SkipVisualization size={state.selectedSkip.size} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{state.selectedSkip.size} Yard Skip</h3>
                      <p className="text-muted-foreground text-sm mb-1">
                        {state.selectedSkip.hire_period_days} day hire period
                      </p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {formatCurrency(state.selectedSkip.price_before_vat, 'GBP')}
                        <span className="text-xs ml-1 text-muted-foreground font-normal">+ VAT</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Cost Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal (excl. VAT)</p>
                  <p className="text-foreground">{formatCurrency(price)}</p>
                </div>
                
                {permitFee > 0 && (
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Permit fee</p>
                    <p className="text-foreground">{formatCurrency(permitFee)}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <p className="text-muted-foreground">VAT (20%)</p>
                  <p className="text-foreground">{formatCurrency(vat)}</p>
                </div>
                
                <div className="flex justify-between pt-3 border-t border-border mt-3">
                  <p className="text-foreground font-bold text-lg">Total</p>
                  <p className="text-foreground font-bold text-lg">{formatCurrency(totalPrice)}</p>
                </div>
              </div>
            </Card>

            {/* Payment Details */}
            <Card className="p-6 border-border bg-card shadow-sm">
              <h2 className="text-2xl font-bold flex items-center mb-6">
                <CreditCard className="text-primary mr-2" size={22} />
                Payment Details
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Payment Method */}
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <div 
                      className="flex-1 bg-primary text-primary-foreground rounded-lg p-4 flex items-center justify-center cursor-pointer"
                    >
                      <CreditCard className="mr-2" size={20} />
                      <span className="font-medium">Card</span>
                    </div>
                    <div 
                      className="flex-1 bg-card border border-border rounded-lg p-4 flex items-center justify-center cursor-pointer text-muted-foreground"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 7C10.34 7 9 8.34 9 10H11C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11C11.45 11 11 11.45 11 12V13H13V12.55C14.19 12.25 15 11.21 15 10C15 8.34 13.66 7 12 7ZM11 15V17H13V15H11Z" 
                          fill="currentColor"
                        />
                      </svg>
                      <span>Google Pay</span>
                    </div>
                  </div>
                </div>
                
                {/* Card Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg width="28" height="20" viewBox="0 0 28 20" className="h-5 w-auto">
                          <rect width="28" height="20" rx="4" fill="#016FD0" />
                          <path d="M14.5 6H11V14H14.5V6Z" fill="white" />
                          <path d="M11.7 10C11.7 8.8 12.4 7.9 14.3 7.9C15.1 7.9 15.7 8.1 16.2 8.3L15.8 9.7C15.4 9.5 14.9 9.3 14.3 9.3C13.6 9.3 13.5 9.7 13.5 9.9C13.5 10.6 15.2 10.6 15.2 12.3C15.2 13.6 14.3 14.1 13.1 14.1C12.3 14.1 11.6 13.9 11 13.6L11.4 12.2C12 12.5 12.7 12.7 13.2 12.7C13.7 12.7 14 12.5 14 12.1C14 11.3 11.7 11.5 11.7 10Z" fill="white" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiration date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM / YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">Security code</Label>
                      <div className="relative">
                        <Input
                          id="cvc"
                          placeholder="CVC"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          required
                          maxLength={3}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground h-5 w-5">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="saveCard" 
                      checked={saveCard} 
                      onCheckedChange={(checked) => setSaveCard(checked as boolean)} 
                    />
                    <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                      Save this card as default payment method
                    </Label>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-medium"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      "Complete Payment"
                    )}
                  </Button>
                  
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="w-full mt-3 border-border hover:bg-accent py-6 text-lg font-medium"
                  >
                    Back
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mb-6"
            >
              <Sparkles className="text-white" size={48} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold mb-3"
            >
              Order Complete!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground text-lg max-w-lg mb-8"
            >
              Your skip hire has been confirmed. We'll deliver your {state.selectedSkip?.size} yard skip on {state.date ? format(state.date, 'EEEE, MMMM do') : 'your selected date'}.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-6 border border-green-500/30 bg-green-50/10 rounded-lg mb-8 text-left w-full max-w-md"
            >
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <CalendarDays className="text-green-600 mr-2" size={20} />
                Delivery Details
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><span className="text-foreground font-medium">Date:</span> {state.date ? format(state.date, 'EEEE, MMMM do yyyy') : 'Not selected'}</li>
                <li><span className="text-foreground font-medium">Time window:</span> Between 7am and 6pm</li>
                <li><span className="text-foreground font-medium">Address:</span> {state.address}</li>
                <li><span className="text-foreground font-medium">Order ID:</span> #SKP-{Math.floor(Math.random() * 100000)}</li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 py-6 px-8 text-lg font-medium"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 