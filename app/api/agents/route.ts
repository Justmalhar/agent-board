import { readFileSync, readdirSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export interface Agent {
  id: string;
  name: string;
  filename: string;
}

function formatAgentName(filename: string): string {
  const baseName = filename.replace(/\.md$/, "").replace(/_/g, " ");
  return baseName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") + " Agent";
}

export async function GET() {
  const promptsDir = path.join(process.cwd(), "prompts");
  const files = readdirSync(promptsDir)
    .filter(file => file.endsWith(".md"));

  const agents = files.map(filename => ({
    id: filename.replace(/\.md$/, ""),
    name: formatAgentName(filename),
    filename,
  }));

  return NextResponse.json(agents);
} 