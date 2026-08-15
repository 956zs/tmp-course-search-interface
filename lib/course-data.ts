// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SearchTarget = 'course' | 'instructor'

export type SearchState =
  | 'initial'
  | 'loading'
  | 'empty'
  | 'results'
  | 'error'
  | 'rate-limited'

export interface CourseMeeting {
  weekday: string
  periods: string[]
  location: string | null
  /** true when the source meeting string could not be normalized */
  unrecognized?: boolean
  /** original, un-parsed meeting string (only when unrecognized) */
  raw?: string
}

export interface Course {
  id: string
  nameZh: string
  nameEn?: string
  /** e.g. 必修 / 選修 / 通識 */
  selectionType: string
  credits: number
  code: string
  offeringNumber: string
  department: string
  instructors: string[]
  meetings: CourseMeeting[]
  enrollmentLimit: number
  currentEnrollment: number
  prerequisite?: string
  notes?: string
  detailAvailable: boolean
  teachingPlanId?: string
}

export interface CoreCompetency {
  sequence: string
  name: string
  percentage: string
}

export interface WeeklyOutlineEntry {
  sequence: string
  content: string
}

export interface FlexibleWeekEntry {
  content: string
  hours: string
  description: string
}

export interface TeachingLanguage {
  primary?: string
  secondary?: string
  tertiary?: string
  fullyForeign?: boolean
}

export interface TeachingPlan {
  id: string
  courseInfo: {
    academicTerm?: string
    class?: string
    credits?: string
    teachingHours?: string
    selectionType?: string
    program?: string
    teachingMode?: string
    teachingLanguage?: TeachingLanguage
  }
  goals: {
    objectives?: string
    expectedOutcomes?: string
    coreCompetencies?: CoreCompetency[]
  }
  weeklyOutline: {
    introduction?: string
    entries?: WeeklyOutlineEntry[]
  }
  assessment?: string
  materials: {
    textbooks?: string
    references?: string
  }
  other: {
    notes?: string
    flexibleWeeks?: FlexibleWeekEntry[]
    sdgs?: string
  }
}

export interface SearchFilters {
  searchTarget: SearchTarget
  keyword: string
  academicTerm: string
  department: string
  // advanced
  degreeSystem: string
  weekday: string
  commonClassification: string
  foreignLanguageOnly: boolean
  periods: string[]
  courseCategories: string[]
}

// ---------------------------------------------------------------------------
// Option sources for the form controls
// ---------------------------------------------------------------------------

export const ACADEMIC_TERMS = [
  { value: '1141', label: '114 學年度第 1 學期' },
  { value: '1132', label: '113 學年度第 2 學期' },
  { value: '1131', label: '113 學年度第 1 學期' },
]

export const DEPARTMENTS = [
  { value: 'all', label: '全部系所' },
  { value: 'cs', label: '資訊工程學系' },
  { value: 'ee', label: '電機工程學系' },
  { value: 'ba', label: '企業管理學系' },
  { value: 'fll', label: '外國語文學系' },
  { value: 'ge', label: '通識教育中心' },
]

export const DEGREE_SYSTEMS = [
  { value: 'all', label: '不限' },
  { value: 'bachelor', label: '學士班' },
  { value: 'master', label: '碩士班' },
  { value: 'phd', label: '博士班' },
]

export const WEEKDAYS = [
  { value: 'all', label: '不限' },
  { value: 'mon', label: '星期一' },
  { value: 'tue', label: '星期二' },
  { value: 'wed', label: '星期三' },
  { value: 'thu', label: '星期四' },
  { value: 'fri', label: '星期五' },
]

export const COMMON_CLASSIFICATIONS = [
  { value: 'all', label: '不限' },
  { value: 'humanities', label: '人文學類' },
  { value: 'social', label: '社會科學類' },
  { value: 'natural', label: '自然科學類' },
  { value: 'life', label: '生命科學類' },
]

