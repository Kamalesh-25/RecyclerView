import axios from "axios";

const BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchCollection(id) {
  const url = `${BASE}/collection/${id}?api_key=${API_KEY}`;
  const res = await axios.get(url);
  return res.data;
}
