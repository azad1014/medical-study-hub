"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  SkipForward,
  Star,
  Layers,
  Clock,
} from "lucide-react"
import { calculateSRS, ratingToQuality } from "@/lib/srs"

interface FlashcardData {
  id: string
  front: string
  back: string
  subject: string
  difficulty: number
  tags: string[]
  easeFactor: number
  interval: number
  repetitions: number
}

const mockCards: FlashcardData[] = [
  {
    id: "1",
    front: "What are the cardinal signs of acute 炎症?",
    back: "Rubor (redness), Calor (heat), Tumor (swelling), Dolor (pain), Functio laesa (loss of function)",
    subject: "病理学",
    difficulty: 2,
    tags: ["炎症", "病理学-basics"],
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  },
  {
    id: "2",
    front: "What is the mechanism of action of ACE inhibitors?",
    back: "ACE inhibitors block the conversion of angiotensin I to angiotensin II, leading to vasodilation and decreased aldosterone secretion.",
    subject: "药理学",
    difficulty: 3,
    tags: ["心血管", "降压药"],
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  },
  {
    id: "3",
    front: "List the three layers of the glomerular filtration barrier",
    back: "1. Fenestrated endothelium\n2. Glomerular basement membrane\n3. Podocyte foot processes (slit diaphragm)",
    subject: "解剖学",
    difficulty: 2,
    tags: ["肾脏", "组织学"],
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  },
  {
    id: "4",
    front: "What is the most common cause of community-acquired pneumonia?",
    back: "Streptococcus pneumoniae",
    subject: "微生物学",
    difficulty: 1,
    tags: ["呼吸系统", "细菌"],
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  },
  {
    id: "5",
    front: "Describe the pathophysiology of diabetic ketoacidosis",
    back: "Insulin deficiency \u2192 increased lipolysis \u2192 increased free fatty acids \u2192 ketone body production \u2192 代谢 acidosis with increased anion gap. Triggered by stress, infection, or non-compliance.",
    subject: "内分泌学",
    difficulty: 4,
    tags: ["糖尿病", "代谢"],
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  },
]

export function FlashcardsPage() {
  const [cards, setCards] = useState<FlashcardData[]>(mockCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionCards, setSessionCards] = useState<number>(cards.length)
  const [已复习Count, set已复习Count] = useState(0)

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  const handleRate = useCallback(
    (rating: number) => {
      if (!currentCard) return

      // Apply SRS algorithm
      const quality = ratingToQuality(rating as 0 | 1 | 2 | 3)
      const result = calculateSRS({
        quality,
        repetitions: currentCard.repetitions,
        easeFactor: currentCard.easeFactor,
        interval: currentCard.interval,
      })

      console.log(`Card ${currentCard.id}: 下一张 review in ${result.interval} days (EF: ${result.easeFactor.toFixed(2)})`)

      // Move to 下一张 card
      set已复习Count((prev) => prev + 1)
      setFlipped(false)

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        setCurrentIndex(0)
      }
    },
    [currentCard, currentIndex, cards.length]
  )

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault()
          handleFlip()
          break
        case "1":
          if (flipped) handleRate(0)
          break
        case "2":
          if (flipped) handleRate(1)
          break
        case "3":
          if (flipped) handleRate(2)
          break
        case "4":
          if (flipped) handleRate(3)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [flipped, handleFlip, handleRate])

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold mb-2">没有待复习的卡片</h2>
          <p className="text-muted-foreground">添加一些闪卡开始学习吧！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">闪卡</h1>
          <p className="text-muted-foreground text-sm mt-1">
            间隔重复复习
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {已复习Count} 已复习
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Layers className="h-3 w-3" />
            {currentIndex + 1}/{cards.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-1.5" />

      {/* Flashcard */}
      <div
        className="flashcard-container mx-auto max-w-2xl cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <Card className="flashcard-front min-h-[300px] flex items-center justify-center">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  {currentCard.subject}
                </Badge>
                {currentCard.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xl font-medium leading-relaxed">
                {currentCard.front}
              </p>
              <p className="text-sm text-muted-foreground mt-6">
                Click to reveal 答案
              </p>
            </CardContent>
          </Card>

          {/* Back */}
          <Card className="flashcard-back min-h-[300px] flex items-center justify-center">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  {currentCard.subject}
                </Badge>
                <Badge variant="success" className="text-xs">
                  答案
                </Badge>
              </div>
              <p className="text-xl font-medium leading-relaxed whitespace-pre-line">
                {currentCard.back}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rating buttons (shown when flipped) */}
      {flipped && (
        <div className="flex justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Button
            variant="outline"
            size="lg"
            className="flex-col gap-0.5 h-16 w-24 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950"
            onClick={() => handleRate(0)}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-xs">重来</span>
            <span className="text-[10px] text-muted-foreground">1</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-col gap-0.5 h-16 w-24 border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-900 dark:hover:bg-orange-950"
            onClick={() => handleRate(1)}
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="text-xs">困难</span>
            <span className="text-[10px] text-muted-foreground">2</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-col gap-0.5 h-16 w-24 border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-green-900 dark:hover:bg-green-950"
            onClick={() => handleRate(2)}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">良好</span>
            <span className="text-[10px] text-muted-foreground">3</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-col gap-0.5 h-16 w-24 border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-900 dark:hover:bg-blue-950"
            onClick={() => handleRate(3)}
          >
            <SkipForward className="h-4 w-4" />
            <span className="text-xs">简单</span>
            <span className="text-[10px] text-muted-foreground">4</span>
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex((prev) => prev - 1)
              setFlipped(false)
            }
          }}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          上一张
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentIndex < cards.length - 1) {
              setCurrentIndex((prev) => prev + 1)
              setFlipped(false)
            }
          }}
          disabled={currentIndex === cards.length - 1}
        >
          下一张
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}


