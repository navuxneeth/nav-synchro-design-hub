import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Frame {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  username: string;
}

export const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedFrame, setSelectedFrame] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [frames, setFrames] = useState<Frame[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadFrames();
      loadProfiles();
    }
  }, [open]);

  const loadFrames = async () => {
    const { data } = await supabase
      .from("frames")
      .select("id, name")
      .order("name");
    if (data) setFrames(data);
  };

  const loadProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username")
      .order("username");
    if (data) setProfiles(data);
  };

  const handleCreate = async () => {
    if (!title || !selectedFrame || !selectedAssignee) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase.from("tasks").insert({
        title,
        frame_id: selectedFrame,
        assignee_id: selectedAssignee,
        origin: "chat",
        status: "todo",
      });

      if (error) throw error;

      toast({
        title: "Task created!",
        description: "Your task has been added",
      });

      setTitle("");
      setSelectedFrame("");
      setSelectedAssignee("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-sm">Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs">Title</Label>
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs h-8"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Frame</Label>
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
            <Label className="text-xs">Assignee</Label>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCreate}
            className="w-full h-8 text-xs"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};