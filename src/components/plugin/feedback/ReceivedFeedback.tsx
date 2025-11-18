import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedbackItem {
  id: string;
  from: string;
  frame: string;
  summary: string;
  details: string;
  date: string;
}

const feedbackItems: FeedbackItem[] = [
  {
    id: "1",
    from: "Mike",
    frame: "Home Page",
    summary: "Hero section typography hierarchy needs adjustment",
    details: "The headline and subheadline sizes are too similar, making it hard to distinguish the primary message. Suggest increasing headline from 48px to 64px.",
    date: "Today, 9:30 AM"
  },
  {
    id: "2",
    from: "Sarah",
    frame: "Checkout",
    summary: "Form validation states unclear",
    details: "Error states on the checkout form don't provide enough visual feedback. Consider adding red borders and inline error messages below each field.",
    date: "Yesterday, 4:15 PM"
  }
];

export const ReceivedFeedback = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {feedbackItems.map((item) => (
          <div
            key={item.id}
            className="p-3 border border-figma-border rounded-sm hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{item.from}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                    <Hash className="w-2.5 h-2.5" />
                    {item.frame}
                  </span>
                </div>
                <p className="text-xs text-foreground">{item.summary}</p>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleExpand(item.id)}
              >
                {expandedId === item.id ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>

            {expandedId === item.id && (
              <div className="mt-3 pt-3 border-t border-figma-border space-y-3">
                <p className="text-xs text-muted-foreground">{item.details}</p>
                <Button size="sm" className="w-full h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Add as Task
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
