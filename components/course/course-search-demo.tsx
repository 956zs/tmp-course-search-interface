'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  COURSES,
  DEFAULT_FILTERS,
  type Course,
  type SearchFilters,
  type SearchState,
} from '@/lib/course-data'
import { filtersEqual, summariseFilters } from '@/lib/course-utils'
import { SearchForm } from './search-form'
import { ResultsArea } from './results-area'
import { TeachingPlanPanel } from './teaching-plan-panel'
import { StateControls } from './state-controls'

const CATEGORY_TO_SELECTION: Record<string, string> = {
  required: '必修',
  elective: '選修',
  general: '通識',
}

function runSearch(filters: SearchFilters): Course[] {
  const keyword = filters.keyword.trim()
  return COURSES.filter((course) => {
    if (keyword) {
      const haystack =
        filters.searchTarget === 'course'
          ? `${course.nameZh} ${course.nameEn ?? ''}`
          : course.instructors.join(' ')
      if (!haystack.toLowerCase().includes(keyword.toLowerCase())) return false
    }

    if (filters.courseCategories.length > 0) {
      const wanted = filters.courseCategories
        .map((c) => CATEGORY_TO_SELECTION[c])
        .filter(Boolean)
      if (wanted.length > 0 && !wanted.includes(course.selectionType))
        return false
    }

    return true
  })
}

export function CourseSearchDemo() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilters>(DEFAULT_FILTERS)
  const [searchState, setSearchState] = useState<SearchState>('initial')
  const [results, setResults] = useState<Course[]>([])
  const [draftedIds, setDraftedIds] = useState<Set<string>>(new Set())
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollY = useRef(0)
  const planTrigger = useRef<HTMLElement | null>(null)

  const handleChange = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const performSearch = useCallback(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    const snapshot = { ...filters }
    setSearchState('loading')
    searchTimer.current = setTimeout(() => {
      const found = runSearch(snapshot)
      setResults(found)
      setAppliedFilters(snapshot)
      setSearchState(found.length > 0 ? 'results' : 'empty')
    }, 700)
  }, [filters])

  // Auto-collapse advanced filters when the user scrolls the page down.
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      if (y > lastScrollY.current && y > 120 && advancedOpen) {
        setAdvancedOpen(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [advancedOpen])

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
    }
  }, [])

  const handleRemoveChip = useCallback((key: string, itemValue?: string) => {
    setFilters((prev) => {
      const next = { ...prev }
      switch (key) {
        case 'keyword':
          next.keyword = ''
          break
        case 'department':
          next.department = 'all'
          break
        case 'degreeSystem':
          next.degreeSystem = 'all'
          break
        case 'weekday':
          next.weekday = 'all'
          break
        case 'commonClassification':
          next.commonClassification = 'all'
          break
        case 'foreignLanguageOnly':
          next.foreignLanguageOnly = false
          break
        case 'periods':
          next.periods = prev.periods.filter((p) => p !== itemValue)
          break
        case 'courseCategories':
          next.courseCategories = prev.courseCategories.filter(
            (c) => c !== itemValue,
          )
          break
      }
      return next
    })
  }, [])

  const handleClearAll = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      academicTerm: prev.academicTerm,
    }))
  }, [])

  const handleToggleDraft = useCallback((id: string) => {
    setDraftedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleViewPlan = useCallback(
    (course: Course, trigger: HTMLElement | null) => {
      planTrigger.current = trigger
      setSelectedCourse(course)
    },
    [],
  )

  const handleClosePlan = useCallback(() => {
    setSelectedCourse(null)
    // restore focus to the trigger button
    const trigger = planTrigger.current
    requestAnimationFrame(() => {
      trigger?.focus()
    })
  }, [])

  // Demo state override — lets reviewers preview every UI state.
  const handleForceState = useCallback(
    (state: SearchState) => {
      if (state === 'results') {
        const found = runSearch(appliedFilters)
        setResults(found.length > 0 ? found : COURSES)
        setSearchState('results')
      } else if (state === 'loading') {
        setSearchState('loading')
      } else {
        setSearchState(state)
      }
    },
    [appliedFilters],
  )

  const showingResults = searchState === 'results' || searchState === 'empty'
  const isStale =
    showingResults && !filtersEqual(filters, appliedFilters)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">課程查詢系統</p>
          <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
            課程搜尋與教學計畫
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            設定搜尋條件以查詢開課資訊，並可檢視每門課程的完整教學計畫。此為互動式
            UI Demo，資料皆為示範用途。
          </p>
        </div>
        <StateControls current={searchState} onSelect={handleForceState} />
      </header>

      <SearchForm
        filters={filters}
        onChange={handleChange}
        onSearch={performSearch}
        isLoading={searchState === 'loading'}
        advancedOpen={advancedOpen}
        onToggleAdvanced={() => setAdvancedOpen((v) => !v)}
        onRemoveChip={handleRemoveChip}
        onClearAll={handleClearAll}
      />

      <div>
        <ResultsArea
          state={searchState}
          courses={results}
          summary={summariseFilters(appliedFilters)}
          isStale={isStale}
          draftedIds={draftedIds}
          onToggleDraft={handleToggleDraft}
          onViewPlan={handleViewPlan}
          onClearAll={handleClearAll}
          onRetry={performSearch}
        />
      </div>

      <TeachingPlanPanel course={selectedCourse} onClose={handleClosePlan} />
    </div>
  )
}
