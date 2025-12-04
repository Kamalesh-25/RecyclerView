// src/components/CollectionsDropdown.jsx
import React, { useEffect, useState } from 'react'
import { fetchCollection } from '../services/tmdb'
import './collections.css' // optional styling

// Curated popular collection ids (edit as you like)
const POPULAR_COLLECTION_IDS = [
  10,      // Star Wars
  86311,   // The Avengers
  263,     // The Dark Knight
  1241,    // Harry Potter
  119,     // The Lord of the Rings
  84,      // Indiana Jones
  87359,   // Mission: Impossible
]

export default function CollectionsDropdown({ onSelectCollection }) {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState('') // store id as string

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    // fetch details for each collection id in parallel
    Promise.all(
      POPULAR_COLLECTION_IDS.map((id) =>
        fetchCollection(id).then(data => ({ id, name: data.name, poster_path: data.poster_path })).catch(err => ({ id, error: true }))
      )
    ).then(results => {
      if (cancelled) return
      const ok = results.filter(r => !r.error)
      setCollections(ok)
      setLoading(false)
      // auto-select first collection (optional)
      if (ok.length && !selected) {
        setSelected(String(ok[0].id))
        onSelectCollection && onSelectCollection(ok[0].id)
      }
    }).catch(err => {
      if (cancelled) return
      setError(err.message || 'Failed to load collections')
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const handleSelect = (e) => {
    const id = e.target.value
    setSelected(id)
    onSelectCollection && onSelectCollection(Number(id))
  }

  if (loading) return <div className="padded">Loading collections...</div>
  if (error) return <div className="padded error">Error loading collections: {error}</div>

  return (
    <div className="collections-panel">
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
        <label style={{minWidth:120}}>Popular collections:</label>
        <select value={selected} onChange={handleSelect} style={{padding:'6px 8px'}}>
          {collections.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* grid of cards — clicking a card selects that collection */}
      <div className="collections-grid">
        {collections.map(c => (
          <button
            key={c.id}
            onClick={() => { setSelected(String(c.id)); onSelectCollection && onSelectCollection(c.id) }}
            className={`collection-card ${String(c.id) === selected ? 'selected' : ''}`}
            title={c.name}
          >
            {c.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${c.poster_path}`} alt={c.name} />
            ) : (
              <div className="placeholder">No image</div>
            )}
            <div className="collection-name">{c.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
