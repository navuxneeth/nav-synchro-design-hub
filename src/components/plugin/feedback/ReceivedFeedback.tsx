import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FeedbackItem {
  id: string;
  from_username: string;
  frame_name: string;
  summary: string;
  details: string;
  created_at: string;
  frame_id: string;
}

export const ReceivedFeedback = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFeedback();
    const channel = supabase
      .channel("feedback-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "feedback",
        },
        () => loadFeedback()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadFeedback = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("feedback")
      .select(`
        id,
        summary,
        details,
        created_at,
        frame_id,
        from_user:from_user_id(username),
        frame:frame_id(name)
      `)
      .eq("to_user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const items = data.map((item: any) => ({
        id: item.id,
        from_username: item.from_user?.username || "Unknown",
        frame_name: item.frame?.name || "Unknown",
        summary: item.summary,
        details: item.details,
        created_at: new Date(item.created_at).toLocaleString(),
        frame_id: item.frame_id,
      }));
      setFeedbackItems(items);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddAsTask = async (item: FeedbackItem) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      toast({
        title: "Creating task...",
        description: "AI is refining your feedback",
      });

      // Use AI to refine feedback into a clear task
      const { data: clarifiedData, error: aiError } = await supabase.functions.invoke("clarify-feedback", {
        body: { feedback: `${item.summary}: ${item.details}` },
      });

      if (aiError) throw aiError;

      const taskTitle = clarifiedData?.clarifiedFeedback || item.summary;

      const { error } = await supabase.from("tasks").insert({
        title: taskTitle,
        frame_id: item.frame_id,
        assignee_id: user.id,
        origin: "feedback",
        status: "todo",
      });

      if (error) throw error;

      toast({
        title: "Task created!",
        description: "AI-refined feedback added to your task list",
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
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {feedbackItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground">No feedback received yet</p>
          </div>
        ) : (
          feedbackItems.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-figma-border rounded-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{item.from_username}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                      <Hash className="w-2.5 h-2.5" />
                      {item.frame_name}
                    </span>
                  </div>
                  <p className="text-xs text-foreground">{item.summary}</p>
                  <span className="text-xs text-muted-foreground">{item.created_at}</span>
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
                  <Button 
                    size="sm" 
                    className="w-full h-7 text-xs"
                    onClick={() => handleAddAsTask(item)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add as Task
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};