"use client"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import Confetti from "react-confetti"
import FloatingCandles from "../components/FloatingCandles"
import TypewriterWithFeather from "../components/TypewriterWithFeather"
import { questions } from "../data/questions"
import Header from "../components/Header"
const LOCAL_STORAGE_KEY = "dailyQuestionsAnswers"
const LOCAL_STORAGE_SCORE = "totalScore"

// URL pública de Hedwig's Theme (puedes reemplazar por la tuya)
const HEDWIG_THEME_URL = "/audio/hedwig.mp3" // Ejemplo, reemplaza con URL real o archivo local

export default function Page() {
  const [currentDay, setCurrentDay] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [dayToShow, setDayToShow] = useState<number | null>(null)
  const [showModalCorrect, setShowModalCorrect] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [showProposal, setShowProposal] = useState<boolean>(false)
  const [questionScore, setQuestionScore] = useState<number>(0)
  const [code, setCode] = useState<string>("")
  const [totalScore, setTotalScore] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const today = new Date()
    const firstDay = new Date(2025, 6, 3)
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

  useEffect(() => {
    if (currentDay === null) return

    if (dayToShow !== null) return

    let unansweredDay = null
    for (let day = 1; day <= Math.min(currentDay, 50); day++) {
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
      if (currentDay < 50) {
        // Mostrar modal porque terminaste hasta hoy pero no es el último día
        setDayToShow(currentDay)
        setShowModalCorrect(true)
        setFeedback(null)
      } else {
        // Terminaste todas las preguntas (más allá del día 10)
        setDayToShow(currentDay)
        setShowModalCorrect(false)
        setShowFinalModal(true)
        setFeedback(null)
      }
    }
  }, [answers, currentDay, dayToShow])
  useEffect(() => {
    if (showFinalModal || showModalCorrect) {
      // Cuando modal está abierto
      document.body.style.overflow = "hidden"
    } else {
      // Cuando modal está cerrado
      document.body.style.overflow = "auto"
    }

    // Limpieza en caso de que el componente se desmonte
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showFinalModal, showModalCorrect])

  const questionData = questions.find((q) => q.day === dayToShow)

  useEffect(() => {
    if (questionData) {
      setQuestionScore(questionData.score)
    }
  }, [questionData])

  if (dayToShow === null) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    )
  }

  if (!questionData) return null

  const handleAnswer = (option: string) => {
    if (option !== questionData.answer) {
      // Restar 1 si es incorrecta, pero sin bajar de 0
      setQuestionScore((prev) => Math.max(prev - 1, 0))
      setFeedback("Respuesta incorrecta. Intenta de nuevo.")
      return
    }

    // Si es correcta
    setAnswers((prev) => {
      const updated = { ...prev, [dayToShow]: option }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    setTotalScore((prev) => {
      const newScore = prev + questionScore
      localStorage.setItem(LOCAL_STORAGE_SCORE, newScore.toString())
      console.log(newScore)
      return newScore
    })

    if (dayToShow === 50) {
      setShowFinalModal(true)
      setShowConfetti(true)
      setFeedback(null)
    } else {
      setShowModalCorrect(true)
      setShowConfetti(true)
      setFeedback(null)
    }
  }

  const playAudioManually = () => {
    if (audioRef.current) {
      setTimeout(() => {
        setShowProposal(true)
      }, 8000) // 2000 ms = 2 segundos
      audioRef.current.play().catch(() => {
        alert(
          "No se pudo reproducir el audio automáticamente. Por favor, pulsa el botón de nuevo."
        )
      })
    }
  }
  const handleNext = () => {
    setShowModalCorrect(false)
    setShowConfetti(false)
    const nextDay = dayToShow + 1
    if (nextDay <= Math.min(currentDay, 50)) {
      setDayToShow(nextDay)
    } else {
      setDayToShow(null)
    }
  }

  const closeFinalModal = () => {
    setShowFinalModal(false)
    setShowConfetti(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <FloatingCandles />
      {showConfetti && <Confetti />}
      {answers[50] && <Header />}
      <main className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold mb-6">Día #{dayToShow}</h1>
          <TypewriterWithFeather
            text={questionData.question}
            key={questionData.day} // Esto reinicia solo cuando la pregunta cambia
          />
          <p className=" mb-4 text-sm">Puntaje: {questionScore}</p>
          <div className="grid grid-cols-1 gap-3">
            {questionData.day === 50 ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={`bg-[#c39a1c]  text-white font-semibold py-2 px-4 rounded`}
                    placeholder="Ingrese aquí el código"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCode(e.target.value)
                    }
                  ></input>
                  <button
                    className={`bg-[#c39a1c] hover:bg-[#641e1e] text-black font-semibold py-2 px-4 rounded cursor-pointer`}
                    onClick={() => handleAnswer(code)}
                  >
                    Siguiente
                  </button>
                </div>
              </>
            ) : (
              <>
                {questionData.options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`bg-[#c39a1c] hover:bg-[#641e1e] text-black font-semibold py-2 px-4 rounded cursor-pointer`}
                    onClick={() => handleAnswer(option)}
                    disabled={showModalCorrect || showFinalModal}
                  >
                    {option}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
        {feedback && (
          <p className="mt-4 font-semibold text-red-400">{feedback}</p>
        )}
      </main>

      {/* Modal para respuesta correcta (no último día) */}
      {showModalCorrect && (
        <>
          <div
            className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 z-40 px-4"
            role="dialog"
            aria-modal="true"
          >
            <Confetti />
            <div className="bg-gray-900 rounded-lg p-8 max-w-sm w-full text-center">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                {Object.keys(answers).length === Math.min(currentDay!, 50)
                  ? "¡Has respondido todas las preguntas disponibles! Vuelve mañana para continuar."
                  : "Respuesta correcta 🎉"}
              </h2>
              {Object.keys(answers).length === Math.min(currentDay!, 50) ? (
                <p className="mt-4 text-yellow-300">
                  ¡Has completado el reto de hoy! Vuelve mañana para continuar.
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

      {/* Modal para último día */}
      {showFinalModal && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-95 z-40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <audio ref={audioRef} src={HEDWIG_THEME_URL} loop />
          <Confetti />
          <div className="bg-gray-900 rounded-lg p-8  w-full text-center">
            {showProposal && (
              <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex justify-center text-center w-full">
                ¿Quieres ser mi novia? 💛
              </h2>
            )}
            <div className="flex justify-center gap-2">
              <button
                onClick={closeFinalModal}
                className="mt-4 bg-[#c39a1c] hover:bg-[#641e1e] text-black font-semibold py-2 px-6 rounded cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={playAudioManually}
                className="mt-4 bg-[#c39a1c] hover:bg-[#641e1e] text-black font-semibold py-2 px-6 rounded cursor-pointer"
              >
                Reproducir música
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
