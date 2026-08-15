import {
  ACADEMIC_TERMS,
  COMMON_CLASSIFICATIONS,
  COURSE_CATEGORIES,
  DEGREE_SYSTEMS,
  DEPARTMENTS,
  PERIOD_OPTIONS,
  WEEKDAYS,
  type CourseMeeting,
  type SearchFilters,
} from './course-data'

/** Format a single meeting into a human readable string, e.g. "星期二 · 03–04節 · 二館 M2415" */
export function formatMeeting(meeting: CourseMeeting): string {
  if (meeting.unrecognized) {
    return meeting.raw ?? '無法解析的上課時間'
  }

  const parts: string[] = []
  if (meeting.weekday) parts.push(meeting.weekday)

  if (meeting.periods.length > 0) {
    const periodLabel =
      meeting.periods.length === 1
        ? `${meeting.periods[0]}節`
        : `${meeting.periods[0]}–${meeting.periods[meeting.periods.length - 1]}節`
    parts.push(periodLabel)
  }

  if (meeting.location) {
    parts.push(meeting.location)
  } else {
    parts.push('教室未定')
  }

  return parts.join(' · ')
}

function labelFor(
  options: { value: string; label: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value
}

export interface FilterChip {
  key: keyof SearchFilters | string
  label: string
  /** for multi-selects, the individual value being removed */
  itemValue?: string
}

/** Derive the list of removable chips from the active filters. */
export function deriveFilterChips(filters: SearchFilters): FilterChip[] {
  const chips: FilterChip[] = []

  if (filters.keyword.trim()) {
    const targetLabel =
      filters.searchTarget === 'course' ? '課程名稱' : '授課教師'
    chips.push({
      key: 'keyword',
      label: `${targetLabel}：${filters.keyword.trim()}`,
    })
  }

  if (filters.department !== 'all') {
    chips.push({
      key: 'department',
      label: `系所：${labelFor(DEPARTMENTS, filters.department)}`,
    })
  }

  if (filters.degreeSystem !== 'all') {
    chips.push({
      key: 'degreeSystem',
      label: `學制：${labelFor(DEGREE_SYSTEMS, filters.degreeSystem)}`,
    })
  }

  if (filters.weekday !== 'all') {
    chips.push({
      key: 'weekday',
      label: `星期：${labelFor(WEEKDAYS, filters.weekday)}`,
    })
  }

  if (filters.commonClassification !== 'all') {
    chips.push({
      key: 'commonClassification',
      label: `通識分類：${labelFor(COMMON_CLASSIFICATIONS, filters.commonClassification)}`,
    })
  }

  if (filters.foreignLanguageOnly) {
    chips.push({ key: 'foreignLanguageOnly', label: '僅全外語授課' })
  }

  for (const p of filters.periods) {
    chips.push({
      key: 'periods',
      itemValue: p,
      label: `節次：${labelFor(PERIOD_OPTIONS, p)}`,
    })
  }

  for (const c of filters.courseCategories) {
    chips.push({
      key: 'courseCategories',
      itemValue: c,
      label: `類別：${labelFor(COURSE_CATEGORIES, c)}`,
    })
  }

  return chips
}

/** A short human summary of the term + keyword used for the last search. */
export function summariseFilters(filters: SearchFilters): string {
  const term = labelFor(ACADEMIC_TERMS, filters.academicTerm)
  const target = filters.searchTarget === 'course' ? '課程名稱' : '授課教師'
  const keyword = filters.keyword.trim()
  const keywordPart = keyword ? `${target}「${keyword}」` : '所有課程'
  const dept =
    filters.department === 'all'
      ? ''
      : ` · ${labelFor(DEPARTMENTS, filters.department)}`
  return `${term} · ${keywordPart}${dept}`
}

/** Shallow equality check for two filter objects. */
export function filtersEqual(a: SearchFilters, b: SearchFilters): boolean {
  return (
    a.searchTarget === b.searchTarget &&
    a.keyword.trim() === b.keyword.trim() &&
    a.academicTerm === b.academicTerm &&
    a.department === b.department &&
    a.degreeSystem === b.degreeSystem &&
    a.weekday === b.weekday &&
    a.commonClassification === b.commonClassification &&
    a.foreignLanguageOnly === b.foreignLanguageOnly &&
    a.periods.slice().sort().join(',') === b.periods.slice().sort().join(',') &&
    a.courseCategories.slice().sort().join(',') ===
      b.courseCategories.slice().sort().join(',')
  )
}
