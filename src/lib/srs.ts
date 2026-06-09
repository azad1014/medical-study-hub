/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo SM-2 algorithm by Piotr Wozniak
 */

export interface SRSInput {
  quality: 0 | 1 | 2 | 3 // Again=0, Hard=1, Good=2, Easy=3
  repetitions: number
  easeFactor: number
  interval: number
}

export interface SRSOutput {
  repetitions: number
  easeFactor: number
  interval: number
  nextReviewDate: Date
}

/** SM-2 algorithm implementation */
export function calculateSRS(input: SRSInput): SRSOutput {
  let { quality, repetitions, easeFactor, interval } = input

  if (quality === 0) {
    // Again: reset interval
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions++
  }

  // Update ease factor using SM-2 formula
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Clamp ease factor to minimum of 1.3
  if (easeFactor < 1.3) easeFactor = 1.3

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    repetitions,
    easeFactor,
    interval,
    nextReviewDate,
  }
}

/** Quality mapping for flashcard ratings */
export function ratingToQuality(rating: number): 0 | 1 | 2 | 3 {
  switch (rating) {
    case 0: return 0 // Again
    case 1: return 1 // Hard
    case 2: return 2 // Good
    case 3: return 3 // Easy
    default: return 2
  }
}
