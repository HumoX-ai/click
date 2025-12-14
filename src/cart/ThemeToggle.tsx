import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Mavzuni o'zgartirish"
      title="Mavzuni o'zgartirish"
    >
      {isDark ? <Sun /> : <Moon />}
      {isDark ? "Yorug'" : "Qorong'i"}
    </Button>
  );
}
