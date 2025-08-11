import React from "react"
import { FaFeather } from "react-icons/fa"

export default function TypewriterWithFeather({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const indexRef = React.useRef(0)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    // Reiniciar al cambiar el texto
    setDisplayedText("")
    setIsTyping(true)
    indexRef.current = 0

    if (!text) return

    // Primer carácter al instante
    setDisplayedText(text.charAt(0))
    indexRef.current = 1

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(indexRef.current))
        indexRef.current += 1
      } else {
        setIsTyping(false) // Ya terminó
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 50)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text])

  return (
    <div className="flex items-center text-2xl font-serif relative">
      <span>{displayedText}</span>
      <FaFeather
        className="text-yellow-400 ml-2"
        style={{
          transform: "rotate(-20deg)",
          animation: isTyping
            ? "moveFeather 0.3s infinite alternate ease-in-out"
            : "floatFeather 2s infinite ease-in-out",
        }}
      />

      <style jsx>{`
        @keyframes moveFeather {
          from {
            transform: translateY(0) rotate(-20deg);
          }
          to {
            transform: translateY(-4px) rotate(-15deg);
          }
        }
        @keyframes floatFeather {
          0% {
            transform: translateY(0) rotate(-20deg);
          }
          50% {
            transform: translateY(-6px) rotate(-20deg);
          }
          100% {
            transform: translateY(0) rotate(-20deg);
          }
        }
      `}</style>
    </div>
  )
}
