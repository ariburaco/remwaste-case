"use client";

import { useOrder } from "@/lib/context";
import { NavSteps } from "@/components/nav-steps";
import { SkipSelection } from "@/components/skip-selection";
import { PostcodeStep } from "@/components/postcode-step";
import { WasteTypeSelection } from "@/components/waste-type-selection";
import { Logo } from "@/components/logo";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

// This would be replaced by actual step components in a full implementation
const StepPlaceholder = ({ title }: { title: string }) => (
  <div className="w-full max-w-6xl mx-auto px-4">
    <h1 className="text-3xl font-bold text-center md:text-left mb-8 text-foreground">{title}</h1>
    <div className="bg-card p-12 rounded-xl text-center border border-border">
      <div className="flex justify-center mb-4">
        <AlertTriangle size={40} className="text-primary/60" />
      </div>
      <p className="text-muted-foreground">This is a placeholder for the {title.toLowerCase()} step.</p>
      <p className="mt-4 text-sm text-muted-foreground">
        For this case study, only the first three steps are fully implemented.
      </p>
    </div>
  </div>
);

export default function Home() {
  const { state } = useOrder();
  
  // Note: For a real application, we would remove this and allow natural progression through steps
  
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-background pt-10 pb-6 border-b border-border">
        <Logo className="mb-10" />
        <NavSteps />
      </header>
      
      <section className="flex-1 py-10">
        {state.step === 1 && <PostcodeStep />}
        {state.step === 2 && <WasteTypeSelection />}
        {state.step === 3 && <SkipSelection />}
        {state.step === 4 && <StepPlaceholder title="Permit Check" />}
        {state.step === 5 && <StepPlaceholder title="Choose Date" />}
        {state.step === 6 && <StepPlaceholder title="Payment" />}
      </section>
      
      <footer className="py-6 border-t border-border text-center text-muted-foreground text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} RemWaste. All rights reserved.</p>
          <p className="mt-2">
            Version 1.0.27
          </p>
        </div>
      </footer>
    </main>
  );
}
