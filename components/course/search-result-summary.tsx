'use client'

import { RefreshCw } from 'lucide-react'

interface SearchResultSummaryProps {
  count: number
  summary: string
  isStale: boolean
  onClearAll: () => void
}

export function SearchResultSummary({
  count,
  summary,
  isStale,
  onClearAll,
}: SearchResultSummaryProps) {
  return (
    <div className="flex flex-col gap-3 pb-1">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            找到 <span className="text-primary">{count}</span> 門課
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{summary}</p>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          清除所有篩選
        </button>
      </div>

      {isStale && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2.5 text-sm text-foreground"
        >
          <RefreshCw
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-warning"
          />
          <span>篩選條件已變更，重新搜尋後才會更新結果。</span>
        </div>
      )}
    </div>
  )
}
