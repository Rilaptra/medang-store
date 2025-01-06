import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

/**
 * A utility function to merge tailwind classes, but with a more concise API than
 * `twMerge(clsx(...))`.
 *
 * @param inputs - The class values to be merged.
 * @returns A single class string that can be passed to elements.
 *
 * @example
 * import { cn } from '@/lib/utils'
 *
 * const classes = cn('px-4', 'py-2', 'bg-blue-500 hover:bg-blue-700')
 *
 * // classes is now "px-4 py-2 bg-blue-500 hover:bg-blue-700"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
