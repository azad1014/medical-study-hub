/** Question type enum matching Prisma */
export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "CASE_ANALYSIS"

/** Flashcard rating for SRS */
export type FlashcardRating = 0 | 1 | 2 | 3

/** Navigation item type */
export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

/** Dashboard stats */
export interface DashboardStats {
  dueCards: number
  dueQuestions: number
  mistakeCount: number
  streakDays: number
  recentSessions: Array<{
    id: string
    type: string
    duration: number
    cardsStudied: number
    startedAt: Date
  }>
  heatmapData: Array<{
    date: string
    count: number
  }>
}

/** Study session type */
export interface StudySessionData {
  id: string
  type: "flashcard" | "quiz" | "review"
  duration: number
  cardsStudied: number
  correctCount: number
  startedAt: Date
}

/** Flashcard with SRS data */
export interface FlashcardData {
  id: string
  front: string
  back: string
  subjectId?: string
  difficulty: number
  tags: string[]
  isFavorite: boolean
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: Date
}
