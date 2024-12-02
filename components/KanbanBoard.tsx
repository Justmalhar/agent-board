"use client";

import { TaskCard } from "@/components/TaskCard";
import { Card } from "@/components/ui/card";
import { useTaskContext } from "@/contexts/TaskContext";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
] as const;

export function KanbanBoard() {
  const { tasks } = useTaskContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold">{column.title}</h2>
            <Badge variant="secondary" className="badge-status">
              {tasks.filter((task) => task.status === column.id).length}
            </Badge>
          </div>
          <Card className="p-4 space-y-4 min-h-[200px] bg-secondary/30">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </Card>
        </div>
      ))}
    </div>
  );
} 