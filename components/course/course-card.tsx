'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Plus,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Course } from '@/lib/course-data'
import { formatMeeting } from '@/lib/course-utils'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: Course
  isDrafted: boolean
  onToggleDraft: (id: string) => void
  onViewPlan: (course: Course, trigger: HTMLElement | null) => void
}

function MetaItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.7rem] tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

export function CourseCard({
  course,
  isDrafted,
  onToggleDraft,
  onViewPlan,
}: CourseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const hasExpandable = Boolean(course.prerequisite || course.notes)
  const isFull = course.currentEnrollment >= course.enrollmentLimit

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Title block */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                course.selectionType === '必修'
                  ? 'bg-primary/10 text-primary'
                  : course.selectionType === '通識'
                    ? 'bg-warning/15 text-warning'
                    : 'bg-muted text-muted-foreground',
              )}
            >
              {course.selectionType}
            </span>
            <h3 className="text-base font-semibold text-balance text-foreground sm:text-lg">
              {course.nameZh}
            </h3>
          </div>
          {course.nameEn && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {course.nameEn}
            </p>
          )}
        </div>

        {/* Credits badge */}
        <div className="flex shrink-0 items-baseline gap-1 rounded-lg bg-muted px-3 py-1.5">
          <span className="font-mono text-lg leading-none font-semibold text-foreground">
            {course.credits}
          </span>
          <span className="text-xs text-muted-foreground">學分</span>
        </div>
      </div>

      {/* Identity meta */}
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <MetaItem
          label="課程代碼"
          value={<span className="font-mono">{course.code}</span>}
        />
        <MetaItem
          label="開課序號"
          value={<span className="font-mono">{course.offeringNumber}</span>}
        />
        <MetaItem label="開課系所" value={course.department} />
        <MetaItem label="授課教師" value={course.instructors.join('、')} />
      </dl>

      {/* Meetings */}
      <div className="mt-4 flex flex-col gap-1.5">
        {course.meetings.map((meeting, i) =>
          meeting.unrecognized ? (
            <div
              key={i}
              className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-2.5 py-2 text-sm text-foreground"
            >
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-warning"
              />
              <span>
                <span className="font-medium">無法解析上課時間：</span>
                {formatMeeting(meeting)}
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  請人工確認，系統無法自動判斷是否衝堂。
                </span>
              </span>
            </div>
          ) : (
            <div
              key={i}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground"
            >
              <Clock aria-hidden="true" className="size-4 text-muted-foreground" />
              <span>{meeting.weekday}</span>
              <span className="text-muted-foreground" aria-hidden="true">
                ·
              </span>
              <span className="font-mono">
                {meeting.periods.length === 1
                  ? `${meeting.periods[0]}節`
                  : `${meeting.periods[0]}–${meeting.periods[meeting.periods.length - 1]}節`}
              </span>
              <span className="text-muted-foreground" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin aria-hidden="true" className="size-3.5" />
                {meeting.location ?? '教室未定'}
              </span>
            </div>
          ),
        )}
      </div>

      {/* Capacity + actions */}
      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Users aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">限額</span>
          <span className="font-mono font-medium text-foreground">
            {course.enrollmentLimit}
          </span>
          <span className="text-muted-foreground" aria-hidden="true">
            ·
          </span>
          <span className="text-muted-foreground">選課人數</span>
          <span
            className={cn(
              'font-mono font-medium',
              isFull ? 'text-destructive' : 'text-foreground',
            )}
          >
            {course.currentEnrollment}
          </span>
          {isFull && (
            <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
              已額滿
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasExpandable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="text-muted-foreground"
            >
              修課資訊
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'size-3.5 transition-transform',
                  expanded && 'rotate-180',
                )}
              />
            </Button>
          )}
          {course.detailAvailable && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => onViewPlan(course, e.currentTarget)}
            >
              <BookOpen aria-hidden="true" className="size-3.5" />
              查看教學計畫
            </Button>
          )}
          <Button
            type="button"
            variant={isDrafted ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onToggleDraft(course.id)}
            aria-pressed={isDrafted}
          >
            {isDrafted ? (
              <>
                <Check aria-hidden="true" className="size-3.5" />
                已加入暫定課表
              </>
            ) : (
              <>
                <Plus aria-hidden="true" className="size-3.5" />
                加入暫定課表
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expandable prerequisite / notes */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <dl className="mt-3 flex flex-col gap-2 rounded-lg bg-muted/50 p-3 text-sm">
            {course.prerequisite && (
              <div className="flex gap-2">
                <dt className="shrink-0 font-medium text-muted-foreground">
                  先修科目
                </dt>
                <dd className="text-foreground">{course.prerequisite}</dd>
              </div>
            )}
            {course.notes && (
              <div className="flex gap-2">
                <dt className="shrink-0 font-medium text-muted-foreground">
                  備註
                </dt>
                <dd className="text-foreground">{course.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </article>
  )
}
