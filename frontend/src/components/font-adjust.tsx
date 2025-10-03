import type React from "react"
import { Button } from "@/components/ui/button"

const FontAdjust = ({ currentFontSize, setFont }: { currentFontSize: number, setFont: React.Dispatch<React.SetStateAction<number>> }) => {
  return (
    <div className="flex justify-end items-center gap-2 w-full mb-4">
      <Button onClick={() => setFont(currentFontSize - 1)} variant="outline" size="sm">
        -
      </Button>
      <span className="text-sm">{currentFontSize}px</span>
      <Button onClick={() => setFont(currentFontSize + 1)} variant="outline" size="sm">
        +
      </Button>
    </div>
  )
}

export default FontAdjust
