import axios from 'axios'

const BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

if (!API_KEY) {
  console.warn('VITE_TMDB_API_KEY is not set in .env — API calls will fail.')
}

export async function fetchCollection(collectionId) {
  if (!API_KEY) throw new Error('Missing TMDB API key in env')
  const url = `${BASE}/collection/${collectionId}?api_key=${API_KEY}&language=en-US`
  const res = await axios.get(url)
  return res.data
}

export async function searchMovies(query, page = 1) {
  if (!API_KEY) throw new Error('Missing TMDB API key in env')
  const url = `${BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
  const res = await axios.get(url)
  return res.data
}
