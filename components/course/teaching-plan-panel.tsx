'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import {
  TEACHING_PLANS,
  type Course,
} from '@/lib/course-data'
import { formatMeeting } from '@/lib/course-utils'
import { cn } from '@/lib/utils'
import { TeachingPlanSections } from './teaching-plan-sections'

interface TeachingPlanPanelProps {
  course: Course | null
  onClose: () => void
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function TeachingPlanPanel({ course, onClose }: TeachingPlanPanelProps) {
  const open = course !== null
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const [compact, setCompact] = useState(false)

  // Focus management: move focus in on open, trap while open.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    // move focus into the panel
    const raf = requestAnimationFrame(() => {
      closeRef.current?.focus()
    })

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const nodes = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Reset compact state whenever a new course opens.
  useEffect(() => {
    setCompact(false)
  }, [course?.id])

  if (!open || !course) return null

  const plan = course.teachingPlanId
    ? TEACHING_PLANS[course.teachingPlanId]
    : undefined

  const meetingSummary = course.meetings.map(formatMeeting).join('；')

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="關閉教學計畫"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/40 animate-in fade-in"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-card shadow-2xl duration-300 animate-in slide-in-from-right sm:w-[92vw] md:w-[88vw] lg:w-[44vw] lg:max-w-[720px]"
      >
        {/* Header */}
        <header className="shrink-0 border-b border-border bg-card px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                教學計畫
              </p>
              <h2
                id={titleId}
                className="mt-1 text-lg font-semibold text-balance text-foreground sm:text-xl"
              >
                {course.nameZh}
              </h2>
              {!compact && course.nameEn && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {course.nameEn}
                </p>
              )}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          {/* Meta — shown only in full header state */}
          <div
            className={cn(
              'grid overflow-hidden transition-[grid-template-rows,opacity] duration-200',
              compact ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
            )}
          >
            <div className="overflow-hidden">
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">授課教師</dt>
                  <dd className="font-medium text-foreground">
                    {course.instructors.join('、')}
                  </dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">學分</dt>
                  <dd className="font-medium text-foreground">
                    {course.credits}
                  </dd>
                </div>
                {meetingSummary && (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">上課時間</dt>
                    <dd className="font-medium text-foreground">
                      {meetingSummary}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div
          className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6"
          onScroll={(e) => {
            const top = e.currentTarget.scrollTop
            setCompact((prev) => (prev ? top > 24 : top > 64))
          }}
        >
          {plan ? (
            <TeachingPlanSections plan={plan} />
          ) : (
            <p className="text-sm text-muted-foreground">
              本課程目前尚未提供教學計畫內容。
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
