import { useState, useEffect, useRef } from "react";
import { Search, Send, MoreHorizontal, Bot, Paperclip, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "ai";
  author_name: string;
  content: string;
  created_at: string;
  mentions?: string[];
  frames?: { name: string }[];
  profiles?: { username: string; avatar_color: string };
}

interface Profile {
  id: string;
  username: string;
  avatar_color: string;
}

export const ChatTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineProfiles, setOnlineProfiles] = useState<Profile[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    loadMessages();
    loadProfiles();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages((data || []) as Message[]);
    setTimeout(scrollToBottom, 100);
  };

  const loadProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);

    if (data) {
      setOnlineProfiles(data);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !user) return;

    const content = inputValue;
    setInputValue("");

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const { error } = await supabase
      .from('messages')
      .insert({
        user_id: user.id,
        author_name: profile?.username || 'You',
        content,
        type: 'user',
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    const hasMention = content.includes('@');
    const mentionsAI = content.toLowerCase().includes('@ai');

    if (!hasMention || mentionsAI) {
      setIsAIResponding(true);
      
      try {
        const { data: aiData, error: aiError } = await supabase.functions.invoke('chat-ai', {
          body: {
            messages: [
              ...messages.slice(-5).map(m => ({
                role: m.type === 'ai' ? 'assistant' : 'user',
                content: m.content
              })),
              { role: 'user', content }
            ]
          }
        });

        if (aiError) throw aiError;

        await supabase
          .from('messages')
          .insert({
            user_id: user.id,
            author_name: 'AI Assistant',
            content: aiData.message,
            type: 'ai',
          });
      } catch (error) {
        console.error('AI error:', error);
        toast({
          title: "AI Error",
          description: "Failed to get AI response",
          variant: "destructive",
        });
      } finally {
        setIsAIResponding(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowMentions(value.includes("@"));
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-figma-border">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium flex-1">Chat</h3>
          <div className="flex -space-x-2">
            {onlineProfiles.map((profile) => (
              <Avatar
                key={profile.id}
                className="w-6 h-6 border-2 border-background text-white text-xs flex items-center justify-center"
                style={{ backgroundColor: profile.avatar_color }}
              >
                {profile.username[0].toUpperCase()}
              </Avatar>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="h-7 text-xs pl-7"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`group relative ${
                message.type === "user" ? "ml-8" : ""
              }`}
            >
              <div
                className={`p-2 rounded text-xs ${
                  message.type === "user"
                    ? "bg-message-mine ml-auto"
                    : "bg-message-ai"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.type === "ai" && <Bot className="w-3 h-3" />}
                  <span className="font-medium">{message.author_name}</span>
                  <span className="text-muted-foreground">{formatTime(message.created_at)}</span>
                </div>
                <p className="text-foreground">
                  {message.content.split(/(@\w+)/).map((part, i) =>
                    part.startsWith("@") ? (
                      <span key={i} className="text-primary font-medium">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
                {message.frames && message.frames.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {message.frames.map((frame, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs"
                      >
                        <Hash className="w-2.5 h-2.5" />
                        {frame.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-xs">Reply</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">AI Assist</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Give Structured Feedback</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {isAIResponding && (
            <div>
              <div className="p-2 rounded text-xs bg-message-ai">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-3 h-3" />
                  <span className="font-medium">AI Assistant</span>
                </div>
                <p className="text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-figma-border">
        {showMentions && (
          <div className="mb-2 p-2 bg-muted rounded text-xs space-y-1">
            {onlineProfiles.map((profile) => (
              <div
                key={profile.id}
                className="cursor-pointer hover:bg-background p-1 rounded"
                onClick={() => setInputValue(inputValue + profile.username + ' ')}
              >
                @{profile.username}
              </div>
            ))}
            <div
              className="cursor-pointer hover:bg-background p-1 rounded"
              onClick={() => setInputValue(inputValue + 'AI ')}
            >
              @AI
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Paperclip className="w-3.5 h-3.5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="h-7 text-xs flex-1"
          />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Hash className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            className="h-7 w-7"
            onClick={handleSend}
            disabled={isAIResponding}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
