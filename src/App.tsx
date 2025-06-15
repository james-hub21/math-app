import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import BehaviorLog from "@/pages/behavior-log";
import Progress from "@/pages/progress";
import Resources from "@/pages/resources";
import Communication from "@/pages/communication";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "behavior-log":
        return <BehaviorLog onNavigate={handleNavigate} />;
      case "progress":
        return <Progress onNavigate={handleNavigate} />;
      case "resources":
        return <Resources onNavigate={handleNavigate} />;
      case "communication":
        return <Communication onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-neutral-50">
          <Navigation currentView={currentView} onViewChange={handleNavigate} />
          <main className="max-w-md mx-auto">
            {renderCurrentView()}
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
