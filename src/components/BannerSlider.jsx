import React, { useEffect, useState } from "react";
import { fetchCollection } from "../services/tmdb";
import { POPULAR_COLLECTIONS } from "../constants";

export default function BannerSlider({ onSelect }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  useEffect(() => {
    async function load() {
      const details = await Promise.all(
        POPULAR_COLLECTIONS.map((c) => fetchCollection(c.id))
      );
      setItems(details);
    }
    load();
  }, []);

  // AUTO-SLIDE (NO MOVIE LIST CHANGE)
  useEffect(() => {
    if (!items.length) return;

    const timer = setInterval(() => {
      setDirection("next");
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [items]);

  if (!items.length) return null;

  const active = items[index];

  const handleDotClick = (i) => {
    setDirection(i > index ? "next" : "prev");
    setIndex(i);
    onSelect && onSelect(items[i].id); // THIS triggers movie list update
  };

  return (
    <div className="banner glass">
      <div className={`banner-slide ${direction}`} key={active.id}>
        <img
          src={`https://image.tmdb.org/t/p/original${active.backdrop_path}`}
          className="banner-bg"
        />
        <div className="banner-overlay"></div>

        <div className="banner-content">
          <h1>{active.name}</h1>
        </div>
      </div>

      <div className="banner-dots">
        {items.map((c, i) => (
          <span
            key={c.id}
            className={i === index ? "dot active" : "dot"}
            onClick={() => handleDotClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
