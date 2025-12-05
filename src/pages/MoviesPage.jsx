// import React, { useEffect, useState } from "react";
// import BannerSlider from "../components/BannerSlider";
// import MovieRecycler from "../components/MovieRecycler";
// import SearchBar from "../components/SearchBar";
// import { fetchCollection } from "../services/tmdb";
// import { POPULAR_COLLECTIONS } from "../constants";

// export default function MoviesPage() {
//   const [movies, setMovies] = useState([]);
//   const [search, setSearch] = useState("");

//   // Load ALL MOVIES FIRST (RecyclerView initial list)
//   useEffect(() => {
//     async function loadAll() {
//       const all = await Promise.all(
//         POPULAR_COLLECTIONS.map(c => fetchCollection(c.id))
//       );

//       const merged = all.flatMap(c => c.parts);
//       setMovies(merged);
//     }
//     loadAll();
//   }, []);

//   // When user manually selects a collection
//   async function handleCollectionSelect(id) {
//     const data = await fetchCollection(id);
//     setMovies(data.parts || []);
//   }

//   const filtered = movies.filter(m =>
//     m.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="container">
//       <BannerSlider onSelect={handleCollectionSelect} />
//       <SearchBar value={search} onChange={setSearch} />
//       <MovieRecycler movies={filtered} />
//     </div>
//   );
// }
// src/pages/MoviesPage.jsx
import React, { useEffect, useState } from "react";
import BannerSlider from "../components/BannerSlider";
import MovieRecycler from "../components/MovieRecycler";
import SearchBar from "../components/SearchBar";
import { fetchCollection } from "../services/tmdb";
import { POPULAR_COLLECTIONS } from "../constants";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);        // current shown list
  const [allMovies, setAllMovies] = useState([]);  // merged all collections (cached)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function loadAllCollections() {
      try {
        // Fetch all collections in parallel and tolerate failures
        const results = await Promise.allSettled(
          POPULAR_COLLECTIONS.map((c) => fetchCollection(c.id))
        );

        // Extract parts arrays safely
        const parts = [];
        for (const r of results) {
          if (r.status === "fulfilled" && r.value && Array.isArray(r.value.parts)) {
            parts.push(...r.value.parts);
          }
        }

        // Deduplicate by id (keep first)
        const map = new Map();
        for (const m of parts) {
          if (!m || typeof m.id === "undefined") continue;
          if (!map.has(m.id)) map.set(m.id, m);
        }
        let merged = Array.from(map.values());

        // Optional: sort newest first (by release_date)
        merged.sort((a, b) => {
          const da = a.release_date || "";
          const db = b.release_date || "";
          return db.localeCompare(da);
        });

        if (!cancelled) {
          setAllMovies(merged);
          setMovies(merged); // initial view = all movies
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load collections");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAllCollections();

    return () => {
      cancelled = true;
    };
  }, []);

  // Called ONLY when user clicks banner dot (user-initiated)
  const handleCollectionSelect = async (collectionId) => {
    if (!collectionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCollection(collectionId);
      const parts = Array.isArray(data.parts) ? data.parts : [];
      // dedupe against nothing — just use parts of selected collection
      const sorted = parts.slice().sort((a,b) => (b.release_date || '').localeCompare(a.release_date || ''));
      setMovies(sorted);
    } catch (err) {
      setError(err.message || "Failed to load collection");
    } finally {
      setLoading(false);
    }
  };

  // Search filter applied to currently displayed 'movies'
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
