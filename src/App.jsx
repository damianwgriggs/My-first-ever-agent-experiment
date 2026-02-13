import React, { useEffect, useState } from 'react';
import { getPopularMovies, searchMovies } from './api';
import MovieCard from './components/MovieCard';
import SearchBar from './components/SearchBar';
import WalletGateway from './components/WalletGateway';
import './index.css';

function App() {
    const [userAccount, setUserAccount] = useState(null);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Check if already connected
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        setUserAccount(accounts[0]);
                    }
                })
                .catch(console.error);

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setUserAccount(accounts[0]);
                } else {
                    setUserAccount(null);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (userAccount) {
            loadPopularMovies();
        }
    }, [userAccount]);

    const loadPopularMovies = async (pageToLoad = 1) => {
        setLoading(true);
        try {
            const results = await getPopularMovies(pageToLoad);
            if (pageToLoad === 1) {
                setMovies(results);
            } else {
                setMovies(prev => [...prev, ...results]);
            }
        } catch (err) {
            setError("Failed to load movies.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setPage(1);
        setLoading(true);
        try {
            if (!query.trim()) {
                await loadPopularMovies(1);
            } else {
                const results = await searchMovies(query, 1);
                setMovies(results);
            }
        } catch (err) {
            setError("Search failed.");
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);

        if (searchQuery.trim()) {
            setLoading(true);
            try {
                const results = await searchMovies(searchQuery, nextPage);
                setMovies(prev => [...prev, ...results]);
            } catch (err) {
                setError("Failed to load more movies.");
            } finally {
                setLoading(false);
            }
        } else {
            await loadPopularMovies(nextPage);
        }
    };

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
    };

    const closeDetails = () => {
        setSelectedMovie(null);
    };

    if (!userAccount) {
        return <WalletGateway onConnect={setUserAccount} />;
    }

    return (
        <div className="app">
            <header>
                <h1>Movie Finder</h1>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    Connected: {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
                </div>
            </header>

            <main className="container">
                <SearchBar onSearch={handleSearch} />

                {loading && page === 1 && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}
                {error && <div style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</div>}

                {!error && (
                    <>
                        <div className="grid">
                            {movies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />
                            ))}
                        </div>

                        {movies.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
                                <button className="btn" onClick={loadMore} disabled={loading}>
                                    {loading ? 'Loading...' : 'Load More Movies'}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {selectedMovie && (
                    <div className="modal-overlay" onClick={closeDetails}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeDetails}>&times;</button>
                            <div className="modal-body">
                                <img
                                    src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : 'https://via.placeholder.com/500x750'}
                                    alt={selectedMovie.title}
                                    className="modal-poster"
                                />
                                <div className="modal-details">
                                    <h2>{selectedMovie.title}</h2>
                                    <p className="modal-meta">
                                        <span>{selectedMovie.release_date?.split('-')[0]}</span>
                                        <span>⭐ {selectedMovie.vote_average?.toFixed(1)}</span>
                                    </p>
                                    <p className="modal-overview">{selectedMovie.overview}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
