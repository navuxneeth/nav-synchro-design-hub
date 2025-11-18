import { useState, useEffect } from "react";
import { Plus, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Frame {
  id: string;
  name: string;
}

interface AnalysisResult {
  issue: string;
  severity: string;
  suggestion: string;
}

export const AskAITab = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState("");
  const [analysisType, setAnalysisType] = useState("layout");
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFrames();
  }, []);

  const loadFrames = async () => {
    const { data } = await supabase
      .from("frames")
      .select("id, name")
      .order("name");
    if (data) {
      setFrames(data);
      if (data.length > 0) setSelectedFrame(data[0].id);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFrame) return;

    setIsAnalyzing(true);
    
    // Simulate analysis with mock results based on analysis type
    setTimeout(() => {
      const mockResults = getMockResults(analysisType);
      setResults(mockResults);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: `Found ${mockResults.length} potential improvements`,
      });
    }, 1500);
  };

  const getMockResults = (type: string): AnalysisResult[] => {
    const resultsMap: Record<string, AnalysisResult[]> = {
      layout: [
        { issue: "Inconsistent padding on card components", severity: "Medium", suggestion: "Apply 16px padding consistently across all card components to maintain visual rhythm" },
        { issue: "Uneven spacing between sections", severity: "High", suggestion: "Use multiples of 8px for spacing to create a harmonious layout grid" },
        { issue: "Content not aligned to grid", severity: "Low", suggestion: "Align elements to a 12-column grid for better structure" }
      ],
      typography: [
        { issue: "Multiple font weights used inconsistently", severity: "High", suggestion: "Standardize to 400 (regular) for body and 600 (semibold) for headings" },
        { issue: "Line height too tight for body text", severity: "Medium", suggestion: "Increase line height to 1.5 for improved readability" },
        { issue: "Font sizes don't follow a scale", severity: "Low", suggestion: "Use a type scale like 12, 14, 16, 20, 24, 32, 48px" }
      ],
      color: [
        { issue: "Low contrast text on background", severity: "High", suggestion: "Ensure text has at least 4.5:1 contrast ratio for WCAG AA compliance" },
        { issue: "Too many color variations", severity: "Medium", suggestion: "Limit to primary, secondary, and accent colors with defined shades" },
        { issue: "Inconsistent use of semantic colors", severity: "Low", suggestion: "Use green for success, red for errors, yellow for warnings consistently" }
      ],
      accessibility: [
        { issue: "Missing alt text on images", severity: "High", suggestion: "Add descriptive alt text to all images for screen reader users" },
        { issue: "Interactive elements lack focus states", severity: "High", suggestion: "Add visible focus indicators for keyboard navigation" },
        { issue: "Touch targets too small", severity: "Medium", suggestion: "Ensure buttons and links are at least 44x44px for touch accessibility" }
      ],
      hierarchy: [
        { issue: "Visual hierarchy unclear", severity: "High", suggestion: "Use size, weight, and color to establish clear importance levels" },
        { issue: "Too many competing focal points", severity: "Medium", suggestion: "Emphasize one primary action per section" },
        { issue: "Headings don't follow logical order", severity: "Low", suggestion: "Use H1, H2, H3 in proper sequence without skipping levels" }
      ],
      consistency: [
        { issue: "Button styles vary across pages", severity: "High", suggestion: "Create a consistent button component library with defined variants" },
        { issue: "Icon sizes are inconsistent", severity: "Medium", suggestion: "Standardize icon sizes to 16px or 24px throughout the design" },
        { issue: "Different input field styles", severity: "Medium", suggestion: "Use a single input field design pattern across all forms" }
      ]
    };

    return resultsMap[type] || resultsMap.layout;
  };

  const handleAddAsTask = async (result: AnalysisResult) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("tasks").insert({
        title: result.issue,
        frame_id: selectedFrame,
        assignee_id: user.id,
        origin: "ai",
        status: "todo",
      });

      if (error) throw error;

      toast({
        title: "Task created!",
        description: "Added to your task list",
      });
    } catch (error: any) {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium">Select Frame</label>
            <Select value={selectedFrame} onValueChange={setSelectedFrame}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frames.map((frame) => (
                  <SelectItem key={frame.id} value={frame.id}>
                    {frame.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Analysis Type</label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="layout">Layout</SelectItem>
                <SelectItem value="typography">Typography</SelectItem>
                <SelectItem value="color">Color</SelectItem>
                <SelectItem value="accessibility">Accessibility</SelectItem>
                <SelectItem value="hierarchy">Hierarchy</SelectItem>
                <SelectItem value="consistency">Component Consistency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full h-8 text-xs"
            disabled={isAnalyzing || !selectedFrame}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Frame"
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-medium">Analysis Results</div>
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="p-3 border border-figma-border rounded-sm space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium">{result.issue}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        result.severity === "High"
                          ? "bg-severity-high text-red-700"
                          : result.severity === "Medium"
                          ? "bg-severity-medium text-yellow-700"
                          : "bg-severity-low text-green-700"
                      }`}
                    >
                      {result.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{result.suggestion}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-xs"
                    onClick={() => handleAddAsTask(result)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add as Task
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};