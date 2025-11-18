import { MessageSquare, Bot, Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  frame: string;
  assignee: string;
  origin: "chat" | "feedback" | "ai";
  status: string;
  dueDate: string;
}

const allTasks: Task[] = [
  {
    id: "1",
    title: "Fix product grid spacing",
    frame: "Products Page",
    assignee: "Sarah",
    origin: "ai",
    status: "To Do",
    dueDate: "Today"
  },
  {
    id: "2",
    title: "Update hero typography",
    frame: "Home Page",
    assignee: "Mike",
    origin: "feedback",
    status: "To Do",
    dueDate: "Tomorrow"
  },
  {
    id: "3",
    title: "Improve form validation",
    frame: "Checkout",
    assignee: "You",
    origin: "chat",
    status: "In Progress",
    dueDate: "Today"
  },
  {
    id: "4",
    title: "Color contrast check",
    frame: "Wishlist",
    assignee: "Sarah",
    origin: "ai",
    status: "Review",
    dueDate: "Yesterday"
  }
];

export const ListView = () => {
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
                        <span className="text-xs text-muted-foreground">{task.frame}</span>
                        <span className="text-xs text-muted-foreground">• {task.assignee}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  <span className="text-xs">{task.status}</span>
                </td>
                <td className="py-2">
                  <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};
