'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ACADEMIC_TERMS,
  DEPARTMENTS,
  type SearchFilters,
} from '@/lib/course-data'
import { FieldLabel, NativeSelect } from './controls'

interface PrimaryFiltersProps {
  filters: SearchFilters
  onChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void
  onSearch: () => void
  isLoading: boolean
}

export function PrimaryFilters({
  filters,
  onChange,
  onSearch,
  isLoading,
}: PrimaryFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-[minmax(0,44%)_minmax(0,16%)_minmax(0,26%)_auto] md:items-end">
      {/* Keyword group: search target select + text input */}
      <div>
        <FieldLabel htmlFor="keyword-input">搜尋關鍵字</FieldLabel>
        <div className="flex overflow-hidden rounded-md border border-input bg-card shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25">
          <label className="sr-only" htmlFor="search-target">
            搜尋對象
          </label>
          <select
            id="search-target"
            value={filters.searchTarget}
            onChange={(e) =>
              onChange('searchTarget', e.target.value as SearchFilters['searchTarget'])
            }
            className="h-10 shrink-0 cursor-pointer border-r border-input bg-muted/60 px-3 text-sm font-medium text-foreground outline-none"
          >
            <option value="course">課程名稱</option>
            <option value="instructor">授課教師</option>
          </select>
          <input
            id="keyword-input"
            type="text"
            value={filters.keyword}
            onChange={(e) => onChange('keyword', e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                onSearch()
              }
            }}
            placeholder={
              filters.searchTarget === 'course'
                ? '輸入課程名稱關鍵字'
                : '輸入教師姓名'
            }
            className="h-10 w-full min-w-0 bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Academic term */}
      <div>
        <FieldLabel htmlFor="academic-term">學期</FieldLabel>
        <NativeSelect
          id="academic-term"
          value={filters.academicTerm}
          onChange={(e) => onChange('academicTerm', e.target.value)}
        >
          {ACADEMIC_TERMS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Department */}
      <div>
        <FieldLabel htmlFor="department">開課系所</FieldLabel>
        <NativeSelect
          id="department"
          value={filters.department}
          onChange={(e) => onChange('department', e.target.value)}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Search action */}
      <Button
        type="button"
        onClick={onSearch}
        disabled={isLoading}
        className="h-10 px-5"
      >
        <Search aria-hidden="true" className="size-4" />
        {isLoading ? '搜尋中…' : '搜尋'}
      </Button>
    </div>
  )
}
