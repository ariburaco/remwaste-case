import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDimensions(length: number, width: number, height: number, unit: string = "ft"): string {
  return `${length}${unit} × ${width}${unit} × ${height}${unit}`
}

export function formatCapacity(value: number, unit: string): string {
  return `${value} ${unit}`
}

export function getSkipSizeLabel(capacity: { value: number; unit: string }): string {
  if (capacity.unit.toLowerCase() === "yd³") {
    if (capacity.value <= 4) return "Small"
    if (capacity.value <= 8) return "Medium"
    return "Large"
  }
  
  // Add other unit conversions if needed
  return "Standard"
}
