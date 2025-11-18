import { useEffect, useState } from "react";
import { MessageSquare, Bot, Hash, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  frame_name: string;
  assignee_username: string;
  origin: "chat" | "feedback" | "ai";
  due_date: string | null;
  status: string;
}

const columns = [
  { id: "todo", label: "To Do", color: "bg-task-todo" },
  { id: "progress", label: "In Progress", color: "bg-task-progress" },
  { id: "review", label: "Review", color: "bg-task-review" },
  { id: "done", label: "Done", color: "bg-task-done" },
];

export const BoardView = () => {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    todo: [],
    progress: [],
    review: [],
    done: [],
  });

  useEffect(() => {
    loadTasks();
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        () => loadTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        origin,
        status,
        due_date,
        frame:frame_id(name),
        assignee:assignee_id(username)
      `)
      .order("created_at", { ascending: false });

    if (data) {
      const tasksByStatus: Record<string, Task[]> = {
        todo: [],
        progress: [],
        review: [],
        done: [],
      };

      data.forEach((task: any) => {
        const taskObj: Task = {
          id: task.id,
          title: task.title,
          frame_name: task.frame?.name || "Unknown",
          assignee_username: task.assignee?.username || "Unknown",
          origin: task.origin,
          due_date: task.due_date,
          status: task.status,
        };

        if (tasksByStatus[task.status]) {
          tasksByStatus[task.status].push(taskObj);
        }
      });

      setTasks(tasksByStatus);
    }
  };

  const getOriginIcon = (origin: Task["origin"]) => {
    switch (origin) {
      case "chat":
        return <MessageSquare className="w-2.5 h-2.5" />;
      case "feedback":
        return <Hash className="w-2.5 h-2.5" />;
      case "ai":
        return <Bot className="w-2.5 h-2.5" />;
    }
  };

  const formatDueDate = (date: string | null) => {
    if (!date) return "No due date";
    const dueDate = new Date(date);
    const today = new Date();
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${column.color}`} />
              <h3 className="text-xs font-medium">{column.label}</h3>
              <span className="text-xs text-muted-foreground">
                {tasks[column.id].length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks[column.id].map((task) => (
                <div
                  key={task.id}
                  className="p-2 border border-figma-border rounded-sm bg-background cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium flex-1">{task.title}</span>
                    {getOriginIcon(task.origin)}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <Hash className="w-2.5 h-2.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{task.frame_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {task.assignee_username[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-muted-foreground">{task.assignee_username}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDueDate(task.due_date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};