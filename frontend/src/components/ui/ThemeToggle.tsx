"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { IconButton } from "@/components/ui/IconButton";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton variant="ghost" size="md" label="Toggle theme">
        <div className="w-[1.2rem] h-[1.2rem]" />
      </IconButton>
    );
  }

  return (
    <IconButton
      variant="ghost"
      size="md"
      label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        {theme === 'dark' ? (
          <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
        )}
      </div>
    </IconButton>
  );
}
