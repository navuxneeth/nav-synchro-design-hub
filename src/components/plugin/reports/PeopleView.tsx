import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { PersonDetail } from "./PersonDetail";

interface Person {
  id: string;
  name: string;
  initial: string;
  color: string;
  framesCount: number;
  strengths: string[];
  improvements: string[];
  activity: { action: string; time: string }[];
}

const people: Person[] = [
  {
    id: "1",
    name: "Sarah Chen",
    initial: "S",
    color: "bg-green-500",
    framesCount: 12,
    strengths: ["Typography", "Color Theory", "Layout"],
    improvements: ["Consistent spacing", "Grid alignment"],
    activity: [
      { action: "Updated Products Page typography", time: "2h ago" },
      { action: "Fixed Home Page spacing", time: "5h ago" },
      { action: "Reviewed Checkout flow", time: "Yesterday" }
    ]
  },
  {
    id: "2",
    name: "Mike Johnson",
    initial: "M",
    color: "bg-purple-500",
    framesCount: 8,
    strengths: ["Interaction Design", "Accessibility"],
    improvements: ["Color contrast", "Navigation clarity"],
    activity: [
      { action: "Improved form validation states", time: "1h ago" },
      { action: "Added ARIA labels", time: "3h ago" }
    ]
  }
];

export const PeopleView = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-3">
          {people.map((person) => (
            <div
              key={person.id}
              className="p-3 border border-figma-border rounded-sm hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedPerson(person)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className={`w-8 h-8 ${person.color} text-white text-xs flex items-center justify-center`}>
                    {person.initial}
                  </Avatar>
                  <div>
                    <div className="text-xs font-medium">{person.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {person.framesCount} frames touched
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(person.id);
                  }}
                >
                  {expandedId === person.id ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>

            {/* Contribution Heatmap */}
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-sm ${
                    Math.random() > 0.5
                      ? Math.random() > 0.5
                        ? "bg-primary"
                        : "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Strengths */}
            <div className="mb-2">
              <div className="text-xs text-muted-foreground mb-1">Strengths</div>
              <div className="flex flex-wrap gap-1">
                {person.strengths.map((strength) => (
                  <span
                    key={strength}
                    className="text-xs px-2 py-0.5 rounded bg-severity-low text-green-700"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div>
              <div className="text-xs text-muted-foreground mb-1">Recent Improvements</div>
              <div className="flex flex-wrap gap-1">
                {person.improvements.map((improvement) => (
                  <span
                    key={improvement}
                    className="text-xs px-2 py-0.5 rounded bg-message-mine text-primary"
                  >
                    {improvement}
                  </span>
                ))}
              </div>
            </div>

            {/* Expanded Activity */}
            {expandedId === person.id && (
              <div className="mt-3 pt-3 border-t border-figma-border space-y-2">
                <div className="text-xs font-medium">Recent Activity</div>
                {person.activity.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-foreground">{item.action}</span>
                    <span className="text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>

    {selectedPerson && (
      <PersonDetail
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    )}
    </>
  );
};
