import { openai } from "./openai";
import path from "path";
import { readFileSync } from "fs";

export interface Agent {
  id: string;
  name: string;
  filename: string;
}

export async function getAvailableAgents(): Promise<Agent[]> {
  const response = await fetch("/api/agents");
  return response.json();
}

export async function executeTask(task: { description: string; agent: string }) {
  const response = await fetch("/api/execute-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();
  return data.result;
} 