"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface RatingInputProps {
  value: number | null
  onChange: (rating: number) => void
}

const RATING_VALUES = [1, 2, 3, 4, 5] as const

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const displayValue = hovered ?? value ?? 0

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Your rating"
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex items-center gap-0.5">
        {RATING_VALUES.map((rating) => (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`Rate ${rating} star${rating > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(rating)}
            onClick={() => onChange(rating)}
            className="cursor-pointer p-0.5"
          >
            <StarIcon
              className={cn(
                "size-4 transition-colors",
                rating <= displayValue
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      {value === null && hovered === null && (
        <span className="text-xs text-muted-foreground">Rate</span>
      )}
    </div>
  )
}
