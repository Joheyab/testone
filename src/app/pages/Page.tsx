"use client"
import React, { useEffect, useState } from "react"
import Confetti from "react-confetti"
import FloatingCandles from "../components/FloatingCandles"
import { questions } from "../data/questions"
const LOCAL_STORAGE_KEY = "dailyQuestionsAnswers"

export default function Page() {
  const [currentDay, setCurrentDay] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [feedback, setFeedback] = useState<string | null>(null) // mensaje de feedback
  const [showConfetti, setShowConfetti] = useState(false)
  const [dayToShow, setDayToShow] = useState<number | null>(null)
  const [showModalCorrect, setShowModalCorrect] = useState(false)

  useEffect(() => {
    const today = new Date()
    const firstDay = new Date(2025, 7, 9)
    today.setHours(0, 0, 0, 0)
    firstDay.setHours(0, 0, 0, 0)

    const diffDays =
      Math.floor(
        (today.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    setCurrentDay(diffDays < 1 ? 1 : diffDays)
  }, [])

  useEffect(() => {
    const storedAnswers = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedAnswers) {
      try {
        setAnswers(JSON.parse(storedAnswers))
      } catch {}
    }
  }, [])

  // Actualiza día a mostrar cuando currentDay o answers cambien
  useEffect(() => {
    if (currentDay === null) return

    if (dayToShow !== null) return

    let unansweredDay = null
    for (let day = 1; day <= Math.min(currentDay, 10); day++) {
      if (!answers[day]) {
        unansweredDay = day
        break
      }
    }

    if (unansweredDay !== null) {
      setDayToShow(unansweredDay)
      setFeedback(null)
      setShowModalCorrect(false)
    } else {
      // No hay preguntas pendientes
      if (currentDay <= 10) {
        // Mostrar modal porque terminaste hasta hoy pero no es el último día
        setDayToShow(currentDay)
        setShowModalCorrect(true)
        setFeedback(null)
      } else {
        // Terminaste todas las preguntas (más allá del día 10)
        setDayToShow(null)
        setShowModalCorrect(false)
        setFeedback(null)
      }
    }
  }, [answers, currentDay, dayToShow])

  if (dayToShow === null) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    )
  }

  const questionData = questions.find((q) => q.day === dayToShow)
  if (!questionData) return null

  const handleAnswer = (option: string) => {
    if (option === questionData.answer) {
      setFeedback(null)
      setAnswers((prev) => {
        const updated = { ...prev, [dayToShow]: option }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
      setShowModalCorrect(true)
    } else {
      // Respuesta incorrecta
      setFeedback("Respuesta incorrecta. Intenta de nuevo.")
    }
  }

  const handleNext = () => {
    setShowModalCorrect(false)
    const nextDay = dayToShow! + 1
    if (nextDay <= Math.min(currentDay!, 10)) {
      setDayToShow(nextDay)
    } else {
      setDayToShow(null) // Terminado
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <FloatingCandles />
      <main className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold mb-6">Día #{dayToShow}</h1>
          <p className="mb-4 text-xl">{questionData.question}</p>
          <div className="grid grid-cols-1 gap-3">
            {questionData.options.map((option, idx) => (
              <button
                key={idx}
                className={`bg-[#c39a1c] hover:bg-[#641e1e] text-black font-semibold py-2 px-4 rounded cursor-pointer `}
                onClick={() => handleAnswer(option)}
                disabled={showModalCorrect}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback && (
            <p className="mt-4 font-semibold text-red-400">{feedback}</p>
          )}
          {/* Modal con confeti */}
          {showModalCorrect && (
            <>
              <div
                className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 z-50 px-4"
                role="dialog"
                aria-modal="true"
              >
              <Confetti />
                <div className="bg-gray-900 rounded-lg p-8 max-w-sm w-full text-center">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                    {Object.keys(answers).length === Math.min(currentDay!, 10)
                      ? "¡Has respondido todas las preguntas disponibles! Vuelve mañana para continuar."
                      : "Respuesta correcta 🎉"}
                  </h2>
                  {Object.keys(answers).length === Math.min(currentDay!, 10) ? (
                    <p className="mt-4 text-[#c39a1c]">
                      ¡Has completado el reto de hoy! Vuelve mañana para
                      continuar.
                    </p>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="mt-4 bg-[#c39a1c] hover:bg-[#641e1e] text-black font-semibold py-2 px-6 rounded cursor-pointer"
                    >
                      Siguiente pregunta
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
