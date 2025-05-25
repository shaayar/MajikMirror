"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MagicButtonsProps {
  compliment: string
  onNewCompliment: () => void
  isLoading: boolean
}

export function MagicButtons({ compliment, onNewCompliment, isLoading }: MagicButtonsProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCopy = async () => {
    if (!compliment) return

    try {
      await navigator.clipboard.writeText(compliment)
      toast({
        title: "✨ Magic Copied!",
        description: "Your mystical compliment has been captured in the clipboard.",
      })
    } catch (error) {
      toast({
        title: "🔮 Spell Failed",
        description: "The magic couldn't reach your clipboard. Try again!",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (!compliment) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, "#1e1b4b")
    gradient.addColorStop(0.5, "#581c87")
    gradient.addColorStop(1, "#7c2d12")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Add mystical border
    ctx.strokeStyle = "#fbbf24"
    ctx.lineWidth = 8
    ctx.setLineDash([20, 10])
    ctx.strokeRect(20, 20, 760, 560)

    // Add text
    ctx.fillStyle = "#fbbf24"
    ctx.font = "bold 32px serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Word wrap
    const words = compliment.split(" ")
    const lines = []
    let currentLine = ""

    for (const word of words) {
      const testLine = currentLine + word + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > 700 && currentLine !== "") {
        lines.push(currentLine.trim())
        currentLine = word + " "
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine.trim())

    const lineHeight = 50
    const startY = 300 - (lines.length * lineHeight) / 2

    lines.forEach((line, index) => {
      ctx.fillText(line, 400, startY + index * lineHeight)
    })

    // Download
    const link = document.createElement("a")
    link.download = "mystical-compliment.png"
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "🎨 Mystical Artifact Created!",
      description: "Your magical compliment has been crafted into a beautiful image.",
    })
  }

  const handleNewCompliment = async () => {
    setIsGenerating(true)
    await onNewCompliment()
    setIsGenerating(false)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button
        onClick={handleNewCompliment}
        disabled={isLoading || isGenerating}
        className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 
                   hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6
                   rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 
                   transition-all duration-300 border-2 border-purple-400"
        style={{
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
        }}
      >
        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
        {isLoading || isGenerating ? "Conjuring Magic..." : "Tap for Compliment"}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </Button>

      {compliment && (
        <>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="group bg-purple-900/20 border-purple-400 text-purple-300 
                       hover:bg-purple-800/30 hover:text-purple-200 hover:border-purple-300
                       transition-all duration-300 hover:shadow-lg"
            style={{
              boxShadow: "0 0 15px rgba(168, 85, 247, 0.2)",
            }}
          >
            <Copy className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            Copy Magic
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            className="group bg-yellow-900/20 border-yellow-400 text-yellow-300 
                       hover:bg-yellow-800/30 hover:text-yellow-200 hover:border-yellow-300
                       transition-all duration-300 hover:shadow-lg"
            style={{
              boxShadow: "0 0 15px rgba(251, 191, 36, 0.2)",
            }}
          >
            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Download Artifact
          </Button>
        </>
      )}
    </div>
  )
}
