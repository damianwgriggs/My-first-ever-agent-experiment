import { mockMovies } from './data/mockData';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async (page = 1) => {
    if (!API_KEY) {
        console.warn("No API Key found. Using mock data.");
        return Promise.resolve(mockMovies);
    }

    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("API Call failed. Using mock data.", error);
        return Promise.resolve(mockMovies);
    }
};

export const searchMovies = async (query, page = 1) => {
    if (!API_KEY) {
        console.warn("No API Key found. performing mock search.");
        return Promise.resolve(
            mockMovies.filter(movie =>
                movie.title.toLowerCase().includes(query.toLowerCase())
            )
        );
    }

    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("API Search failed. Using mock data.", error);
        return Promise.resolve([]);
    }
};

export const getMovieDetails = async (id) => {
    if (!API_KEY) {
        return Promise.resolve(mockMovies.find(m => m.id === parseInt(id)));
    }
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Details failed. Using mock data.", error);
        return Promise.resolve(mockMovies.find(m => m.id === parseInt(id)));
    }
}
