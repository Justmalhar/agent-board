import Link from "next/link";
import { Github, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-3 header-link hover:opacity-80 transition-opacity"
          >
            <Bot className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-primary tracking-tight">AgentsBoard</span>
              <span className="text-sm text-muted-foreground hidden sm:inline leading-tight">
                Your AI-Powered Kanban Board
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/Justmalhar/AgentsBoard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}