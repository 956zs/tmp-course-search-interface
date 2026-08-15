'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const controlBase =
  'h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50'

export function FieldLabel({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground',
        className,
      )}
    >
      {children}
    </label>
  )
}

export function NativeSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(controlBase, 'cursor-pointer appearance-none pr-9', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, className)} {...props} />
}
