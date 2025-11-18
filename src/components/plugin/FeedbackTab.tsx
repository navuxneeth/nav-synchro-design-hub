import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiveFeedback } from "./feedback/GiveFeedback";
import { ReceivedFeedback } from "./feedback/ReceivedFeedback";

export const FeedbackTab = () => {
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="give" className="flex flex-col h-full">
        <TabsList className="w-full justify-start rounded-none border-b border-figma-border bg-transparent h-10 p-0">
          <TabsTrigger 
            value="give" 
            className="rounded-none data-[state=active]:bg-muted text-xs h-10 px-6"
          >
            Give Feedback
          </TabsTrigger>
          <TabsTrigger 
            value="received" 
            className="rounded-none data-[state=active]:bg-muted text-xs h-10 px-6"
          >
            Received
          </TabsTrigger>
        </TabsList>

        <TabsContent value="give" className="flex-1 m-0 overflow-auto">
          <GiveFeedback />
        </TabsContent>
        <TabsContent value="received" className="flex-1 m-0 overflow-auto">
          <ReceivedFeedback />
        </TabsContent>
      </Tabs>
    </div>
  );
};
