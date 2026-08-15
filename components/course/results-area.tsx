'use client'

import {
  Clock3,
  FileSearch,
  Search,
  ServerCrash,
  Timer,
} from 'lucide-react'
import { type Course, type SearchState } from '@/lib/course-data'
import { CourseCard } from './course-card'
import { SearchResultSummary } from './search-result-summary'

interface ResultsAreaProps {
  state: SearchState
  courses: Course[]
  summary: string
  isStale: boolean
  draftedIds: Set<string>
  onToggleDraft: (id: string) => void
  onViewPlan: (course: Course, trigger: HTMLElement | null) => void
  onClearAll: () => void
  onRetry: () => void
}

function StateMessage({
  icon,
  title,
  description,
  action,
  tone = 'neutral',
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  tone?: 'neutral' | 'error' | 'warning'
}) {
  const ring =
    tone === 'error'
      ? 'bg-destructive/10 text-destructive'
      : tone === 'warning'
        ? 'bg-warning/15 text-warning'
        : 'bg-muted text-muted-foreground'
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center"
    >
      <span
        className={`mb-4 flex size-12 items-center justify-center rounded-full ${ring}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-pretty text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex justify-between">
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            <div className="h-9 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="h-8 animate-pulse rounded bg-muted" />
            ))}
          </div>
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function ResultsArea({
  state,
  courses,
  summary,
  isStale,
  draftedIds,
  onToggleDraft,
  onViewPlan,
  onClearAll,
  onRetry,
}: ResultsAreaProps) {
  if (state === 'initial') {
    return (
      <StateMessage
        icon={<Search className="size-6" />}
        title="開始搜尋課程"
        description="設定上方的搜尋條件後，點擊「搜尋」以查詢符合的課程。"
      />
    )
  }

  if (state === 'loading') {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-4 animate-spin" />
          <span role="status">搜尋進行中…</span>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <StateMessage
        tone="error"
        icon={<ServerCrash className="size-6" />}
        title="搜尋時發生錯誤"
        description="無法完成本次查詢，請稍後再試一次。若問題持續發生，請聯絡系統管理員。"
        action={
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            重新搜尋
          </button>
        }
      />
    )
  }

  if (state === 'rate-limited') {
    return (
      <StateMessage
        tone="warning"
        icon={<Timer className="size-6" />}
        title="查詢過於頻繁"
        description="您的搜尋次數過多，系統暫時限制查詢。請稍候片刻後再試。"
        action={
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            再試一次
          </button>
        }
      />
    )
  }

  if (state === 'empty') {
    return (
      <div>
        <SearchResultSummary
          count={0}
          summary={summary}
          isStale={isStale}
          onClearAll={onClearAll}
        />
        <div className="mt-4">
          <StateMessage
            icon={<FileSearch className="size-6" />}
            title="沒有符合條件的課程"
            description="找不到符合目前搜尋條件的課程，請調整關鍵字或放寬篩選條件後再試。"
            action={
              <button
                type="button"
                onClick={onClearAll}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                清除所有篩選
              </button>
            }
          />
        </div>
      </div>
    )
  }

  // results
  return (
    <div>
      <SearchResultSummary
        count={courses.length}
        summary={summary}
        isStale={isStale}
        onClearAll={onClearAll}
      />
      <div className="mt-4 flex flex-col gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isDrafted={draftedIds.has(course.id)}
            onToggleDraft={onToggleDraft}
            onViewPlan={onViewPlan}
          />
        ))}
      </div>
    </div>
  )
}
