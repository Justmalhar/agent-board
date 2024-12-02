"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface Task {
  id: string;
  description: string;
  agent: string;
  model?: string;
  maxTokens?: number;
  status: "todo" | "in-progress" | "done";
  result?: string;
  isExecuting?: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (description: string, agent: string, options?: { model?: string; maxTokens?: number }) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  executeTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'agentsboard_tasks';

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (description: string, agent: string, options?: { model?: string; maxTokens?: number }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      description,
      agent,
      model: options?.model,
      maxTokens: options?.maxTokens,
      status: "todo",
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const executeTask = async (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId
          ? { ...task, status: "in-progress", isExecuting: true }
          : task
      )
    );

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        toast.error('Task not found');
        throw new Error('Task not found');
      }

      const response = await fetch("/api/execute-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: task.description,
          agent: task.agent,
          model: task.model,
          maxTokens: task.maxTokens,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to execute task');
        throw new Error('Failed to execute task');
      }

      const data = await response.json();
      
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { 
                ...t, 
                status: "done", 
                result: data.result, 
                isExecuting: false 
              }
            : t
        )
      );

      toast.success('Task completed successfully');
    } catch (error) {
      console.error("Failed to execute task:", error);
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, status: "todo", isExecuting: false }
            : t
        )
      );
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, executeTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
} 