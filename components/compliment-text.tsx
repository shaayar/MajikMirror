"use client"

import { useState, useEffect } from "react"

interface ComplimentTextProps {
  text: string
  isVisible: boolean
}

export function ComplimentText({ text, isVisible }: ComplimentTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isVisible && text) {
      setDisplayText("")
      setCurrentIndex(0)

      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < text.length) {
            setDisplayText(text.slice(0, prev + 1))
            return prev + 1
          } else {
            clearInterval(timer)
            return prev
          }
        })
      }, 50)

      return () => clearInterval(timer)
    }
  }, [text, isVisible])

  if (!isVisible || !text) return null

  return (
    <div
      className={`
        transform transition-all duration-700 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
      style={{ transitionDelay: "300ms" }}
    >
      <p
        className="text-2xl md:text-3xl font-serif text-center leading-relaxed
                   bg-gradient-to-r from-purple-400 via-pink-300 to-yellow-300 
                   bg-clip-text text-transparent
                   drop-shadow-lg animate-pulse"
        style={{
          textShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
        }}
      >
        {displayText}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  )
}
