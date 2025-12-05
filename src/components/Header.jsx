import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ theme, setTheme }) {
  return (
    <header className="header">
      <h2 className="logo">🎬 MovieVerse</h2>
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </header>
  );
}
