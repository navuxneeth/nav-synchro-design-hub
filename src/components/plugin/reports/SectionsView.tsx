import { Hash, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface Section {
  name: string;
  contributors: { name: string; initial: string; color: string }[];
  edits: number;
  aiNotes: string[];
}

const sections: Section[] = [
  {
    name: "Home Page",
    contributors: [
      { name: "Sarah", initial: "S", color: "bg-green-500" },
      { name: "Mike", initial: "M", color: "bg-purple-500" }
    ],
    edits: 18,
    aiNotes: ["Typography hierarchy improved", "Spacing inconsistencies detected"]
  },
  {
    name: "Products Page",
    contributors: [
      { name: "Sarah", initial: "S", color: "bg-green-500" }
    ],
    edits: 12,
    aiNotes: ["Grid spacing standardized", "Image optimization needed"]
  },
  {
    name: "Checkout",
    contributors: [
      { name: "Mike", initial: "M", color: "bg-purple-500" },
      { name: "You", initial: "Y", color: "bg-primary" }
    ],
    edits: 24,
    aiNotes: ["Form validation enhanced", "Accessibility improved"]
  },
  {
    name: "Wishlist",
    contributors: [
      { name: "Sarah", initial: "S", color: "bg-green-500" }
    ],
    edits: 6,
    aiNotes: ["Color contrast issues found"]
  }
];

export const SectionsView = () => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {sections.map((section) => (
          <div
            key={section.name}
            className="p-3 border border-figma-border rounded-sm hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs font-medium">{section.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {section.edits} edits
                  </div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {section.contributors.map((contributor) => (
                  <Avatar
                    key={contributor.name}
                    className={`w-6 h-6 border-2 border-background ${contributor.color} text-white text-xs flex items-center justify-center`}
                  >
                    {contributor.initial}
                  </Avatar>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {section.aiNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-message-ai rounded-sm"
                >
                  <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-foreground">{note}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
