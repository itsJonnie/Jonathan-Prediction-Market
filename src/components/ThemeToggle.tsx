"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Initialize from localStorage and apply class
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial: Theme = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("theme-light", initial === "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "light") {
      document.documentElement.classList.add("theme-light");
    } else {
      document.documentElement.classList.remove("theme-light");
    }
    localStorage.setItem("theme", next);
  };

  return (
    <Button variant="outline" size="sm" onClick={toggle} title="Toggle theme">
      {theme === "light" ? (
        <>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </>
      ) : (
        <>
          <Sun className="mr-2 h-4 w-4" /> Light
        </>
      )}
    </Button>
  );
}

