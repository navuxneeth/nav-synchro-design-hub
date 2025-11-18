import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Target, Zap, Award } from "lucide-react";

interface PersonDetailProps {
  person: {
    name: string;
    initial: string;
    color: string;
    framesCount: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const PersonDetail = ({ person, isOpen, onClose }: PersonDetailProps) => {
  const stats = [
    { label: "Frames Touched", value: person.framesCount, icon: Target },
    { label: "Avg Response Time", value: "2.3h", icon: Clock },
    { label: "Quality Score", value: "94%", icon: Award },
    { label: "Productivity", value: "+12%", icon: TrendingUp }
  ];

  const keyStrengths = [
    { area: "Typography", score: 95, trend: "up" },
    { area: "Color Theory", score: 88, trend: "up" },
    { area: "Layout", score: 92, trend: "stable" },
    { area: "Spacing", score: 85, trend: "up" }
  ];

  const improvementAreas = [
    { area: "Grid Alignment", score: 72, priority: "high" },
    { area: "Contrast Ratios", score: 78, priority: "medium" },
    { area: "Component Consistency", score: 81, priority: "low" }
  ];

  const recentWork = [
    { frame: "Products Page", changes: 8, quality: "excellent", time: "2h ago" },
    { frame: "Home Hero", changes: 5, quality: "good", time: "5h ago" },
    { frame: "Checkout Flow", changes: 12, quality: "excellent", time: "Yesterday" },
    { frame: "Navigation Menu", changes: 3, quality: "good", time: "2 days ago" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className={`w-12 h-12 ${person.color} text-white flex items-center justify-center font-medium`}>
              {person.initial}
            </Avatar>
            <div>
              <DialogTitle className="text-lg">{person.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">Detailed Performance Report</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="p-3 border border-border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Key Strengths */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                Key Strengths
              </h3>
              <div className="space-y-2">
                {keyStrengths.map((strength) => (
                  <div key={strength.area} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{strength.area}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {strength.score}/100
                        </Badge>
                        {strength.trend === "up" && (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                Growth Opportunities
              </h3>
              <div className="space-y-2">
                {improvementAreas.map((area) => (
                  <div key={area.area} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{area.area}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            area.priority === "high"
                              ? "destructive"
                              : area.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {area.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {area.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${area.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Work */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {recentWork.map((work, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="text-sm font-medium">{work.frame}</div>
                        <div className="text-xs text-muted-foreground">
                          {work.changes} changes • {work.time}
                        </div>
                      </div>
                      <Badge
                        variant={work.quality === "excellent" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {work.quality}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                AI Insights
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {person.name} shows excellent consistency in typography and layout work with a 
                strong upward trend. Consider assigning more complex grid-based layouts to help 
                develop alignment skills. Recent work demonstrates high attention to detail with 
                quality scores above team average. Recommend exploring advanced color theory 
                workshops to further enhance already strong capabilities.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
