export default function MovieCard({ movie }) {
  return (
    <div className="movie-card glass movie-row">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">{movie.release_date?.slice(0, 4)}</p>
        <p className="movie-overview">{movie.overview}</p>
      </div>
    </div>
  );
}
