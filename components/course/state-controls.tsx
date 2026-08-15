'use client'

import { FlaskConical } from 'lucide-react'
import { type SearchState } from '@/lib/course-data'
import { cn } from '@/lib/utils'

const OPTIONS: { value: SearchState; label: string }[] = [
  { value: 'initial', label: '初始' },
  { value: 'loading', label: '載入中' },
  { value: 'results', label: '有結果' },
  { value: 'empty', label: '無結果' },
  { value: 'error', label: '錯誤' },
  { value: 'rate-limited', label: '限流' },
]

interface StateControlsProps {
  current: SearchState
  onSelect: (state: SearchState) => void
}

export function StateControls({ current, onSelect }: StateControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-card/60 px-3 py-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <FlaskConical aria-hidden="true" className="size-3.5" />
        Demo 狀態
      </span>
      <div
        role="group"
        aria-label="切換示範狀態"
        className="flex flex-wrap gap-1"
      >
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={current === o.value}
            onClick={() => onSelect(o.value)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              current === o.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