export const PERIOD_OPTIONS = [
  { value: '1', label: '第 1 節' },
  { value: '2', label: '第 2 節' },
  { value: '3', label: '第 3 節' },
  { value: '4', label: '第 4 節' },
  { value: '5', label: '第 5 節' },
  { value: '6', label: '第 6 節' },
  { value: '7', label: '第 7 節' },
  { value: '8', label: '第 8 節' },
]

export const COURSE_CATEGORIES = [
  { value: 'required', label: '必修' },
  { value: 'elective', label: '選修' },
  { value: 'general', label: '通識' },
  { value: 'pe', label: '體育' },
  { value: 'teacher', label: '教育學程' },
]

export const DEFAULT_FILTERS: SearchFilters = {
  searchTarget: 'course',
  keyword: '',
  academicTerm: '1141',
  department: 'all',
  degreeSystem: 'all',
  weekday: 'all',
  commonClassification: 'all',
  foreignLanguageOnly: false,
  periods: [],
  courseCategories: [],
}

// ---------------------------------------------------------------------------
// Mock teaching plans
// ---------------------------------------------------------------------------

const fullTeachingPlan: TeachingPlan = {
  id: 'tp-algorithms',
  courseInfo: {
    academicTerm: '114 學年度第 1 學期',
    class: '資工三甲',
    credits: '3 學分',
    teachingHours: '每週 3 小時',
    selectionType: '必修',
    program: '資訊工程學系學士班',
    teachingMode: '實體授課',
    teachingLanguage: {
      primary: '中文',
      secondary: '英文',
      tertiary: undefined,
      fullyForeign: false,
    },
  },
  goals: {
    objectives:
      '本課程旨在建立學生對演算法設計與分析的系統性理解。\n透過分治、動態規劃、貪婪法與圖論等主題，培養學生將真實問題形式化並設計有效率解法的能力。',
    expectedOutcomes:
      '修畢本課程後，學生應能：\n1. 分析演算法的時間與空間複雜度。\n2. 針對給定問題選擇合適的演算法典範。\n3. 以程式實作並驗證演算法之正確性與效能。',
    coreCompetencies: [
      { sequence: '1', name: '專業知識與問題解決能力', percentage: '40%' },
      { sequence: '2', name: '程式設計與系統實作能力', percentage: '30%' },
      { sequence: '3', name: '邏輯推理與分析能力', percentage: '20%' },
      { sequence: '4', name: '團隊合作與溝通表達', percentage: '10%' },
    ],
  },
  weeklyOutline: {
    introduction:
      '每週包含一次課堂講授與一次習題討論。作業於每兩週發布一次，需於指定時間前繳交。',
    entries: [
      { sequence: '第 1 週', content: '課程介紹、複雜度分析與漸進符號' },
      { sequence: '第 2 週', content: '分治法：合併排序與快速排序' },
      { sequence: '第 3 週', content: '分治法進階與遞迴關係式求解' },
      { sequence: '第 4 週', content: '動態規劃導論：最長共同子序列' },
      { sequence: '第 5 週', content: '動態規劃：背包問題與矩陣鏈乘' },
      { sequence: '第 6 週', content: '貪婪演算法：活動選擇與霍夫曼編碼' },
      { sequence: '第 7 週', content: '圖論基礎與圖的表示法' },
      { sequence: '第 8 週', content: '最短路徑：Dijkstra 與 Bellman-Ford' },
      { sequence: '第 9 週', content: '期中考' },
      { sequence: '第 10 週', content: '最小生成樹：Kruskal 與 Prim' },
      { sequence: '第 11 週', content: '網路流與最大流最小割定理' },
      { sequence: '第 12 週', content: 'NP 完備性與化約' },
    ],
  },
  assessment:
    '平時作業　30%\n期中考試　30%\n期末專題　30%\n課堂參與　10%\n\n期末專題須以三人為一組，實作並比較兩種以上演算法典範，並於期末週進行口頭報告。',
  materials: {
    textbooks:
      'Cormen, Leiserson, Rivest, and Stein, "Introduction to Algorithms", 4th Edition, MIT Press, 2022.',
    references:
      'Kleinberg and Tardos, "Algorithm Design", Pearson, 2005.\nSedgewick and Wayne, "Algorithms", 4th Edition, Addison-Wesley, 2011.',
  },
  other: {
    notes:
      '請攜帶筆記型電腦參與習題討論課。\n缺席超過三次者，學期成績以不及格計。',
    flexibleWeeks: [
      {
        content: '線上非同步教學：演算法視覺化工具實作',
        hours: '3 小時',
        description: '學生於指定平台完成互動式演算法模擬並繳交心得。',
      },
      {
        content: '業界講座：演算法於推薦系統之應用',
        hours: '2 小時',
        description: '邀請業界工程師分享大規模系統中的演算法設計取捨。',
      },
    ],
    sdgs: 'SDG 4 優質教育、SDG 9 產業創新與基礎設施',
  },
}

