import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative h-9 w-9 overflow-hidden rounded-full transition-colors ${className}`}>
          {/* Efeito glassmorphism no modo escuro */}
          <div className="absolute inset-0 dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 rounded-full transition-opacity duration-300"></div>
          
          {/* Animação do sol e lua */}
          <Sun className="absolute h-[1.2rem] w-[1.2rem] text-yellow-500 rotate-0 scale-100 transition-all duration-500 
                        dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] text-primary rotate-90 scale-0 transition-all duration-500 
                        dark:rotate-0 dark:scale-100" />
          
          {/* Indicador de tema atual (borda) */}
          <span className={`absolute inset-0 rounded-full border-2 transition-opacity duration-300 ${
            theme === 'dark' ? 'border-primary opacity-100' : 
            theme === 'light' ? 'border-yellow-500 opacity-100' : 
            'border-gray-500 opacity-0'
          }`}></span>
          
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glassmorphism">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={`${theme === 'light' ? 'bg-yellow-500/10 font-medium' : ''} transition-colors`}
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Claro</span>
          {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={`${theme === 'dark' ? 'bg-primary/10 font-medium' : ''} transition-colors`}
        >
          <Moon className="mr-2 h-4 w-4 text-primary" />
          <span>Escuro</span>
          {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={`${theme === 'system' ? 'bg-gray-500/10 font-medium' : ''} transition-colors`}
        >
          <Monitor className="mr-2 h-4 w-4 text-gray-500" />
          <span>Sistema</span>
          {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}