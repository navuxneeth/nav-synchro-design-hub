import { 
  MousePointer2, Square, Pen, Type, Circle,
  Share2, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const FigmaCanvas = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="h-12 bg-figma-toolbar border-b border-figma-border flex items-center px-3 gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1 h-1 bg-foreground rounded-sm" />
              <div className="w-1 h-1 bg-foreground rounded-sm" />
              <div className="w-1 h-1 bg-foreground rounded-sm" />
              <div className="w-1 h-1 bg-foreground rounded-sm" />
            </div>
          </Button>
          <span className="text-sm font-medium">Collab Test File</span>
        </div>
        <div className="flex-1" />
        <Button variant="default" size="sm" className="h-7 text-xs">
          <Share2 className="w-3 h-3 mr-1" />
          Share
        </Button>
        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
          <User className="w-4 h-4" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-12 bg-figma-toolbar border-r border-figma-border flex flex-col items-center py-3 gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground">
            <MousePointer2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Square className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Pen className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Type className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Circle className="w-4 h-4" />
          </Button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-background relative p-12 overflow-auto">
          <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Frame Cards */}
            {["Home Page", "Products Page", "Checkout", "Wishlist"].map((frame) => (
              <div
                key={frame}
                className="border-2 border-figma-border rounded bg-background aspect-[4/3] p-6 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="text-xs text-muted-foreground font-medium mb-2">
                  {frame}
                </div>
                <div className="w-full h-full border border-dashed border-muted rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
