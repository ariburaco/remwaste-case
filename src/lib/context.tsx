"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Skip } from "./api";

interface OrderState {
  postcode: string;
  wasteType: string[];
  selectedSkip: Skip | null;
  permitRequired: boolean;
  date: Date | null;
  address: string;
  step: number;
}

interface OrderContextType {
  state: OrderState;
  updatePostcode: (postcode: string) => void;
  updateWasteType: (types: string[]) => void;
  selectSkip: (skip: Skip) => void;
  updatePermit: (required: boolean) => void;
  updateDate: (date: Date) => void;
  updateAddress: (address: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrderState>({
    postcode: "",
    wasteType: [],
    selectedSkip: null,
    permitRequired: false,
    date: null,
    address: "",
    step: 1,
  });

  const updatePostcode = (postcode: string) => {
    setState((prev) => ({ ...prev, postcode }));
  };

  const updateWasteType = (types: string[]) => {
    setState((prev) => ({ ...prev, wasteType: types }));
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
    <OrderContext.Provider
      value={{
        state,
        updatePostcode,
        updateWasteType,
        selectSkip,
        updatePermit,
        updateDate,
        updateAddress,
        goToStep,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
} 