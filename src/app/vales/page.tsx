/* eslint-disable @next/next/no-img-element */
"use client"
import { QRCodeCanvas } from "qrcode.react"
import React, { useEffect, useState } from "react"
import Header from "../components/Header"

type ValeType = {
  id: string
  name: string
  cost: number // costo en puntos
  description: string
  image: string
  color: string
}

const valesDisponibles: ValeType[] = [
  {
    id: "vale1",
    name: "Vale de abrazo",
    cost: 5,
    description: "Un abrazo especial para compartir juntos.",
    image: "/gryffindor.png",
    color: "#B62125",
  },
  {
    id: "vale2",
    name: "Vale de cena romántica",
    cost: 15,
    description: "Una cena para dos con ambiente especial.",
    image: "/slytherin.png",
    color: "#004325",
  },
  {
    id: "vale3",
    name: "Vale de día de película",
    cost: 10,
    description: "Una maratón de películas favoritos.",
    image: "/ravenclaw.png",
    color: "#016DAB",
  },
  {
    id: "vale4",
    name: "Vale de día de película5ad",
    cost: 10,
    description: "Una maratón de películas favoritos.",
    image: "/hufflepuff.png",
    color: "#D09A20",
  },
]

export default function ValesPage() {
  const [totalScore, setTotalScore] = useState(0)
  const [generatedVale, setGeneratedVale] = useState<ValeType | null>(null)
  const [qrCodeValue, setQrCodeValue] = useState<string>("")

  // Leer totalScore del localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem("totalScore")
    if (savedScore) {
      setTotalScore(parseInt(savedScore, 10))
    }
  }, [])

  // Generar código QR y vale único con ID y timestamp
  const generarVale = (vale: ValeType) => {
    if (totalScore < vale.cost) {
      alert("No tienes suficientes puntos para este vale.")
      return
    }
    const codigoUnico = `${vale.id}-${Date.now()}`
    setQrCodeValue(codigoUnico)
    setGeneratedVale(vale)
    setTotalScore((prev) => prev - vale.cost)
    localStorage.setItem("totalScore", (totalScore - vale.cost).toString())
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white p-4">
        <h1 className="text-3xl font-bold mb-6">Vales Disponibles</h1>
        <p className="mb-4 text-yellow-400 font-semibold">
          Tus puntos actuales: {totalScore}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {valesDisponibles.map((vale) => (
            <div
              key={vale.id}
              className="rounded-lg shadow-lg flex items-center gap-4 h-48 p-2"
              style={{ backgroundColor: vale.color }}
            >
              <img
                src={vale.image}
                alt={vale.name}
                className=" object-contain h-full rounded"
              />
              <div className="flex-1 text-black">
                <h2 className="text-xl font-bold mb-2">{vale.name}</h2>
                <p className="mb-2">{vale.description}</p>
                <p className="mb-4 ">Costo: {vale.cost} puntos</p>
                <button
                  onClick={() => generarVale(vale)}
                  disabled={totalScore < vale.cost}
                  className={`w-full py-2 rounded font-bold ${
                    totalScore < vale.cost
                      ? "border border-gray-300 cursor-not-allowed text-white"
                      : "border  text-white cursor-pointer"
                  }`}
                >
                  Generar Vale
                </button>
              </div>
            </div>
          ))}
        </div>

        {generatedVale && (
          <div
            className="mx-auto p-6 rounded-lg max-w-md text-center text-black"
            style={{ backgroundColor: generatedVale.color }}
          >
            <h2 className="text-2xl font-bold mb-4">{generatedVale.name}</h2>
            <p className="mb-4">{generatedVale.description}</p>
            <p className="mb-4 font-semibold">
              Código único: <br />
              <code>{qrCodeValue}</code>
            </p>
            <QRCodeCanvas
              value={qrCodeValue}
              size={180}
              bgColor="#fff"
              fgColor="#000"
            />
          </div>
        )}
      </div>
    </>
  )
}
