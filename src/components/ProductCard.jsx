import { Link, useNavigate } from 'react-router-dom';

export default function ProductCard({ plant }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${plant.id}`);
    };

    return (
        <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={handleClick}
        >
            <figure>
                <img
                    src={plant.image_url || '/placeholder-plant.jpg'}
                    alt={plant.common_name}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-plant.jpg';
                    }}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {plant.common_name || 'Planta sin nombre común'}
                </h2>
                <p className="italic text-sm text-gray-500">
                    {plant.scientific_name}
                </p>
                <div className="card-actions justify-between items-center mt-4">
                    <span className="text-lg font-bold">
                        ${Math.floor(Math.random() * 100 + 20)}
                    </span>
                    <button
                        className="btn btn-primary"
                        onClick={(e) => {
                            e.stopPropagation(); // evita que se dispare el click del contenedor
                            navigate(`/product/${plant.id}`);
                        }}
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
}
