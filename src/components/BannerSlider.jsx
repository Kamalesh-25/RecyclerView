import React, { useEffect, useState } from "react";
import { fetchCollection } from "../services/tmdb";
import { POPULAR_COLLECTIONS } from "../constants";

export default function BannerSlider({ onSelect }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const details = await Promise.all(
        POPULAR_COLLECTIONS.map((c) => fetchCollection(c.id))
      );
      setItems(details);
      onSelect(details[0].id);
    }
    load();
  }, []);

  // AUTO SLIDE (NO MOVIE LIST CHANGE)
useEffect(() => {
  if (!items.length) return;

  const timer = setInterval(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, 4000);

  return () => clearInterval(timer);
}, [items]);


  if (!items.length) return null;

  const active = items[index];

  return (
    <div className="banner glass">
      <img
        src={`https://image.tmdb.org/t/p/original${active.backdrop_path}`}
        className="banner-bg"
      />
      <div className="banner-overlay"></div>

      <div className="banner-content">
        <h1>{active.name}</h1>
      </div>

      <div className="banner-dots">
        {items.map((c, i) => (
          <span
  key={c.id}
  className={i === index ? "dot active" : "dot"}
  onClick={() => {
    setIndex(i);             // change the banner visually
    onSelect && onSelect(items[i].id); // <-- USER-initiated update to movie list
  }}
/>
        ))}
      </div>
    </div>
  );
}
