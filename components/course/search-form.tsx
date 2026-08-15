'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type SearchFilters } from '@/lib/course-data'
import { deriveFilterChips } from '@/lib/course-utils'
import { cn } from '@/lib/utils'
import { PrimaryFilters } from './primary-filters'
import { AdvancedFilters } from './advanced-filters'

interface SearchFormProps {
  filters: SearchFilters
  onChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void
  onSearch: () => void
  isLoading: boolean
  advancedOpen: boolean
  onToggleAdvanced: () => void
  onRemoveChip: (key: string, itemValue?: string) => void
  onClearAll: () => void
}

export function SearchForm({
  filters,
  onChange,
  onSearch,
  isLoading,
  advancedOpen,
  onToggleAdvanced,
  onRemoveChip,
  onClearAll,
}: SearchFormProps) {
  const chips = deriveFilterChips(filters)

  return (
    <section
      aria-label="課程搜尋條件"
      className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <PrimaryFilters
        filters={filters}
        onChange={onChange}
        onSearch={onSearch}
        isLoading={isLoading}
      />

      {/* Advanced toggle */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleAdvanced}
          aria-expanded={advancedOpen}
          aria-controls="advanced-filters-region"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal aria-hidden="true" className="size-3.5" />
          更多篩選
          <span
            className={cn(
              'ml-0.5 text-xs transition-transform duration-200',
              advancedOpen && 'rotate-180',
            )}
            aria-hidden="true"
          >
            ▾
          </span>
        </Button>
      </div>

      {/* Advanced filters — animated collapse via grid-template-rows */}
      <div
        id="advanced-filters-region"
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          advancedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden" inert={!advancedOpen}>
          <div className="pt-4">
            <AdvancedFilters filters={filters} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="text-xs font-medium text-muted-foreground">
            已套用條件：
          </span>
          {chips.map((chip) => (
            <button
              key={`${String(chip.key)}-${chip.itemValue ?? ''}`}
              type="button"
              onClick={() => onRemoveChip(String(chip.key), chip.itemValue)}
              className="group inline-flex items-center gap-1 rounded-full border border-border bg-accent/60 py-1 pr-1.5 pl-2.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent"
            >
              {chip.label}
              <span className="flex size-4 items-center justify-center rounded-full bg-accent-foreground/10 transition-colors group-hover:bg-accent-foreground/20">
                <X aria-hidden="true" className="size-3" />
              </span>
              <span className="sr-only">移除此條件</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="ml-auto text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            清除所有篩選
          </button>
        </div>
      )}
    </section>
  )
}
