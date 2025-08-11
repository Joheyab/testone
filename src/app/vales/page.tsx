/* eslint-disable @next/next/no-img-element */
"use client"
import { QRCodeCanvas } from "qrcode.react"
import { useEffect, useState } from "react"
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
    name: "Vale de masaje",
    cost: 5,
    description: "Un masaje especial donde tu quieras.",
    image: "/gryffindor.png",
    color: "#B62125",
  },
  {
    id: "vale2",
    name: "Vale de cena romántica",
    cost: 25,
    description: "Una cena en el lugar que escojas.",
    image: "/slytherin.png",
    color: "#004325",
  },
  {
    id: "vale3",
    name: "Vale de día/noche de película",
    cost: 15,
    description: "Una maratón de películas favoritos.",
    image: "/ravenclaw.png",
    color: "#016DAB",
  },
  {
    id: "vale4",
    name: "Vale de día/noche de juegos",
    cost: 5,
    description: "Un día o noche de tus juegos favoritos.",
    image: "/hufflepuff.png",
    color: "#D09A20",
  },
  {
    id: "vale5",
    name: "Vale de viaje",
    cost: 50,
    description: "Un viaje de 1 dia completo a su lugar de preferencia",
    image: "/gryffindor.png",
    color: "#B62125",
  },
  {
    id: "vale6",
    name: "Vale de ir al parque de diversiones",
    cost: 20,
    description: "Un día en el parque de diversiones.",
    image: "/slytherin.png",
    color: "#004325",
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

  // Cerrar modal con ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setGeneratedVale(null)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  useEffect(() => {
    if (generatedVale) {
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
  }, [generatedVale])

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
              className="rounded-lg shadow-lg flex items-center gap-4 max-h-54 p-2"
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

        {/* MODAL Harry Potter */}
        {generatedVale && (
          <>
            {/* Fondo oscuro */}
            <div
              onClick={() => setGeneratedVale(null)}
              className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-6 ">
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-[#1a1a1a]  rounded-3xl shadow-2xl max-w-lg w-full px-8 py-30 border-4 border-yellow-600 font-serif"
                style={{
                  backgroundImage: "url('/pergamino.jpg')", // pergamino textura
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Botón cerrar */}
                <button
                  onClick={() => setGeneratedVale(null)}
                  className="absolute top-4 right-6 text-black hover:text-yellow-400 transition text-5xl font-bold cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  ×
                </button>

                {/* Título */}
                <h2 className="text-xl font-bold mb-4 mt-8 drop-shadow-md tracking-wide text-shadow-black text-black flex flex-col items-center">
                  🎟️ Vale Mágico
                  <span>{generatedVale.name}</span>
                </h2>

                {/* Descripción */}
                <p className="mb-6 text-lg text-black drop-shadow-md text-center">
                  {generatedVale.description}
                </p>

                {/* Código único */}
                <div className="mb-6 bg-opacity-70 p-4 rounded-lg text-center font-monospace tracking-widest text-xl select-all text-black">
                  <strong>Código único:</strong>
                  <br />
                  <code className="break-words">{qrCodeValue}</code>
                </div>

                {/* QR */}
                <div className="flex justify-center">
                  <QRCodeCanvas
                    value={qrCodeValue}
                    size={180}
                    bgColor="#fff"
                    fgColor="#000"
                    className="rounded-lg border-4  shadow-lg"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
