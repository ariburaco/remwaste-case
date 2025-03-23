'use client';

import { DateSelection } from '@/components/date-selection';
import { LocationSelection } from '@/components/location-selection';
import { Logo } from '@/components/logo';
import { NavSteps } from '@/components/nav-steps';
import { PaymentStep } from '@/components/payment-step';
import { PostcodeStep } from '@/components/postcode-step';
import { SkipSelection } from '@/components/skip-selection';
import { WasteTypeSelection } from '@/components/waste-type-selection';
import { useOrder } from '@/lib/context';

export default function Home() {
  const { state } = useOrder();

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-background pt-10 pb-6">
        <Logo className="mb-10" />
        <NavSteps />
      </header>

      <section className="flex-1 py-10">
        {state.step === 1 && <PostcodeStep />}
        {state.step === 2 && <WasteTypeSelection />}
        {state.step === 3 && <SkipSelection />}
        {state.step === 4 && <LocationSelection />}
        {state.step === 5 && <DateSelection />}
        {state.step === 6 && <PaymentStep />}
      </section>

      <footer className="py-6 border-t border-border text-center text-muted-foreground text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} RemWaste Case Study</p>
        </div>
      </footer>
    </main>
  );
}
