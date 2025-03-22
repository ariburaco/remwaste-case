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
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  return (
    <nav className="w-full overflow-x-auto py-6 no-scrollbar backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="flex items-start min-w-max px-4 md:px-0 md:justify-center space-x-4 md:space-x-8">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <motion.div
              key={step.id}
              className="flex flex-col items-center relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: step.id * 0.05 }}
            >
              <motion.button
                onClick={() => isCompleted && goToStep(step.id)}
                disabled={!isCompleted && !isActive}
                className={cn(
                  'flex flex-col items-center justify-center transition-all',
                  isActive || isCompleted
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50'
                )}
                whileHover={isCompleted ? { scale: 1.05 } : {}}
                whileTap={isCompleted ? { scale: 0.95 } : {}}
              >
                <div className="relative flex items-center mb-3">
                  <motion.div
                    className={cn(
                      'w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-md',
                      isActive
                        ? 'bg-primary ring-4 ring-primary/20'
                        : isCompleted
                        ? 'bg-green-600'
                        : 'bg-muted'
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
                    <step.icon
                      size={22}
                      strokeWidth={2}
                      className={
                        isActive || isCompleted
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
                      }
                    />
                  </motion.div>
                </div>

                <motion.span
                  className={cn(
                    'text-sm font-medium text-center w-full',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                  animate={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? 'hsl(var(--foreground))'
                      : 'hsl(var(--muted-foreground))',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {step.name}
                </motion.span>
              </motion.button>

              {isActive && (
                <motion.div
                  className="absolute w-full h-0.5 bg-primary -bottom-1 rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                />
              )}

              {step.id < steps.length && (
                <div className="absolute left-12 top-6 transform -translate-y-1/2">
                  <motion.div
                    className={cn(
                      'hidden md:block w-20 h-1 rounded-full transition-all',
                      isCompleted ? 'bg-green-600' : 'bg-muted'
                    )}
                    animate={{
                      backgroundColor: isCompleted
                        ? 'rgb(22, 163, 74)'
                        : 'hsl(var(--muted))',
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {isCompleted && (
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        className="h-full bg-green-600 rounded-full"
                        layoutId="stepProgress"
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
