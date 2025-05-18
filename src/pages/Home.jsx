import { useEffect, useState, useCallback, useRef } from 'react';
import { searchPlants, getTreflePlants } from '../services/trefle';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

export default function Home() {
    const [plants, setPlants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const timeoutRef = useRef(null);

    const fetchPlants = useCallback(async (query = '') => {
        try {
            setLoading(true);
            setError('');
            const results = query.length > 2
                ? await searchPlants(query)
                : await getTreflePlants();
            setPlants(results);
            setHasFetched(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const debounceSearch = () => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => fetchPlants(searchTerm), 300);
        };

        searchTerm ? debounceSearch() : fetchPlants();

        return () => clearTimeout(timeoutRef.current);
    }, [searchTerm, fetchPlants]);

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <div className="container mx-auto p-4 lg:p-6">
                <div className="max-w-2xl mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="🔍 Buscar plantas..."
                        className="input input-bordered w-full input-lg focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loading />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plants.map(plant => (
                            <Link
                                to={`/product/${plant.id}`}
                                key={plant.id}
                                className="hover:scale-105 transition-transform duration-300"
                            >
                                <ProductCard plant={plant} />
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && hasFetched && plants.length === 0 && (
                    <div className="text-center text-gray-500 mt-12">
                        No se encontraron plantas
                    </div>
                )}
            </div>
        </div>
    );
}