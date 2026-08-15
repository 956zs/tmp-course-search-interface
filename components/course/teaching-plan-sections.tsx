'use client'

import { type TeachingLanguage, type TeachingPlan } from '@/lib/course-data'

function hasText(v?: string): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

/** Renders plain text, preserving meaningful line breaks. Never interprets HTML. */
function PlainText({ children }: { children: string }) {
  return (
    <p className="text-sm leading-relaxed whitespace-pre-line text-pretty text-foreground">
      {children}
    </p>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function InfoField({ label, value }: { label: string; value?: string }) {
  if (!hasText(value)) return null
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function formatLanguage(lang?: TeachingLanguage): string | undefined {
  if (!lang) return undefined
  const parts = [lang.primary, lang.secondary, lang.tertiary].filter(hasText)
  if (parts.length === 0 && !lang.fullyForeign) return undefined
  let out = parts.join('、')
  if (lang.fullyForeign) {
    out = out ? `${out}（全外語授課）` : '全外語授課'
  }
  return out
}

export function TeachingPlanSections({ plan }: { plan: TeachingPlan }) {
  const { courseInfo, goals, weeklyOutline, assessment, materials, other } =
    plan

  const infoFields = [
    { label: '開課學期', value: courseInfo.academicTerm },
    { label: '班級', value: courseInfo.class },
    { label: '學分數', value: courseInfo.credits },
    { label: '授課時數', value: courseInfo.teachingHours },
    { label: '選別', value: courseInfo.selectionType },
    { label: '學程', value: courseInfo.program },
    { label: '授課方式', value: courseInfo.teachingMode },
    { label: '授課語言', value: formatLanguage(courseInfo.teachingLanguage) },
  ].filter((f) => hasText(f.value))

  const competencies = goals.coreCompetencies?.filter((c) => hasText(c.name)) ?? []
  const weeks = weeklyOutline.entries?.filter((w) => hasText(w.content)) ?? []
  const flexibleWeeks =
    other.flexibleWeeks?.filter((f) => hasText(f.content)) ?? []

  const hasGoals =
    hasText(goals.objectives) ||
    hasText(goals.expectedOutcomes) ||
    competencies.length > 0
  const hasWeekly = hasText(weeklyOutline.introduction) || weeks.length > 0
  const hasMaterials =
    hasText(materials.textbooks) || hasText(materials.references)
  const hasOther =
    hasText(other.notes) || flexibleWeeks.length > 0 || hasText(other.sdgs)

  return (
    <div>
      {/* Section 1: Course Information */}
      {infoFields.length > 0 && (
        <Section title="課程資訊">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
            {infoFields.map((f) => (
              <InfoField key={f.label} label={f.label} value={f.value} />
            ))}
          </dl>
        </Section>
      )}

      {/* Section 2: Teaching Goals */}
      {hasGoals && (
        <Section title="教學目標">
          {hasText(goals.objectives) && (
            <div>
              <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">
                課程目標
              </h4>
              <PlainText>{goals.objectives}</PlainText>
            </div>
          )}
          {hasText(goals.expectedOutcomes) && (
            <div>
              <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">
                預期學習成效
              </h4>
              <PlainText>{goals.expectedOutcomes}</PlainText>
            </div>
          )}
          {competencies.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                對應核心能力
              </h4>
              <ul className="flex flex-col gap-1.5">
                {competencies.map((c) => (
                  <li
                    key={c.sequence}
                    className="flex items-center gap-3 rounded-md bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {c.sequence}
                    </span>
                    <span className="flex-1 text-foreground">{c.name}</span>
                    {hasText(c.percentage) && (
                      <span className="font-mono text-xs font-medium text-primary">
                        {c.percentage}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* Section 3: Weekly Outline */}
      {hasWeekly && (
        <Section title="每週課程進度">
          {hasText(weeklyOutline.introduction) && (
            <PlainText>{weeklyOutline.introduction}</PlainText>
          )}
          {weeks.length > 0 && (
            <ol className="flex flex-col gap-1">
              {weeks.map((w) => (
                <li
                  key={w.sequence}
                  className="flex gap-3 rounded-md border border-border/60 px-3 py-2 text-sm"
                >
                  <span className="w-16 shrink-0 font-medium text-muted-foreground">
                    {w.sequence}
                  </span>
                  <span className="text-foreground">{w.content}</span>
                </li>
              ))}
            </ol>
          )}
        </Section>
      )}

      {/* Section 4: Assessment */}
      {hasText(assessment) && (
        <Section title="評量方式">
          <PlainText>{assessment}</PlainText>
        </Section>
      )}

      {/* Section 5: Materials */}
      {hasMaterials && (
        <Section title="教材與參考書目">
          {hasText(materials.textbooks) && (
            <div>
              <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">
                教科書
              </h4>
              <PlainText>{materials.textbooks}</PlainText>
            </div>
          )}
          {hasText(materials.references) && (
            <div>
              <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">
                參考書目
              </h4>
              <PlainText>{materials.references}</PlainText>
            </div>
          )}
        </Section>
      )}

      {/* Section 6: Other Information */}
      {hasOther && (
        <Section title="其他資訊">
          {hasText(other.notes) && (
            <div>
              <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">
                備註
              </h4>
              <PlainText>{other.notes}</PlainText>
            </div>
          )}
          {flexibleWeeks.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                彈性教學週
              </h4>
              <ul className="flex flex-col gap-2">
                {flexibleWeeks.map((f, i) => (
                  <li
                    key={i}
                    className="rounded-md bg-muted/50 px-3 py-2.5 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-foreground">
                        {f.content}
                      </span>
                      {hasText(f.hours) && (
                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                          {f.hours}
                        </span>
                      )}
                    </div>
                    {hasText(f.description) && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {f.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasText(other.sdgs) && (
            <div>
              <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">
                永續發展目標（SDGs）
              </h4>
              <PlainText>{other.sdgs}</PlainText>
            </div>
          )}
        </Section>
      )}
    </div>
  )
}
