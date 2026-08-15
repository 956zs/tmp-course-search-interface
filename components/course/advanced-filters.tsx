'use client'

import { Check } from 'lucide-react'
import {
  COMMON_CLASSIFICATIONS,
  COURSE_CATEGORIES,
  DEGREE_SYSTEMS,
  PERIOD_OPTIONS,
  WEEKDAYS,
  type SearchFilters,
} from '@/lib/course-data'
import { cn } from '@/lib/utils'
import { FieldLabel, NativeSelect } from './controls'

interface AdvancedFiltersProps {
  filters: SearchFilters
  onChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void
}

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value]
}

function CheckChip({
  checked,
  label,
  onToggle,
}: {
  checked: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors',
        checked
          ? 'border-primary bg-accent text-accent-foreground'
          : 'border-input bg-card text-foreground hover:bg-muted',
      )}
    >
      <span
        className={cn(
          'flex size-4 items-center justify-center rounded-[4px] border transition-colors',
          checked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/40 bg-card',
        )}
        aria-hidden="true"
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onToggle}
      />
      {label}
    </label>
  )
}

export function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* Degree system */}
      <div>
        <FieldLabel htmlFor="degree-system">學制</FieldLabel>
        <NativeSelect
          id="degree-system"
          value={filters.degreeSystem}
          onChange={(e) => onChange('degreeSystem', e.target.value)}
        >
          {DEGREE_SYSTEMS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Weekday */}
      <div>
        <FieldLabel htmlFor="weekday">上課星期</FieldLabel>
        <NativeSelect
          id="weekday"
          value={filters.weekday}
          onChange={(e) => onChange('weekday', e.target.value)}
        >
          {WEEKDAYS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Common-course classification */}
      <div>
        <FieldLabel htmlFor="common-classification">通識分類</FieldLabel>
        <NativeSelect
          id="common-classification"
          value={filters.commonClassification}
          onChange={(e) => onChange('commonClassification', e.target.value)}
        >
          {COMMON_CLASSIFICATIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Foreign-language-only checkbox */}
      <div className="flex items-end">
        <label className="inline-flex cursor-pointer items-center gap-2 py-1.5 text-sm text-foreground">
          <span
            className={cn(
              'flex size-5 items-center justify-center rounded-[5px] border transition-colors',
              filters.foreignLanguageOnly
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/40 bg-card',
            )}
            aria-hidden="true"
          >
            {filters.foreignLanguageOnly && (
              <Check className="size-3.5" strokeWidth={3} />
            )}
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={filters.foreignLanguageOnly}
            onChange={(e) => onChange('foreignLanguageOnly', e.target.checked)}
          />
          僅顯示全外語授課課程
        </label>
      </div>

      {/* Period multi-selection */}
      <fieldset className="sm:col-span-2 lg:col-span-3">
        <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
          節次（可複選）
        </legend>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((p) => (
            <CheckChip
              key={p.value}
              label={p.label}
              checked={filters.periods.includes(p.value)}
              onToggle={() =>
                onChange('periods', toggleInArray(filters.periods, p.value))
              }
            />
          ))}
        </div>
      </fieldset>

      {/* Course-category multi-selection */}
      <fieldset className="sm:col-span-2 lg:col-span-3">
        <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
          課程類別（可複選）
        </legend>
        <div className="flex flex-wrap gap-2">
          {COURSE_CATEGORIES.map((c) => (
            <CheckChip
              key={c.value}
              label={c.label}
              checked={filters.courseCategories.includes(c.value)}
              onToggle={() =>
                onChange(
                  'courseCategories',
                  toggleInArray(filters.courseCategories, c.value),
                )
              }
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
