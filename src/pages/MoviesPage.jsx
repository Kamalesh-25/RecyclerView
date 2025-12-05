import React, { useEffect, useState } from "react";
import BannerSlider from "../components/BannerSlider";
import MovieRecycler from "../components/MovieRecycler";
import SearchBar from "../components/SearchBar";
import { fetchCollection } from "../services/tmdb";
import { POPULAR_COLLECTIONS } from "../constants";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);        
  const [allMovies, setAllMovies] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function loadAllCollections() {


  try {
    const results = await Promise.allSettled(
      POPULAR_COLLECTIONS.map((c) => {
        return fetchCollection(c.id);
      })
    );

    const allParts = [];

    results.forEach((res, i) => {
      if (res.status === "fulfilled") {
        allParts.push(...(res.value.parts || []));
      } else {
        console.log("Reason:", res.reason);
      }
    });

    

    setMovies(allParts);
setAllMovies(allParts);
setLoading(false); 


  } catch (err) {
    console.log("❌ GLOBAL ERROR:", err);
  }
}


    loadAllCollections();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCollectionSelect = async (collectionId) => {
    if (!collectionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCollection(collectionId);
      const parts = Array.isArray(data.parts) ? data.parts : [];
      const sorted = parts.slice().sort((a,b) => (b.release_date || '').localeCompare(a.release_date || ''));
      setMovies(sorted);
    } catch (err) {
      setError(err.message || "Failed to load collection");
    } finally {
      setLoading(false);
    }
  };

  const filtered = movies.filter((m) =>
    !search ? true : (m.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container page">
      <BannerSlider onSelect={handleCollectionSelect} />
      <SearchBar value={search} onChange={setSearch} />

      {loading && <div className="center-screen padded">Loading movies...</div>}
      {error && <div className="padded error">Error: {error}</div>}

      {!loading && !error && (
        <MovieRecycler movies={filtered} />
      )}
    </div>
  );
  
}
