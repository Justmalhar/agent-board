"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task, useTaskContext } from "@/contexts/TaskContext";
import { getAvailableAgents } from "@/lib/agents";
import { useEffect, useState } from "react";
import { PlayIcon, DownloadIcon, EyeIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import "github-markdown-css";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { executeTask } = useTaskContext();
  const [agentName, setAgentName] = useState(task.agent);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  useEffect(() => {
    getAvailableAgents().then(agents => {
      const agent = agents.find(a => a.id === task.agent);
      if (agent) {
        setAgentName(agent.name);
      }
    });
  }, [task.agent]);

  const handleExecute = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      await executeTask(task.id);
      //toast.success('Task completed successfully');
    } catch (error) {
      toast.error('Failed to execute task');
      console.error('Failed to execute task:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDownload = () => {
    if (!task.result) return;
    
    const cleanDescription = task.description
      .slice(0, 30)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${cleanDescription}_${timestamp}.md`;

    const blob = new Blob([task.result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="task-card p-4 space-y-3">
      <div className="flex justify-between items-start gap-3">
        <p className="text-sm flex-1 leading-relaxed truncate" title={task.description}>
          {task.description}
        </p>
        {task.status === "todo" && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleExecute}
            disabled={isExecuting || task.isExecuting}
            className="shrink-0 hover:bg-primary/10 relative z-10"
          >
            {(isExecuting || task.isExecuting) ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <PlayIcon className="h-4 w-4 text-primary" />
            )}
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="badge-status">
            {agentName}
          </Badge>
          {task.isExecuting && (
            <Badge 
              variant="secondary" 
              className="badge-status animate-pulse bg-primary/10 text-primary"
            >
              Processing...
            </Badge>
          )}
        </div>
        {task.result && task.status === "done" && (
          <div className="flex gap-1.5 relative z-10">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDownload}
              className="h-8 w-8 hover:bg-primary/10"
              title="Download result"
            >
              <DownloadIcon className="h-4 w-4 text-primary" />
            </Button>
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-primary/10"
                  title="Preview result"
                >
                  <EyeIcon className="h-4 w-4 text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
                  <DialogTitle className="text-xl font-semibold">
                    Task Result
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                  <div className="markdown-body p-6">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
                        p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="my-3 list-disc pl-6">{children}</ul>,
                        ol: ({ children }) => <ol className="my-3 list-decimal pl-6">{children}</ol>,
                        li: ({ children }) => <li className="my-1">{children}</li>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic">
                            {children}
                          </blockquote>
                        ),
                        code: ({ className, children }) => 
                          className ? (
                            <pre className="bg-secondary p-4 rounded-lg my-4 overflow-x-auto">
                              <code className="text-sm">{children}</code>
                            </pre>
                          ) : (
                            <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">{children}</code>
                          ),
                        table: ({ children }) => (
                          <div className="my-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-2 bg-secondary font-semibold text-left">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-2 border-t">{children}</td>
                        ),
                      }}
                    >
                      {task.result}
                    </ReactMarkdown>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </Card>
  );
} 