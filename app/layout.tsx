import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "@/contexts/TaskContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentBoard - AI-Powered Kanban Task Management",
  description: "AgentBoard is a JIRA/Trello-inspired task management system designed for AI agents. Easily input ideas, assign them to AI agents, and track their execution across Todo, In Progress, and Done states.",
  keywords: [
    "AI task management",
    "Kanban board",
    "AI agents",
    "Task automation",
    "Productivity tools",
    "Project management",
    "Workflow automation"
  ],
  authors: [{ name: "AgentBoard Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agentboard.vercel.app",
    siteName: "AgentBoard",
    title: "AgentBoard - AI-Powered Kanban Task Management",
    description: "Transform your workflow with AI-powered task management. AgentBoard combines the familiarity of Kanban with the power of AI agents.",
    images: [
      {
        url: "/og-image.png", // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "AgentBoard - AI-Powered Task Management"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentBoard - AI-Powered Kanban Task Management",
    description: "Transform your workflow with AI-powered task management. AgentBoard combines the familiarity of Kanban with the power of AI agents.",
    images: ["/og-image.png"],
    creator: "@agentboard"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
