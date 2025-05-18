import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlantDetails } from '../services/trefle';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetails() {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const loadPlant = async () => {
            try {
                const data = await getPlantDetails(id);
                // Estructura esperada: data es del tipo Data
                setPlant({
                    ...data,
                    // para nombres comunes alternativos uso main_species.common_names si existe
                    commonNames: (data.main_species && data.main_species.common_names)
                        ? Object.values(data.main_species.common_names).flat()
                        : [],
                });
            } catch (err) {
                setError(err.message || 'Error al cargar planta');
            }
        };

        loadPlant();
    }, [id]);

    if (error) return <ErrorMessage message={error} />;
    if (!plant) return <Loading />;

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <div className="container mx-auto p-4 lg:p-6">
                <div className="card lg:card-side bg-base-100 shadow-xl">
                    <figure className="lg:w-1/2">
                        <img
                            src={plant.image_url}
                            alt={plant.common_name || 'Imagen de planta'}
                            className="w-full h-96 object-cover"
                            onError={(e) => {
                                e.target.src = '/placeholder-plant.jpg';
                            }}
                        />
                    </figure>

                    <div className="card-body lg:w-1/2 space-y-4">
                        <h1 className="text-4xl font-bold">{plant.common_name || 'Sin nombre común'}</h1>
                        {/* Precio inventado, ya que no viene del objeto */}
                        <p className="text-2xl text-primary">${Math.floor(Math.random() * 100 + 20)}</p>
                        <p className="italic text-gray-600">{plant.scientific_name}</p>

                        <div className="divider"></div>

                        <div className="prose">
                            <p><strong>Familia:</strong> {plant.family?.name || 'Desconocida'}</p>
                            <p><strong>Género:</strong> {plant.genus?.name || 'Desconocido'}</p>
                            <p>{plant.observations || 'Sin descripción disponible.'}</p>
                        </div>

                        {Array.isArray(plant.commonNames) && plant.commonNames.length > 0 && (
                            <>
                                <div className="divider"></div>
                                <div className="flex flex-wrap gap-2">
                                    {plant.commonNames.map((name, index) => (
                                        <span key={index} className="badge badge-outline">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => addToCart(plant)}
                            className="btn btn-primary mt-6"
                        >
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
