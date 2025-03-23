'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useOrder } from '@/lib/context';
import { cn } from '@/lib/utils';
import {
  format,
  isBefore,
  addDays,
  isWeekend,
  isSameDay,
  addMonths,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  InfoIcon,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function DateSelection() {
  const { state, prevStep, nextStep, updateDate } = useOrder();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.date || undefined
  );
  const [showInfo, setShowInfo] = useState(false);
  const [minDate, setMinDate] = useState(() => {
    // Set minimum date to tomorrow
    const tomorrow = addDays(new Date(), 1);

    // Add 5 days if permit is required
    if (state.permitRequired) {
      return addDays(tomorrow, 5);
    }

    return tomorrow;
  });

  useEffect(() => {
    // If permit requirement changes, update the minimum date
    const tomorrow = addDays(new Date(), 1);
    const newMinDate = state.permitRequired ? addDays(tomorrow, 5) : tomorrow;
    setMinDate(newMinDate);

    // If the previously selected date is now invalid, clear it
    if (selectedDate && isBefore(selectedDate, newMinDate)) {
      setSelectedDate(undefined);
    }
  }, [state.permitRequired, selectedDate]);

  // Generate next 5 available dates for the quick selection
  const getNextAvailableDates = () => {
    const dates: Date[] = [];
    let currentDate = new Date(minDate);

    while (dates.length < 5) {
      // Skip weekends if needed (you can adjust business rules)
      if (!isWeekend(currentDate)) {
        dates.push(new Date(currentDate));
      }
      currentDate = addDays(currentDate, 1);
    }

    return dates;
  };

  const availableDates = getNextAvailableDates();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      setShowInfo(true);
    }
  };

  const handleDateQuickSelect = (date: Date) => {
    setSelectedDate(date);
    setShowInfo(true);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      updateDate(selectedDate);
      nextStep();
    }
  };

  // Custom calendar day render to highlight available dates
  const isDayAvailable = (day: Date) => {
    return !isWeekend(day) && !isBefore(day, minDate);
  };

  // Function to determine if a date is in the available quick select dates
  const isQuickSelectDate = (date: Date) => {
    return availableDates.some((d) => isSameDay(d, date));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center md:text-left text-foreground">
          Choose Your Delivery Date
        </h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">
          Select your preferred skip delivery date. We'll aim to deliver between
          7am and 6pm on your chosen day.
        </p>
      </header>

      {/* Permit info message if needed */}
      {state.permitRequired && (
        <div className="mb-8">
          <div className="bg-amber-950/20 border border-amber-600/30 rounded-lg p-5 text-amber-500">
            <div className="flex items-start gap-3">
              <InfoIcon className="mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-amber-500">
                  Permit Processing Time
                </h4>
                <p className="text-amber-400/90 mt-1">
                  Since your skip requires a permit, we need at least 5 working
                  days to process your order. The earliest available delivery
                  date has been adjusted accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden mb-8">
        <p className="text-sm text-muted-foreground mb-3">Quick select:</p>
        <div className="flex flex-wrap gap-4">
          {availableDates.map((date, index) => (
            <Button
              key={date.toISOString()}
              variant={
                isSameDay(date, selectedDate as Date) ? 'default' : 'outline'
              }
              className={cn(
                'flex-shrink-0 min-w-24',
                isSameDay(date, selectedDate as Date) &&
                  'bg-primary text-primary-foreground'
              )}
              onClick={() => handleDateQuickSelect(date)}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs">{format(date, 'EEE')}</span>
                <span className="font-bold">{format(date, 'd MMM')}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border-border bg-card shadow-sm">
          <div className="text-center mb-4 md:hidden">
            <h2 className="text-lg font-bold">
              {format(new Date(), 'MMMM yyyy')}
            </h2>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            fromDate={minDate}
            toDate={addMonths(new Date(), 3)}
            disabled={[
              { dayOfWeek: [0, 6] }, // Disable weekends
              (date) => {
                return isBefore(date, minDate);
              },
            ]}
            modifiers={{
              available: (date) => isDayAvailable(date),
              quickSelect: (date) => isQuickSelectDate(date),
            }}
            modifiersClassNames={{
              available: 'border border-primary/20',
              quickSelect: 'border-2 border-primary font-bold',
            }}
            className="w-full [&_.rdp-day]:h-12 [&_.rdp-day]:w-12 [&_.rdp-day]:text-base [&_.rdp-caption]:text-lg [&_.rdp-head_button]:text-sm"
            classNames={{
              months: 'flex flex-col gap-4',
              month: 'flex flex-col gap-4 space-y-2',
              caption:
                'flex justify-center pt-2 pb-2 relative items-center w-full',
              caption_label: 'text-lg font-semibold',
              nav: 'flex items-center gap-1',
              nav_button: cn(
                'h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100'
              ),
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse',
              head_row: 'flex justify-between w-full',
              head_cell: 'text-muted-foreground font-medium w-12 text-sm',
              row: 'flex w-full mt-3 justify-between',
              cell: cn(
                'relative p-0 text-center text-base justify-center items-center flex',
                '[&:has([aria-selected])]:bg-accent'
              ),
              day: cn(
                'h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md'
              ),
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside: 'text-muted-foreground opacity-50',
              day_disabled: 'text-muted-foreground opacity-50',
              day_hidden: 'invisible',
            }}
          />
        </Card>

        <div className="">
          <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="p-6 border-border bg-card shadow-sm h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="text-primary" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {format(selectedDate, 'EEEE')}
                      </h3>
                      <h4 className="text-lg font-bold text-primary">
                        {format(selectedDate, 'd MMMM yyyy')}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Delivery date
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 text-sm">
                    <div className="flex items-start gap-3 bg-accent/50 p-3 rounded-md">
                      <Clock className="text-primary mt-0.5" size={20} />
                      <div>
                        <p className="text-foreground font-medium">
                          Delivery window
                        </p>
                        <p className="text-muted-foreground">
                          We'll deliver your skip between 7am and 6pm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-accent/50 p-3 rounded-md">
                      <Truck className="text-primary mt-0.5" size={20} />
                      <div>
                        <p className="text-foreground font-medium">
                          Delivery notification
                        </p>
                        <p className="text-muted-foreground">
                          Our delivery team will call you 30 minutes before
                          arrival
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Card className="p-6 border-border bg-card shadow-sm h-full flex flex-col items-center justify-center text-center">
                  <CalendarDays
                    className="text-muted-foreground mb-4"
                    size={48}
                  />
                  <h3 className="text-xl font-medium mb-2">
                    Select a delivery date
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a date from the calendar to continue
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation buttons */}
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
          onClick={handleConfirm}
          disabled={!selectedDate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Continue to Payment <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
