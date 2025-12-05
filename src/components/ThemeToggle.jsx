import React from "react";

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <span className="slider"></span>
    </label>
  );
}
