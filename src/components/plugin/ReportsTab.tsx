import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeopleView } from "./reports/PeopleView";
import { SectionsView } from "./reports/SectionsView";

export const ReportsTab = () => {
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="people" className="flex flex-col h-full">
        <TabsList className="w-full justify-start rounded-none border-b border-figma-border bg-transparent h-10 p-0">
          <TabsTrigger 
            value="people" 
            className="rounded-none data-[state=active]:bg-muted text-xs h-10 px-6"
          >
            People
          </TabsTrigger>
          <TabsTrigger 
            value="sections" 
            className="rounded-none data-[state=active]:bg-muted text-xs h-10 px-6"
          >
            Sections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="flex-1 m-0 overflow-auto">
          <PeopleView />
        </TabsContent>
        <TabsContent value="sections" className="flex-1 m-0 overflow-auto">
          <SectionsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
