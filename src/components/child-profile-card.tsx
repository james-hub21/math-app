import { type Child, type BehaviorLog } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface ChildProfileCardProps {
  child: Child;
  recentLogs?: BehaviorLog[];
}

export function ChildProfileCard({ child, recentLogs = [] }: ChildProfileCardProps) {
  const initials = child.name.split(" ").map((n: string) => n[0]).join("");
  
  // Calculate today's summary
  const today = new Date().toDateString();
  const todayLogs = recentLogs.filter(log => 
    log.timestamp && new Date(log.timestamp).toDateString() === today
  );
  
  const positiveCount = todayLogs.filter(log => log.type === "positive").length;
  const challengeCount = todayLogs.filter(log => log.type === "challenge").length;
  
  const lastEntry = recentLogs.length > 0 ? recentLogs[0] : null;
  const lastEntryTime = lastEntry ? formatTimeAgo(new Date(lastEntry.timestamp!)) : "No entries";

  return (
    <Card className="bg-white shadow-sm border border-neutral-100">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">{initials}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-neutral-800">{child.name}</h4>
            <p className="text-sm text-neutral-500">
              Age {child.age} {child.diagnosis && `• ${child.diagnosis}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-500">Last entry</p>
            <p className="text-sm font-medium text-neutral-700">{lastEntryTime}</p>
          </div>
        </div>
        
        {/* Today's Summary */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <p className="text-sm text-neutral-600 mb-2">Today's Summary</p>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-xs text-neutral-600">{positiveCount} positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-xs text-neutral-600">{challengeCount} challenge</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