const minimalTeachingPlan: TeachingPlan = {
  id: 'tp-english',
  courseInfo: {
    academicTerm: '114 學年度第 1 學期',
    credits: '2 學分',
    selectionType: '選修',
    teachingMode: '實體授課',
    teachingLanguage: {
      primary: '英文',
      fullyForeign: true,
    },
  },
  goals: {
    objectives:
      'This course develops academic writing skills for students in science and engineering, with emphasis on clarity, structure, and argumentation.',
    coreCompetencies: [
      { sequence: '1', name: '外語溝通能力', percentage: '60%' },
      { sequence: '2', name: '批判思考能力', percentage: '40%' },
    ],
  },
  weeklyOutline: {
    entries: [
      { sequence: 'Week 1', content: 'Course orientation and diagnostic writing' },
      { sequence: 'Week 2', content: 'Paragraph structure and cohesion' },
      { sequence: 'Week 3', content: 'Summarizing academic sources' },
    ],
  },
  assessment: 'Weekly writing tasks 50%\nFinal portfolio 50%',
  materials: {
    references:
      'Swales and Feak, "Academic Writing for Graduate Students", University of Michigan Press.',
  },
  other: {
    sdgs: 'SDG 4 優質教育',
  },
}

export const TEACHING_PLANS: Record<string, TeachingPlan> = {
  [fullTeachingPlan.id]: fullTeachingPlan,
  [minimalTeachingPlan.id]: minimalTeachingPlan,
}

// ---------------------------------------------------------------------------
// Mock courses — deliberately covers the required variants
// ---------------------------------------------------------------------------

