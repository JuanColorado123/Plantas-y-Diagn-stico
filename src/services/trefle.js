import axios from 'axios';

const token = import.meta.env.VITE_TREFLE_API_KEY;

const axiosInstance = axios.create({
    baseURL: '/trefle-api',
    params: {
        token: token
    }
});

const validateImage = (url) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    return url && validExtensions.some(ext => url.toLowerCase().includes(ext))
        ? url
        : '/placeholder-plant.jpg';
};

export const getPlantDetails = async (id) => {
    try {
        const { data } = await axiosInstance.get(`/plants/${id}`);
        return {
            ...data.data,
            image: validateImage(data.data.image_url),
            price: Math.floor(Math.random() * 80 + 20)
        };
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error cargando detalles');
    }
};

export const searchPlants = async (query) => {
    try {
        const { data } = await axiosInstance.get('/plants/search', {
            params: {
                q: query,
                'filter[image_url]': true,
                page_size: 50
            }
        });
        return data.data.map(plant => ({
            ...plant,
            image: validateImage(plant.image_url),
            price: Math.floor(Math.random() * 80 + 20)
        }));
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error en la búsqueda');
    }
};

export const getTreflePlants = async () => {
    try {
        const { data } = await axiosInstance.get('/plants', {
            params: {
                'filter[image_url]': true,
                page_size: 50,
                order: 'id'
            }
        });
        return data.data.map(plant => ({
            ...plant,
            image: validateImage(plant.image_url),
            price: Math.floor(Math.random() * 80 + 20)
        }));
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error cargando plantas');
    }
};