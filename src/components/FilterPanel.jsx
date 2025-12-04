import React from 'react'
export default function FilterPanel({ year, onChange }) {
  return (
    <div>
      <label>Year:</label>
      <input placeholder="e.g. 1999" value={year} onChange={e => onChange(e.target.value)} />
    </div>
  )
}
