"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTaskContext } from "@/contexts/TaskContext";
import { Agent, getAvailableAgents } from "@/lib/agents";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";

const formSchema = z.object({
  description: z.string().min(1, "Task description is required"),
  agent: z.string().min(1, "Please select an agent"),
  model: z.string().min(1, "Please select a model"),
  length: z.string().min(1, "Please select a length"),
});

const lengths = [
  { id: "small", name: "Small (500 tokens)", maxTokens: 500 },
  { id: "medium", name: "Medium (2000 tokens)", maxTokens: 2000 },
  { id: "large", name: "Large (4000 tokens)", maxTokens: 4000 },
];

interface Model {
  id: string;
  name: string;
  created: number;
}

export function TaskInput() {
  const { addTask } = useTaskContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      agent: "default.md",
      model: process.env.NEXT_PUBLIC_DEFAULT_MODEL || "liquid/lfm-40b:free",
      length: "small",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch agents
        const fetchedAgents = await getAvailableAgents();
        setAgents(fetchedAgents || []);

        // Fetch models
        const response = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`
          }
        });
        const data = await response.json();
        
        if (data?.data) {
          const uniqueModels = data.data.reduce((acc: Model[], model: Model) => {
            const existingModelIndex = acc.findIndex(m => m.id === model.id);
            if (existingModelIndex === -1) {
              acc.push(model);
            } else if (model.created > acc[existingModelIndex].created) {
              acc[existingModelIndex] = model;
            }
            return acc;
          }, []);
          setModels(uniqueModels);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedLength = lengths.find((l) => l.id === values.length);
    addTask(
      values.description,
      values.agent,
      {
        model: values.model,
        maxTokens: selectedLength?.maxTokens || 500,
      }
    );
    form.reset();
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Task Description</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Enter your task description..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {field.value.length} characters
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Select Agent</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Loading..." : "Select agent"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Select Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoading ? "Loading..." : "Select model"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={`${model.id}-${model.created}`} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Select Length</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lengths.map((length) => (
                        <SelectItem key={length.id} value={length.id}>
                          {length.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </Form>
    </Card>
  );
} 