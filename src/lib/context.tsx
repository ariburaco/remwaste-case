'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Skip } from './api';
import { createQueryClient } from './query-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface OrderState {
  postcode: string;
  wasteType: string[];
  heavyWasteTypes: string[];
  selectedSkip: Skip | null;
  permitRequired: boolean;
  date: Date | null;
  address: string;
  step: number;
  skipLocation: string;
  skipPhoto: File | null;
}

interface OrderContextType {
  state: OrderState;
  updatePostcode: (postcode: string) => void;
  updateWasteType: (types: string[]) => void;
  updateHeavyWasteTypes: (types: string[]) => void;
  selectSkip: (skip: Skip) => void;
  updatePermit: (required: boolean) => void;
  updateDate: (date: Date) => void;
  updateAddress: (address: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSkipLocation: (location: string) => void;
  setSkipPhoto: (photo: File) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrderState>({
    postcode: '',
    wasteType: [],
    heavyWasteTypes: [],
    selectedSkip: null,
    permitRequired: false,
    date: null,
    address: '',
    step: 1,
    skipLocation: 'private',
    skipPhoto: null,
  });

  const updatePostcode = (postcode: string) => {
    setState((prev) => ({ ...prev, postcode }));
  };

  const updateWasteType = (types: string[]) => {
    setState((prev) => ({ ...prev, wasteType: types }));
  };

  const updateHeavyWasteTypes = (types: string[]) => {
    setState((prev) => ({ ...prev, heavyWasteTypes: types }));
  };

  const selectSkip = (skip: Skip) => {
    setState((prev) => ({ ...prev, selectedSkip: skip }));
  };

  const updatePermit = (required: boolean) => {
    setState((prev) => ({ ...prev, permitRequired: required }));
  };

  const updateDate = (date: Date) => {
    setState((prev) => ({ ...prev, date }));
  };

  const updateAddress = (address: string) => {
    setState((prev) => ({ ...prev, address }));
  };

  const setSkipLocation = (location: string) => {
    setState((prev) => ({
      ...prev,
      skipLocation: location,
      permitRequired: location === 'public',
    }));
  };

  const setSkipPhoto = (photo: File) => {
    setState((prev) => ({ ...prev, skipPhoto: photo }));
  };

  const goToStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const nextStep = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  return (
    <QueryClientProvider client={getQueryClient()}>
      <OrderContext.Provider
        value={{
          state,
          updatePostcode,
          updateWasteType,
          updateHeavyWasteTypes,
          selectSkip,
          updatePermit,
          updateDate,
          updateAddress,
          goToStep,
          nextStep,
          prevStep,
          setSkipLocation,
          setSkipPhoto,
        }}
      >
        {children}
      </OrderContext.Provider>
    </QueryClientProvider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
