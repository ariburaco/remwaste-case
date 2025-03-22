"use client";

import { useOrder } from "@/lib/context";
import { cn } from "@/lib/utils";
import { 
  MapPin, 
  Trash2, 
  Truck, 
  ClipboardCheck, 
  Calendar, 
  CreditCard 
} from "lucide-react";

const steps = [
  { 
    id: 1, 
    name: "Postcode", 
    icon: MapPin 
  },
  { 
    id: 2, 
    name: "Waste Type", 
    icon: Trash2 
  },
  { 
    id: 3, 
    name: "Select Skip", 
    icon: Truck 
  },
  { 
    id: 4, 
    name: "Permit Check", 
    icon: ClipboardCheck 
  },
  { 
    id: 5, 
    name: "Choose Date", 
    icon: Calendar 
  },
  { 
    id: 6, 
    name: "Payment", 
    icon: CreditCard 
  },
];

export function NavSteps() {
  const { state, goToStep } = useOrder();
  const { step: currentStep } = state;

  return (
    <nav className="w-full overflow-x-auto py-4 no-scrollbar">
      <div className="flex items-center min-w-max px-4 md:px-0 md:justify-center space-x-2 md:space-x-4">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <button
              key={step.id}
              onClick={() => isCompleted && goToStep(step.id)}
              disabled={!isCompleted && !isActive}
              className={cn(
                "flex flex-col items-center justify-center transition-all group",
                (isActive || isCompleted) ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
            >
              <div className="flex items-center">
                <div 
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                    isActive ? "bg-primary ring-4 ring-primary/20" : 
                    isCompleted ? "bg-green-600" : "bg-muted"
                  )}
                >
                  <step.icon size={20} className={isActive || isCompleted ? "text-primary-foreground" : "text-muted-foreground"} />
                </div>
                {step.id < steps.length && (
                  <div 
                    className={cn(
                      "hidden md:block w-16 h-1 transition-all",
                      isCompleted ? "bg-green-600" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium mt-2 whitespace-nowrap",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
} 