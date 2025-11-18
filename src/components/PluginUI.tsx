import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from "./plugin/ChatTab";
import { FeedbackTab } from "./plugin/FeedbackTab";
import { AskAITab } from "./plugin/AskAITab";
import { TasksTab } from "./plugin/TasksTab";
import { ReportsTab } from "./plugin/ReportsTab";

export const PluginUI = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="w-full bg-background flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-11 p-0">
          <TabsTrigger 
            value="chat" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs h-11 px-4"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="feedback" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs h-11 px-4"
          >
            Feedback
          </TabsTrigger>
          <TabsTrigger 
            value="ask-ai" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs h-11 px-4"
          >
            Ask AI
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs h-11 px-4"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs h-11 px-4"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
          <ChatTab />
        </TabsContent>
        <TabsContent value="feedback" className="flex-1 m-0 overflow-hidden">
          <FeedbackTab />
        </TabsContent>
        <TabsContent value="ask-ai" className="flex-1 m-0 overflow-hidden">
          <AskAITab />
        </TabsContent>
        <TabsContent value="tasks" className="flex-1 m-0 overflow-hidden">
          <TasksTab />
        </TabsContent>
        <TabsContent value="reports" className="flex-1 m-0 overflow-hidden">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
