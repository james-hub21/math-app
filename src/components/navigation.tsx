import { Heart, Home, Plus, TrendingUp, Book, MessageCircle, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "behavior-log", label: "Math Log", icon: Plus },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "resources", label: "Resources", icon: Book },
    { id: "communication", label: "Messages", icon: MessageCircle },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="text-white" size={16} />
              </div>
              <h1 className="text-lg font-medium text-neutral-900">TeckMen</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2 rounded-full">
                <Bell className="text-neutral-500" size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 rounded-full">
                <UserCircle className="text-neutral-500" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-neutral-100 px-4 py-2 safe-area-pb z-50">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`nav-btn flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
                  isActive ? "active text-primary bg-primary/10" : "text-neutral-500"
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Spacing for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
