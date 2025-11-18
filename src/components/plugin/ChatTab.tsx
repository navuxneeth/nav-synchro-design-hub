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
import { ChatMessage } from "./ChatMessage";

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
        <div className="space-y-1">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              author_name={message.author_name}
              content={message.content}
              avatar_color={message.profiles?.avatar_color}
            />
          ))}
          {isAIResponding && (
            <div className="flex gap-2 py-2 px-3">
              <Avatar className="w-6 h-6 bg-primary text-white text-xs flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3" />
              </Avatar>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground italic">AI is thinking...</p>
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
