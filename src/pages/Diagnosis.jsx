// src/pages/Diagnosis.jsx
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Navbar from '../components/Navbar'

export default function Diagnosis() {
    const [file, setFile] = useState(null)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        multiple: false,
        onDrop: acceptedFiles => setFile(acceptedFiles[0])
    })

    const simulateAnalysis = async () => {
        setLoading(true)
        // Simulación de API (reemplazar con API real)
        setTimeout(() => {
            setResult({
                disease: "Mildiu",
                description: "Enfermedad fúngica que aparece como manchas amarillas en el haz de las hojas.",
                treatment: "1. Eliminar hojas afectadas\n2. Aplicar fungicida cobre\n3. Mejorar circulación de aire"
            })
            setLoading(false)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />

            <div className="container mx-auto p-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Diagnóstico de Enfermedades</h1>

                <div className="card bg-base-200 shadow-xl p-6">
                    {/* Zona de carga de imágenes */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
              ${isDragActive ? 'border-primary bg-base-300' : 'border-base-content'}`}
                    >
                        <input {...getInputProps()} />

                        {file ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
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
                                <p className="text-base-content">
                                    {isDragActive ?
                                        "Suelta la imagen aquí" :
                                        "Arrastra una imagen o haz clic para seleccionar"}
                                </p>
                                <p className="text-sm text-base-content/70">Formatos: JPEG, PNG</p>
                            </div>
                        )}
                    </div>

                    {/* Botón de análisis */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={simulateAnalysis}
                            disabled={!file || loading}
                            className="btn btn-primary px-8"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Analizando...
                                </>
                            ) : 'Iniciar Diagnóstico'}
                        </button>
                    </div>

                    {/* Resultados */}
                    {result && (
                        <div className="mt-8 bg-base-100 rounded-lg p-6 shadow">
                            <h2 className="text-xl font-bold mb-4 text-error">Resultado del Diagnóstico</h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold">Enfermedad detectada:</span>
                                    <span className="ml-2 text-primary">{result.disease}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Descripción:</span>
                                    <p className="mt-1 text-base-content/80">{result.description}</p>
                                </div>
                                <div>
                                    <span className="font-semibold">Tratamiento recomendado:</span>
                                    <pre className="mt-1 p-3 bg-base-200 rounded whitespace-pre-wrap">
                                        {result.treatment}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}