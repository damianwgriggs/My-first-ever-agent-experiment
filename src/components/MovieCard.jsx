import React from 'react';

const MovieCard = ({ movie, onSelect }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <div className="movie-card" onClick={() => onSelect(movie)}>
            <img src={imageUrl} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <span className="movie-rating">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
        </div>
    );
};

export default MovieCard;
