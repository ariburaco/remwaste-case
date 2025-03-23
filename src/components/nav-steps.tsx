'use client';

import { useOrder } from '@/lib/context';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Trash2,
  Truck,
  ClipboardCheck,
  Calendar,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const steps = [
  {
    id: 1,
    name: 'Postcode',
    icon: MapPin,
  },
  {
    id: 2,
    name: 'Waste Type',
    icon: Trash2,
  },
  {
    id: 3,
    name: 'Select Skip',
    icon: Truck,
  },
  {
    id: 4,
    name: 'Permit Check',
    icon: ClipboardCheck,
  },
  {
    id: 5,
    name: 'Choose Date',
    icon: Calendar,
  },
  {
    id: 6,
    name: 'Payment',
    icon: CreditCard,
  },
];

export function NavSteps() {
  const { state, goToStep } = useOrder();
  const { step: currentStep } = state;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <nav className="w-full overflow-x-auto py-6 sticky top-0 z-10 shadow-sm">
      <div className="w-full flex justify-center">
        <div className="flex items-start relative px-4 md:px-0 space-x-4 sm:space-x-10 md:space-x-14 lg:space-x-20">
          <div
            className="absolute top-6 h-2"
            style={{
              left: 25,
              right: 25,
              zIndex: 0,
            }}
          >
            <motion.div
              className="absolute top-[-4px] left-0 h-full bg-primary/90 rounded-full"
              style={{
                width: `${
                  (Math.max(0, Math.min(6, currentStep - 1)) /
                    (steps.length - 1)) *
                  100
                }%`,
              }}
              initial={false}
              animate={{
                width: `${
                  (Math.max(0, Math.min(6, currentStep - 1)) /
                    (steps.length - 1)) *
                  100
                }%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isPending = step.id > currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  'relative z-10 flex flex-col items-center justify-center',
                  isPending && 'opacity-70',
                  isActive && 'scale-105'
                )}
              >
                <motion.button
                  onClick={() => (isCompleted || isActive) && goToStep(step.id)}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    'flex flex-col items-center justify-center transition-all',
                    isActive || isCompleted
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed'
                  )}
                  whileHover={isCompleted ? { scale: 1.05 } : undefined}
                  whileTap={isCompleted ? { scale: 0.95 } : undefined}
                  initial={false}
                  animate={{
                    opacity: isPending ? 0.7 : 1,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative flex items-center mb-3">
                    <motion.div
                      className={cn(
                        'w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-300 border-4',
                        isActive
                          ? 'bg-primary border-background ring-4 ring-primary/20'
                          : isCompleted
                          ? 'bg-green-600 border-background'
                          : 'bg-gray-700/30 border-background'
                      )}
                      animate={{
                        scale: isActive ? [1, 1.1, 1] : 1,
                        boxShadow: isActive
                          ? [
                              '0 0 0 0 rgba(var(--primary), 0)',
                              '0 0 0 10px rgba(var(--primary), 0.1)',
                              '0 0 0 0 rgba(var(--primary), 0)',
                            ]
                          : 'none',
                      }}
                      transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                        repeatDelay: 1,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2
                          size={24}
                          className="text-white"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <step.icon
                          size={24}
                          strokeWidth={2}
                          className={
                            isActive
                              ? 'text-primary-foreground'
                              : isPending
                              ? 'text-white/70'
                              : 'text-white'
                          }
                        />
                      )}
                      <div className="absolute z-[-1] h-12 bg-secondary rounded-full" />
                    </motion.div>
                  </div>

                  <motion.span
                    className={cn(
                      'text-[10px] md:text-sm font-medium text-center w-full transition-colors',
                      isActive
                        ? 'text-foreground'
                        : isPending
                        ? 'text-muted-foreground/70'
                        : 'text-muted-foreground'
                    )}
                    animate={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobile && step.id !== currentStep ? '' : step.name}
                  </motion.span>
                </motion.button>

                {isActive && (
                  <motion.div
                    className="absolute w-full h-0.5 bg-primary -bottom-1 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
