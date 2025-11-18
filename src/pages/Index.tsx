import { FigmaCanvas } from "@/components/FigmaCanvas";
import { PluginUI } from "@/components/PluginUI";

const Index = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-figma-canvas">
      <FigmaCanvas />
      <PluginUI />
    </div>
  );
};

export default Index;
