import { Moon, Sun } from "lucide-react"; // Optional: Lucide icons

import { useDarkTheme } from "../../hooks/useDarkTheme";

// import { useTheme } from "../../hooks/useTheme";

// import { useDarkTheme } from "../../hooks/useDarkTheme";

export default function DarkThemeToggle() {
  // const { theme, toggleTheme } = useDarkTheme();
  const { theme, toggleTheme } = useDarkTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
}
