import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// The standard shadcn/Aceternity class-merging helper.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
