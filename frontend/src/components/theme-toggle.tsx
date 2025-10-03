import { useTheme } from "@/components/theme-provider"
import { Switch } from "./ui/switch"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex items-center gap-x-4">
      <span>Dark Mode</span>
      <Switch checked={theme == 'dark'} onCheckedChange={(val) => val ? setTheme('dark') : setTheme('light')} />
    </div>
  )
}
