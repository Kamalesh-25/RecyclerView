import React, { useState, useEffect } from "react";
import MoviesPage from "./pages/MoviesPage";
import Header from "./components/Header";
import "./styles.css";

export default function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <Header theme={theme} setTheme={setTheme} />
      <MoviesPage />
    </>
  );
}
