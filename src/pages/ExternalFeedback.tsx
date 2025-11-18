import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ExternalFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [showClarifier, setShowClarifier] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedFrame, setSelectedFrame] = useState("home");

  const handleFeedbackChange = (value: string) => {
    setFeedback(value);
    if (value.length > 10) {
      setShowClarifier(true);
    }
  };

  const handleSubmit = () => {
    setShowFinal(true);
  };

  return (
    <div className="min-h-screen bg-figma-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background border border-figma-border rounded shadow-sm">
        <div className="p-6 border-b border-figma-border">
          <h1 className="text-lg font-semibold mb-1">Share Your Feedback</h1>
          <p className="text-sm text-muted-foreground">
            Help us improve the design
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Project Selector */}
          <div className="space-y-2">
            <Label className="text-sm">Project</Label>
            <Select defaultValue="collab-test">
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collab-test">Collab Test File</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frame Selector */}
          <div className="space-y-2">
            <Label className="text-sm">Which screen?</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Home Page", "Products Page", "Checkout", "Wishlist"].map((frame) => (
                <button
                  key={frame}
                  onClick={() => setSelectedFrame(frame.toLowerCase().replace(" ", "-"))}
                  className={`p-3 border rounded text-sm text-left transition-colors ${
                    selectedFrame === frame.toLowerCase().replace(" ", "-")
                      ? "border-primary bg-primary/5"
                      : "border-figma-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-video bg-muted rounded mb-2" />
                  <div className="text-xs font-medium">{frame}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Input */}
          <div className="space-y-2">
            <Label className="text-sm">Your Thoughts</Label>
            <Textarea
              placeholder="Share your thoughts about this design..."
              value={feedback}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              className="text-sm min-h-[120px] resize-none"
            />
          </div>

          {/* AI Clarifier */}
          {showClarifier && !showFinal && (
            <div className="p-4 bg-message-ai rounded border border-figma-border space-y-3">
              <div className="text-sm font-medium">Help us understand better</div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Which area does this relate to?
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Layout", "Images", "Typography", "Content", "Navigation", "Usability"].map((area) => (
                    <Button
                      key={area}
                      variant={selectedArea === area ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedArea(area)}
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedArea && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      What feels off?
                    </Label>
                    <Input
                      placeholder="Describe what doesn't feel right..."
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      What would you expect instead?
                    </Label>
                    <Input
                      placeholder="Your expectations..."
                      className="text-xs"
                    />
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    size="sm" 
                    className="w-full"
                  >
                    Generate Feedback
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Final Feedback */}
          {showFinal && (
            <div className="p-4 bg-muted rounded border border-figma-border space-y-3">
              <div className="text-sm font-medium">Your Refined Feedback</div>
              <p className="text-sm text-foreground">
                The {selectedFrame.replace("-", " ")} has some {selectedArea.toLowerCase()} concerns. 
                The current implementation could be improved for better user experience and visual consistency.
              </p>
              
              <Button size="sm" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalFeedback;
