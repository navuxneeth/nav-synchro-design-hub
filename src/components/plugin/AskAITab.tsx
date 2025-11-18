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
    try {
      const frame = frames.find((f) => f.id === selectedFrame);
      const { data, error } = await supabase.functions.invoke("analyze-frame", {
        body: {
          frameName: frame?.name || "Unknown",
          analysisType,
        },
      });

      if (error) throw error;

      // Save results to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user && data) {
        await Promise.all(
          data.map((result: AnalysisResult) =>
            supabase.from("analysis_results").insert({
              frame_id: selectedFrame,
              analysis_type: analysisType,
              issue: result.issue,
              severity: result.severity,
              suggestion: result.suggestion,
            })
          )
        );
      }

      setResults(data);
      toast({
        title: "Analysis complete",
        description: `Found ${data.length} potential improvements`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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