import ReactMarkdown from "react-markdown";
import { Avatar } from "@/components/ui/avatar";
import { Bot, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  type: "user" | "ai";
  author_name: string;
  content: string;
  avatar_color?: string;
  reply_to?: {
    author_name: string;
    content: string;
  };
  onReply?: () => void;
}

export const ChatMessage = ({ type, author_name, content, avatar_color, reply_to, onReply }: ChatMessageProps) => {
  return (
    <div className={`flex gap-2 py-2 px-3 rounded-lg group ${type === "ai" ? "bg-primary/5 border border-primary/20" : "bg-muted/30"}`}>
      <Avatar className={`w-6 h-6 ${type === "ai" ? "bg-primary" : avatar_color} text-white text-xs flex items-center justify-center shrink-0`}>
        {type === "ai" ? <Bot className="w-3 h-3" /> : author_name[0].toUpperCase()}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-xs font-medium ${type === "ai" ? "text-primary" : ""}`}>
            {type === "ai" ? "AI Assistant" : author_name}
          </span>
          {type === "ai" && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
              Bot
            </span>
          )}
        </div>
        {reply_to && (
          <div className="mb-2 pl-2 border-l-2 border-muted-foreground/30 text-xs text-muted-foreground">
            <div className="font-medium">{reply_to.author_name}</div>
            <div className="truncate">{reply_to.content}</div>
          </div>
        )}
        {type === "ai" ? (
          <div className="text-xs text-foreground prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-2 rounded overflow-x-auto mb-2">{children}</pre>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-xs text-foreground whitespace-pre-wrap">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {onReply && type === "user" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onReply}
        >
          <Reply className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
