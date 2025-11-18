import { useState } from "react";
import { Plus, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoardView } from "./tasks/BoardView";
import { ListView } from "./tasks/ListView";

export const TasksTab = () => {
  const [view, setView] = useState<"board" | "list">("board");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-figma-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={view === "board" ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("board")}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("list")}
          >
            <ListIcon className="w-3.5 h-3.5" />
          </Button>
        </div>
        <Button size="sm" className="h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" />
          New Task
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "board" ? <BoardView /> : <ListView />}
      </div>
    </div>
  );
};
