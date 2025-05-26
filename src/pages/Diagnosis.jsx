import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Navbar from '../components/Navbar'
import { Toaster, toast } from 'react-hot-toast'

const API_KEY = '0E3tyRnkobJ1tBsFOpjUuDpWyiyVXexVXhuf6nDgq88cwWJY0v'

const API_URL = 'https://plant.id/api/v3/health_assessment?' + new URLSearchParams({
    details: 'local_name,description,treatment,classification,common_names,cause',
    language: 'es',
    full_disease_list: 'true',
})

export default function Diagnosis() {
    const [file, setFile] = useState(null)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [accessToken, setAccessToken] = useState(null)
    const [pollingInterval, setPollingInterval] = useState(null)

    useEffect(() => {
        return () => pollingInterval && clearInterval(pollingInterval)
    }, [pollingInterval])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        multiple: false,
        onDrop: ([uploadedFile]) => setFile(uploadedFile),
    })

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result.split(',')[1])
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleAnalysis = async () => {
        if (!file) return
        setLoading(true)
        setResult(null)
        setAccessToken(null)

        try {
            const base64Image = await convertToBase64(file)
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Api-Key': API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images: [base64Image],
                    health: 'only',
                    similar_images: true,
                }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Error en el análisis')

            if (data.status === 'CREATED') {
                setAccessToken(data.access_token)
                startPolling(data.access_token)
                toast.success('Análisis en progreso...')
            } else if (data.status === 'COMPLETED') {
                validateAndProcess(data)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.message)
            setLoading(false)
            console.error(error)
        }
    }

    const startPolling = (token) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`https://plant.id/api/v3/health_assessment/${token}`, {
                    headers: { 'Api-Key': API_KEY },
                })
                const data = await response.json()

                if (data.status === 'COMPLETED') {
                    clearInterval(interval)
                    validateAndProcess(data)
                    setLoading(false)
                } else if (data.status === 'FAILED') {
                    clearInterval(interval)
                    throw new Error('El análisis falló')
                }
            } catch (error) {
                clearInterval(interval)
                toast.error(error.message)
                setLoading(false)
            }
        }, 5000)

        setPollingInterval(interval)
    }

    const validateAndProcess = (data) => {
        if (!data.result) throw new Error('Resultados no disponibles')
        if (!data.result.is_plant?.binary) throw new Error('No se detectó una planta en la imagen')

        processResults(data)
        toast.success('Diagnóstico completado')
    }

    const processResults = (data) => {
        const health = data.result.is_healthy
        const disease = data.result.disease.suggestions[0]

        setResult({
            isHealthy: health.binary,
            healthProbability: `${(health.probability * 100).toFixed(1)}%`,
            disease: {
                name: disease.name,
                probability: `${(disease.probability * 100).toFixed(1)}%`,
                description: disease.details?.description || 'Descripción no disponible',
                treatment: {
                    prevention: disease.details?.treatment?.prevention || ['Información no disponible'],
                    biological: disease.details?.treatment?.biological || ['Información no disponible'],
                    chemical: disease.details?.treatment?.chemical || ['Información no disponible'],
                },
            },
            similarImages: disease.similar_images.map((img) => img.url),
        })
    }

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <Toaster position="bottom-right" />

            <div className="container mx-auto p-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Diagnóstico de Enfermedades</h1>

                <div className="card bg-base-200 shadow-xl p-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
              ${isDragActive ? 'border-primary bg-base-300' : 'border-base-content'}`}
                    >
                        <input {...getInputProps()} />
                        {file ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Vista previa"
                                className="mx-auto max-h-48 object-contain mb-4 rounded-lg"
                            />
                        ) : (
                            <div className="space-y-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto text-base-content"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p>{isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}</p>
                                <p className="text-sm text-base-content/70">Formatos: JPEG, PNG</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleAnalysis}
                            disabled={!file || loading}
                            className="btn btn-primary px-8"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span> Analizando...
                                </>
                            ) : 'Iniciar Diagnóstico'}
                        </button>
                    </div>

                    {result && (
                        <div className="mt-8 bg-base-100 rounded-lg p-6 shadow space-y-6">
                            <h2 className="text-xl font-bold text-error">
                                {result.isHealthy
                                    ? `✅ Planta Saludable (${result.healthProbability})`
                                    : '⚠️ Problema Detectado'}
                            </h2>

                            {!result.isHealthy && (
                                <>
                                    <div className="bg-base-200 p-4 rounded-lg">
                                        <h3 className="font-bold text-lg text-primary mb-2">
                                            {result.disease.name} ({result.disease.probability})
                                        </h3>
                                        <p className="text-base-content/80">{result.disease.description}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <TreatmentSection title="🛡️ Prevención" items={result.disease.treatment.prevention} />
                                        <TreatmentSection title="🌱 Tratamiento Biológico" items={result.disease.treatment.biological} />
                                        {result.disease.treatment.chemical[0] !== 'Información no disponible' && (
                                            <TreatmentSection title="⚠️ Tratamiento Químico" items={result.disease.treatment.chemical} />
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-primary">Imágenes de referencia:</h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {result.similarImages.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt="Ejemplo"
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function TreatmentSection({ title, items }) {
    return (
        <div>
            <h4 className="font-semibold text-primary">{title}:</h4>
            <ul className="list-disc pl-6 mt-1">
                {items.map((item, index) => (
                    <li key={index} className="text-base-content/80">{item}</li>
                ))}
            </ul>
        </div>
    )
}
