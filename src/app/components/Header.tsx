"use client"

import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const LOCAL_STORAGE_SCORE = "totalScore"

const Header = () => {
  const [totalScore, setTotalScore] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const handleGoTo = (route: string) => {
    router.push(route)
  }

  useEffect(() => {
    const savedScore = localStorage.getItem(LOCAL_STORAGE_SCORE)
    if (savedScore) {
      setTotalScore(parseInt(savedScore, 10))
    }
  }, [])

  return (
    <header className="p-4 fixed items-end w-full flex text-yellow-400 font-bold z-50 justify-end gap-3">
      {pathname !== "/" && (
        <button
          onClick={() => handleGoTo("/")}
          className="underline text-white px-3 py-1 rounded font-semibold cursor-pointer"
        >
          Preguntas
        </button>
      )}

      {pathname !== "/vales" && (
        <button
          onClick={() => handleGoTo("/vales")}
          className="underline text-white px-3 py-1 rounded font-semibold cursor-pointer"
        >
          Canjear puntos
        </button>
      )}
    </header>
  )
}

export default Header
