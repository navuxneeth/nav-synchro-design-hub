import { useState } from "react";
import { Hash, Image, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const GiveFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [showClarifier, setShowClarifier] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [issue, setIssue] = useState("");

  const handleFeedbackChange = (value: string) => {
    setFeedback(value);
    // Show clarifier for vague feedback
    if (value.length > 10 && value.length < 50) {
      setShowClarifier(true);
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
  };

  const handleGenerate = () => {
    setShowFinal(true);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Mention Field */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">To</Label>
        <div className="flex items-center gap-2 p-2 border border-figma-border rounded bg-background">
          <AtSign className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
            @Sarah
          </span>
        </div>
      </div>

      {/* Frame Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Frame</Label>
        <div className="flex items-center gap-2 p-2 border border-figma-border rounded bg-background cursor-pointer hover:border-primary">
          <Hash className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs">Products Page</span>
        </div>
      </div>

      {/* Feedback Input */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Feedback</Label>
        <Textarea
          placeholder="Share your thoughts..."
          value={feedback}
          onChange={(e) => handleFeedbackChange(e.target.value)}
          className="text-xs min-h-[100px] resize-none"
        />
      </div>

      {/* AI Clarifier */}
      {showClarifier && !showFinal && (
        <div className="p-3 bg-message-ai rounded-sm border border-figma-border space-y-3">
          <div className="text-xs font-medium">Help me understand better</div>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Which area is this about?</div>
            <div className="grid grid-cols-2 gap-2">
              {["Layout", "Images", "Typography", "Content", "Navigation", "Usability"].map((area) => (
                <Button
                  key={area}
                  variant={selectedArea === area ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAreaSelect(area)}
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>

          {selectedArea && (
            <>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">What feels off?</div>
                <Input
                  placeholder="Describe the issue..."
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="h-7 text-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">What would you expect instead?</div>
                <Input
                  placeholder="Your expectations..."
                  className="h-7 text-xs"
                />
              </div>

              <Button 
                onClick={handleGenerate}
                size="sm" 
                className="w-full h-7 text-xs"
              >
                Generate Refined Feedback
              </Button>
            </>
          )}
        </div>
      )}

      {/* Final Feedback Card */}
      {showFinal && (
        <div className="p-3 bg-muted rounded-sm border border-figma-border space-y-3">
          <div className="text-xs font-medium">AI-Refined Feedback</div>
          <p className="text-xs text-foreground">
            The Products Page layout has inconsistent spacing in the product grid. 
            The gaps between items vary between 16px and 24px, creating a disorganized appearance. 
            Standardizing to 20px would improve visual consistency and make the grid feel more structured.
          </p>
          
          <div className="flex items-center gap-2">
            <Switch id="notify" />
            <Label htmlFor="notify" className="text-xs">Notify in Chat</Label>
          </div>

          <Button size="sm" className="w-full h-7 text-xs">
            Send Privately
          </Button>
        </div>
      )}
    </div>
  );
};