export const COURSES: Course[] = [
  // 1. Normal course with complete detail
  {
    id: 'c-1',
    nameZh: '演算法',
    nameEn: 'Algorithms',
    selectionType: '必修',
    credits: 3,
    code: 'CS3010',
    offeringNumber: '2041',
    department: '資訊工程學系',
    instructors: ['林俊宏'],
    meetings: [
      { weekday: '星期二', periods: ['03', '04'], location: '二館 M2415' },
      { weekday: '星期四', periods: ['03'], location: '二館 M2415' },
    ],
    enrollmentLimit: 60,
    currentEnrollment: 25,
    prerequisite: '資料結構（須及格）',
    notes: '本課程包含程式實作作業，請自備筆電。',
    detailAvailable: true,
    teachingPlanId: 'tp-algorithms',
  },
  // 2. Course with multiple instructors
  {
    id: 'c-2',
    nameZh: '專題研究',
    nameEn: 'Undergraduate Research Project',
    selectionType: '選修',
    credits: 2,
    code: 'CS4990',
    offeringNumber: '2088',
    department: '資訊工程學系',
    instructors: ['陳美玲', '王志豪', '張哲瑋'],
    meetings: [{ weekday: '星期五', periods: ['06', '07', '08'], location: '研究大樓 R501' }],
    enrollmentLimit: 30,
    currentEnrollment: 12,
    notes: '需事先與指導教師聯繫並取得同意。',
    detailAvailable: false,
  },
  // 3 & 4. Course with multiple meetings, without English name
  {
    id: 'c-3',
    nameZh: '微積分（一）',
    selectionType: '必修',
    credits: 4,
    code: 'MATH1010',
    offeringNumber: '1002',
    department: '應用數學系',
    instructors: ['黃淑芬'],
    meetings: [
      { weekday: '星期一', periods: ['02', '03'], location: '綜合大樓 A101' },
      { weekday: '星期三', periods: ['02', '03'], location: '綜合大樓 A101' },
    ],
    enrollmentLimit: 80,
    currentEnrollment: 74,
    detailAvailable: false,
  },
  // 5. Course without Teaching Plan (detailAvailable false) — English-taught
  {
    id: 'c-4',
    nameZh: '學術英文寫作',
    nameEn: 'Academic English Writing',
    selectionType: '選修',
    credits: 2,
    code: 'FLL2200',
    offeringNumber: '3015',
    department: '外國語文學系',
    instructors: ['Sarah Johnson'],
    meetings: [{ weekday: '星期三', periods: ['05', '06'], location: '文學院 H302' }],
    enrollmentLimit: 25,
    currentEnrollment: 25,
    detailAvailable: true,
    teachingPlanId: 'tp-english',
  },
  // 6. Course with missing optional fields (no location, no notes/prereq)
  {
    id: 'c-5',
    nameZh: '通識：科技與社會',
    nameEn: 'Science, Technology and Society',
    selectionType: '通識',
    credits: 2,
    code: 'GE1500',
    offeringNumber: '5021',
    department: '通識教育中心',
    instructors: ['吳建德'],
    meetings: [{ weekday: '星期四', periods: ['06', '07'], location: null }],
    enrollmentLimit: 50,
    currentEnrollment: 33,
    detailAvailable: false,
  },
  // 7. Course with unrecognized meeting format
  {
    id: 'c-6',
    nameZh: '服務學習（二）',
    selectionType: '必修',
    credits: 0,
    code: 'SL0020',
    offeringNumber: '9001',
    department: '學生事務處',
    instructors: ['社團指導老師'],
    meetings: [
      {
        weekday: '',
        periods: [],
        location: null,
        unrecognized: true,
        raw: '時間另行公告 / 密集課程',
      },
    ],
    enrollmentLimit: 120,
    currentEnrollment: 40,
    notes: '上課時間依各服務單位安排，請留意公告。',
    detailAvailable: false,
  },
  // 8. Course at full capacity
  {
    id: 'c-7',
    nameZh: '資料庫系統',
    nameEn: 'Database Systems',
    selectionType: '選修',
    credits: 3,
    code: 'CS3200',
    offeringNumber: '2055',
    department: '資訊工程學系',
    instructors: ['李文昌'],
    meetings: [{ weekday: '星期一', periods: ['07', '08', '09'], location: '二館 M2310' }],
    enrollmentLimit: 55,
    currentEnrollment: 55,
    prerequisite: '資料結構',
    detailAvailable: false,
  },
  // extra course to give scrollable results
  {
    id: 'c-8',
    nameZh: '作業系統',
    nameEn: 'Operating Systems',
    selectionType: '必修',
    credits: 3,
    code: 'CS3100',
    offeringNumber: '2049',
    department: '資訊工程學系',
    instructors: ['鄭雅雯'],
    meetings: [
      { weekday: '星期二', periods: ['06', '07'], location: '二館 M2415' },
      { weekday: '星期五', periods: ['03'], location: '二館 M2320' },
    ],
    enrollmentLimit: 60,
    currentEnrollment: 48,
    detailAvailable: false,
  },
  {
    id: 'c-9',
    nameZh: '線性代數',
    nameEn: 'Linear Algebra',
    selectionType: '必修',
    credits: 3,
    code: 'MATH2010',
    offeringNumber: '1020',
    department: '應用數學系',
    instructors: ['蔡宗翰'],
    meetings: [{ weekday: '星期四', periods: ['02', '03', '04'], location: '綜合大樓 A205' }],
    enrollmentLimit: 70,
    currentEnrollment: 61,
    detailAvailable: false,
  },
]
