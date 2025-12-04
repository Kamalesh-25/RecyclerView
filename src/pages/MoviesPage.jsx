import React, { useState } from 'react'
import MovieList from '../components/MovieList/MovieList'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import CollectionsDropdown from '../components/CollectionsDropdown'  // NEW

export default function MoviesPage() {
  // default collection remains fallback if nothing selected
  const [collectionId, setCollectionId] = useState(() => Number(import.meta.env.VITE_DEFAULT_COLLECTION_ID) || 10)
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('')

  return (
    <div className="container">
      <div className="page-header">
        <h1>Collection Movies</h1>
        <div>
          {/* keep the numeric input optional for direct ID entry */}
          <label style={{marginRight:8}}>Collection ID: </label>
          <input type="number" value={collectionId} onChange={e => setCollectionId(Number(e.target.value))} />
        </div>
      </div>

      <div className="controls" style={{flexDirection:'column', alignItems:'stretch'}}>
        <div style={{display:'flex', gap:12}}>
          <SearchBar value={search} onChange={setSearch} />
          <FilterPanel year={year} onChange={setYear} />
        </div>

        {/* NEW: popular collections dropdown + grid */}
        <CollectionsDropdown onSelectCollection={(id) => setCollectionId(id)} />
      </div>

      <main>
        <MovieList collectionId={collectionId} searchQuery={search} yearFilter={year} />
      </main>
    </div>
  )
}
