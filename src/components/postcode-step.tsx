'use client';

import { AddressSearch } from './address-search';

export function PostcodeStep() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-foreground">
          Enter your postcode
        </h1>
        <p className="text-muted-foreground mt-2 text-center">
          We'll show you available skip options in your area.
        </p>
      </header>

      <div className="max-w-xl mx-auto">
        <AddressSearch />

        <div className="mt-16 border border-border rounded-lg p-5 bg-card">
          <h3 className="font-semibold text-foreground mb-3">
            Why we need your address
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            We use your location to:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-primary text-xs">1</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Show skip options available in your area
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-primary text-xs">2</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Calculate accurate delivery fees based on your location
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-primary text-xs">3</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Check if your address requires special permits for skip
                placement
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
