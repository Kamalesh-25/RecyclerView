// src/components/MovieList/MovieList.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { fetchCollection } from '../../services/tmdb'
import MovieRow from './MovieRow'

const LIST_HEIGHT = 600
const ROW_HEIGHT = 150 // not strictly required, Virtuoso can auto-measure

export default function MovieList({ collectionId, searchQuery, yearFilter }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchCollection(collectionId)
      .then(data => { if (!cancelled) setMovies(data.parts || []) })
      .catch(err => { if (!cancelled) setError(err.message || 'Failed to load') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [collectionId])

  const filtered = useMemo(() => {
    let list = movies || []
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(m => (m.title || '').toLowerCase().includes(q))
    }
    if (yearFilter) {
      list = list.filter(m => (m.release_date || '').startsWith(String(yearFilter)))
    }
    return list
  }, [movies, searchQuery, yearFilter])

  if (loading) return <div className="padded">Loading collection...</div>
  if (error) return <div className="padded error">Error: {error}</div>
  if (!filtered.length) return <div className="padded">No movies found.</div>

  // Virtuoso will virtualize the list — only visible items are rendered.
  // itemContent receives (index, item) and returns the item node.
  return (
    <div className="list-wrapper" style={{ height: LIST_HEIGHT }}>
      <Virtuoso
        style={{ height: LIST_HEIGHT }}
        totalCount={filtered.length}
        data={filtered}
        itemContent={(index, movie) => (
          // wrap each movie row in the same container as before
          <div className="row" style={{ height: ROW_HEIGHT }}>
            <MovieRow movie={movie} />
          </div>
        )}
      />
    </div>
  )
}
