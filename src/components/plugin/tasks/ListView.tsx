import { useEffect, useState } from "react";
import { MessageSquare, Bot, Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  frame_name: string;
  assignee_username: string;
  origin: "chat" | "feedback" | "ai";
  status: string;
  due_date: string | null;
}

export const ListView = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
    const channel = supabase
      .channel("tasks-list-changes")
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
      const tasks = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        frame_name: task.frame?.name || "Unknown",
        assignee_username: task.assignee?.username || "Unknown",
        origin: task.origin,
        status: task.status,
        due_date: task.due_date,
      }));
      setAllTasks(tasks);
    }
  };

  const getOriginIcon = (origin: Task["origin"]) => {
    switch (origin) {
      case "chat":
        return <MessageSquare className="w-3 h-3" />;
      case "feedback":
        return <Hash className="w-3 h-3" />;
      case "ai":
        return <Bot className="w-3 h-3" />;
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
      <div className="p-3">
        <table className="w-full">
          <thead>
            <tr className="border-b border-figma-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-2">Task</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-2">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-2">Due</th>
            </tr>
          </thead>
          <tbody>
            {allTasks.map((task) => (
              <tr key={task.id} className="border-b border-figma-border hover:bg-muted/50">
                <td className="py-2">
                  <div className="flex items-start gap-2">
                    {getOriginIcon(task.origin)}
                    <div className="flex-1">
                      <div className="text-xs font-medium mb-0.5">{task.title}</div>
                      <div className="flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.frame_name}</span>
                        <span className="text-xs text-muted-foreground">• {task.assignee_username}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  <span className="text-xs capitalize">{task.status.replace('_', ' ')}</span>
                </td>
                <td className="py-2">
                  <span className="text-xs text-muted-foreground">{formatDueDate(task.due_date)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};