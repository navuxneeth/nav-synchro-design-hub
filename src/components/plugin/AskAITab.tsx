import { useState } from "react";
import { ChevronDown, Plus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AskAITab = () => {
  const [selectedFrame, setSelectedFrame] = useState("products");
  const [analysisType, setAnalysisType] = useState("layout");

  const analysisResults = {
    layout: [
      { issue: "Inconsistent grid spacing", severity: "Medium", suggestion: "Standardize gaps to 20px" },
      { issue: "Misaligned product cards", severity: "High", suggestion: "Use CSS Grid with auto-fit" },
      { issue: "Uneven whitespace", severity: "Low", suggestion: "Add consistent padding" }
    ],
    typography: [
      { issue: "Font size hierarchy unclear", severity: "High", suggestion: "Increase heading sizes" },
      { issue: "Line height too tight", severity: "Medium", suggestion: "Set to 1.5 for body text" }
    ]
  };

  const currentResults = analysisType === "layout" ? analysisResults.layout : analysisResults.typography;

  return (
    <div className="flex flex-col h-full">
      {selectedFrame ? (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Frame Preview */}
            <div className="border border-figma-border rounded-sm p-3 bg-muted">
              <div className="aspect-video bg-background rounded-sm mb-2 flex items-center justify-center">
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="text-xs font-medium">Products Page</div>
            </div>

            {/* Analysis Type Selector */}
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

            {/* Analysis Results */}
            <div className="space-y-3">
              <div className="text-xs font-medium">Analysis Results</div>
              {currentResults.map((result, idx) => (
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
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Add as Task
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">
              Select a frame from the canvas to analyze
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
