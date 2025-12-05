import { Virtuoso } from "react-virtuoso";
import MovieCard from "./MovieCard";

export default function MovieRecycler({ movies }) {
  return (
    <div style={{ height: "75vh" }}>
      <Virtuoso
        data={movies}
        itemContent={(index, movie) => <MovieCard movie={movie} />}
      />
    </div>
  );
}
