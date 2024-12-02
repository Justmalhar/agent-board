import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskInput } from "@/components/TaskInput";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-8">
        <TaskInput />
        <KanbanBoard />
      </main>
    </div>
  );
}
