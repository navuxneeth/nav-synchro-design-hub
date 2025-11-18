import { useState } from "react";
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

interface Message {
  id: string;
  type: "user" | "other" | "ai";
  author: string;
  content: string;
  time: string;
  mentions?: string[];
  frames?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "other",
    author: "Sarah",
    content: "The Products Page layout needs some spacing adjustments",
    time: "10:23 AM",
    frames: ["Products Page"]
  },
  {
    id: "2",
    type: "user",
    author: "You",
    content: "I can take a look. @Sarah what specific areas?",
    time: "10:25 AM",
    mentions: ["Sarah"]
  },
  {
    id: "3",
    type: "ai",
    author: "AI Assistant",
    content: "I analyzed the Products Page and found 3 spacing inconsistencies in the product grid. Would you like a detailed breakdown?",
    time: "10:25 AM",
    frames: ["Products Page"]
  }
];

export const ChatTab = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [showMentions, setShowMentions] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      author: "You",
      content: inputValue,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowMentions(value.includes("@"));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-figma-border">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium flex-1">Chat</h3>
          <div className="flex -space-x-2">
            <Avatar className="w-6 h-6 border-2 border-background bg-primary text-white text-xs flex items-center justify-center">
              Y
            </Avatar>
            <Avatar className="w-6 h-6 border-2 border-background bg-green-500 text-white text-xs flex items-center justify-center">
              S
            </Avatar>
            <Avatar className="w-6 h-6 border-2 border-background bg-purple-500 text-white text-xs flex items-center justify-center">
              M
            </Avatar>
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

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`group relative ${
                message.type === "user" ? "ml-8" : message.type === "ai" ? "" : "mr-8"
              }`}
            >
              <div
                className={`p-2 rounded text-xs ${
                  message.type === "user"
                    ? "bg-message-mine ml-auto"
                    : message.type === "ai"
                    ? "bg-message-ai"
                    : "bg-message-other"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.type === "ai" && <Bot className="w-3 h-3" />}
                  <span className="font-medium">{message.author}</span>
                  <span className="text-muted-foreground">{message.time}</span>
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
                {message.frames && (
                  <div className="flex gap-1 mt-2">
                    {message.frames.map((frame) => (
                      <span
                        key={frame}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs"
                      >
                        <Hash className="w-2.5 h-2.5" />
                        {frame}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Hover menu */}
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
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-figma-border">
        {showMentions && (
          <div className="mb-2 p-2 bg-muted rounded text-xs space-y-1">
            <div className="cursor-pointer hover:bg-background p-1 rounded">@Sarah</div>
            <div className="cursor-pointer hover:bg-background p-1 rounded">@Mike</div>
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
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
