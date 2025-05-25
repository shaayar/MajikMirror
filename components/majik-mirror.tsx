"use client"

import { useState, useEffect } from "react"
import { FloatingParticles } from "./floating-particles"
import { ComplimentText } from "./compliment-text"
import { MagicButtons } from "./magic-buttons"
import { speakText } from "@/lib/text-to-speech"
import { Toaster } from "@/components/ui/toaster"

export function MajikMirror() {
  const [compliment, setCompliment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCompliment, setShowCompliment] = useState(false)
  const [konamiSequence, setKonamiSequence] = useState<string[]>([])
  const [discoMode, setDiscoMode] = useState(false)

  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...konamiSequence, event.code].slice(-10)
      setKonamiSequence(newSequence)

      if (newSequence.join(",") === konamiCode.join(",")) {
        setDiscoMode(!discoMode)
        setKonamiSequence([])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [konamiSequence, discoMode])

  // Add console commands
  useEffect(() => {
    ;(window as any).mirror = {
      predictFuture: () => {
        const predictions = [
          "I see great adventures in your future, brave soul!",
          "The stars align to bring you unexpected joy tomorrow.",
          "A magical encounter awaits you when you least expect it.",
          "Your kindness will create ripples of wonder in the world.",
          "The universe is preparing a delightful surprise just for you.",
        ]
        const prediction = predictions[Math.floor(Math.random() * predictions.length)]
        console.log(`🔮 ${prediction}`)
        speakText(prediction)
      },
      discoMode: () => {
        setDiscoMode(!discoMode)
        console.log(`✨ Disco mode ${!discoMode ? "activated" : "deactivated"}!`)
      },
    }
  }, [discoMode])

  const generateCompliment = async () => {
    setIsLoading(true)
    setShowCompliment(false)

    try {
      const response = await fetch("/api/compliment", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to generate compliment")

      const data = await response.json()
      setCompliment(data.compliment)
      setShowCompliment(true)

      // Speak the compliment
      setTimeout(() => {
        speakText(data.compliment)
      }, 1000)
    } catch (error) {
      console.error("Error:", error)
      setCompliment("Even in darkness, your light shines eternal, dear one.")
      setShowCompliment(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${
        discoMode
          ? "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 animate-pulse"
          : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      }`}
    >
      <div className="relative">
        {/* Mirror Frame */}
        <div
          className="relative w-[300px] h-[400px] sm:w-[400px] sm:h-[500px] lg:w-[600px] lg:h-[800px]
                     rounded-[2rem] border-8 border-purple-400 bg-gradient-to-br from-purple-900/20 to-pink-900/20
                     shadow-2xl backdrop-blur-sm"
          style={{
            boxShadow: `
              inset 0 0 60px rgba(168, 85, 247, 0.3),
              0 0 80px rgba(168, 85, 247, 0.4),
              0 0 120px rgba(168, 85, 247, 0.2)
            `,
          }}
          aria-label="Magic Mirror"
        >
          {/* Floating Particles */}
          <FloatingParticles />

          {/* Mirror Glass Effect */}
          <div className="absolute inset-4 rounded-[1.5rem] bg-gradient-to-br from-white/5 to-white/1 backdrop-blur-md border border-white/10">
            {/* Inner Glow */}
            <div
              className="absolute inset-0 rounded-[1.5rem]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
              }}
            />

            {/* Content Area */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8">
              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-serif text-center mb-8 
                           bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent
                           drop-shadow-lg"
              >
                ✨ Majik Mirror ✨
              </h1>

              {/* Compliment Display */}
              <div className="flex-1 flex items-center justify-center px-4">
                <ComplimentText text={compliment} isVisible={showCompliment} />
              </div>

              {/* Magic Buttons */}
              <div className="mt-8">
                <MagicButtons compliment={compliment} onNewCompliment={generateCompliment} isLoading={isLoading} />
              </div>
            </div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-purple-300 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-purple-300 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-purple-300 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-purple-300 rounded-br-lg" />
        </div>

        {/* Disco Mode Indicator */}
        {discoMode && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white font-bold animate-bounce">
            🕺 DISCO MODE ACTIVATED! 🕺
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}
