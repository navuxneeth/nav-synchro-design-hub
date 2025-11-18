import { MessageSquare, Bot, Hash, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  frame: string;
  assignee: string;
  origin: "chat" | "feedback" | "ai";
  dueDate: string;
}

const tasks: Record<string, Task[]> = {
  todo: [
    {
      id: "1",
      title: "Fix product grid spacing",
      frame: "Products Page",
      assignee: "Sarah",
      origin: "ai",
      dueDate: "Today"
    },
    {
      id: "2",
      title: "Update hero typography",
      frame: "Home Page",
      assignee: "Mike",
      origin: "feedback",
      dueDate: "Tomorrow"
    }
  ],
  progress: [
    {
      id: "3",
      title: "Improve form validation",
      frame: "Checkout",
      assignee: "You",
      origin: "chat",
      dueDate: "Today"
    }
  ],
  review: [
    {
      id: "4",
      title: "Color contrast check",
      frame: "Wishlist",
      assignee: "Sarah",
      origin: "ai",
      dueDate: "Yesterday"
    }
  ],
  done: []
};

const columns = [
  { id: "todo", label: "To Do", color: "bg-task-todo" },
  { id: "progress", label: "In Progress", color: "bg-task-progress" },
  { id: "review", label: "Review", color: "bg-task-review" },
  { id: "done", label: "Done", color: "bg-task-done" }
];

export const BoardView = () => {
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
                    <span className="text-xs text-muted-foreground">{task.frame}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {task.assignee[0]}
                      </div>
                      <span className="text-xs text-muted-foreground">{task.assignee}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{task.dueDate}</span>
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
