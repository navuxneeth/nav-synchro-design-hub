import { useState, useEffect } from "react";
import { Hash, AtSign, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Profile {
  id: string;
  username: string;
}

interface Frame {
  id: string;
  name: string;
}

export const GiveFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [showClarifier, setShowClarifier] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [issue, setIssue] = useState("");
  const [expectation, setExpectation] = useState("");
  const [refinedFeedback, setRefinedFeedback] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFrame, setSelectedFrame] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
    loadFrames();
  }, []);

  const loadProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username")
      .order("username");
    if (data) setProfiles(data);
  };

  const loadFrames = async () => {
    const { data } = await supabase
      .from("frames")
      .select("id, name")
      .order("name");
    if (data) setFrames(data);
  };

  const handleFeedbackChange = (value: string) => {
    setFeedback(value);
    if (value.length > 10 && value.length < 100) {
      setShowClarifier(true);
    } else {
      setShowClarifier(false);
      setShowFinal(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedArea || !issue || !expectation) {
      toast({
        title: "Missing information",
        description: "Please fill in all clarifier fields",
        variant: "destructive",
      });
      return;
    }

    setIsRefining(true);
    try {
      const { data, error } = await supabase.functions.invoke("clarify-feedback", {
        body: {
          feedback,
          area: selectedArea,
          issue,
          expectation,
          frame: selectedFrame ? frames.find(f => f.id === selectedFrame)?.name : "General",
        },
      });

      if (error) throw error;
      setRefinedFeedback(data.refinedFeedback);
      setShowFinal(true);
    } catch (error: any) {
      toast({
        title: "Failed to refine feedback",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleSend = async () => {
    if (!selectedUser || !selectedFrame) {
      toast({
        title: "Missing information",
        description: "Please select a recipient and frame",
        variant: "destructive",
      });
      return;
    }

    const finalFeedback = showFinal ? refinedFeedback : feedback;
    if (!finalFeedback.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please provide some feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("feedback").insert({
        from_user_id: user.id,
        to_user_id: selectedUser,
        frame_id: selectedFrame,
        summary: feedback.substring(0, 100),
        details: finalFeedback,
        area: selectedArea || null,
      });

      if (error) throw error;

      toast({
        title: "Feedback sent!",
        description: "Your feedback has been delivered",
      });

      // Reset form
      setFeedback("");
      setShowClarifier(false);
      setShowFinal(false);
      setSelectedArea("");
      setIssue("");
      setExpectation("");
      setRefinedFeedback("");
    } catch (error: any) {
      toast({
        title: "Failed to send feedback",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium">To</Label>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select recipient" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                @{profile.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Frame</Label>
        <Select value={selectedFrame} onValueChange={setSelectedFrame}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select frame" />
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
        <Label className="text-xs font-medium">Feedback</Label>
        <Textarea
          placeholder="Share your thoughts..."
          value={feedback}
          onChange={(e) => handleFeedbackChange(e.target.value)}
          className="text-xs min-h-[100px] resize-none"
        />
      </div>

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
                  value={expectation}
                  onChange={(e) => setExpectation(e.target.value)}
                  className="h-7 text-xs"
                />
              </div>

              <Button 
                onClick={handleGenerate}
                size="sm"
                className="w-full h-7 text-xs"
                disabled={isRefining || !issue || !expectation}
              >
                {isRefining ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Refining...
                  </>
                ) : (
                  "Generate Clear Feedback"
                )}
              </Button>
            </>
          )}
        </div>
      )}

      {showFinal && (
        <div className="p-3 bg-message-ai rounded-sm border border-figma-border space-y-2">
          <div className="text-xs font-medium">AI-Refined Feedback</div>
          <p className="text-xs text-foreground">{refinedFeedback}</p>
        </div>
      )}

      <Button 
        onClick={handleSend}
        className="w-full h-8 text-xs"
        disabled={isSending || !selectedUser || !selectedFrame}
      >
        {isSending ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Feedback"
        )}
      </Button>
    </div>
  );
};