import React from 'react'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200'
export default function MovieRow({ movie }) {
  return (
    <div className="movie-card">
      <img src={movie.poster_path ? IMAGE_BASE + movie.poster_path : 'https://via.placeholder.com/92x128?text=No+Image'} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="muted">{movie.release_date}</div>
        <p className="overview">{movie.overview}</p>
      </div>
    </div>
  )
}
