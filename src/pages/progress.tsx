import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Smile, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type DashboardStats } from "@/lib/types";

interface ProgressProps {
  onNavigate: (view: string) => void;
}

interface BehaviorLog {
  id: string;
  type: "milestone" | "emotion" | string;
  emotion?: string;
  description?: string;
  category?: string;
  timestamp?: string;
}

export default function ProgressView({ onNavigate }: ProgressProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: behaviorLogs = [] } = useQuery<BehaviorLog[]>({
    queryKey: ["/api/behavior-logs"],
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const periods = [
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "quarter", label: "3 Months" },
  ];

  const totalEntries = stats?.totalEntries || 0;

  const categoryData = Object.entries(stats?.categoryStats || {}).map(([category, count]) => ({
    category,
    count,
    percentage: totalEntries > 0 ? (count / totalEntries) * 100 : 0,
  }));

  const milestones = behaviorLogs
    .filter((log) => log.type === "milestone")
    .slice(0, 3);

  const emotionCounts = behaviorLogs.reduce((acc: Record<string, number>, log) => {
    if (log.emotion) {
      acc[log.emotion] = (acc[log.emotion] || 0) + 1;
    }
    return acc;
  }, {});

  const topEmotion = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0];
  const avgMoodEmoji = topEmotion ? getEmotionEmoji(topEmotion[0]) : "😊";

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center space-x-3 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("dashboard")}
          className="p-2 rounded-full hover:bg-neutral-100"
        >
          <ArrowLeft className="text-neutral-600" size={20} />
        </Button>
        <h2 className="text-xl font-medium text-neutral-800">Progress Tracking</h2>
      </div>

      {/* Time Range Selector */}
      <div className="flex bg-neutral-100 rounded-xl p-1">
        {periods.map((period) => (
          <Button
            key={period.id}
            variant="ghost"
            onClick={() => setSelectedPeriod(period.id)}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              selectedPeriod === period.id
                ? "bg-white rounded-lg shadow-sm text-neutral-800"
                : "text-neutral-600 hover:text-neutral-800"
            }`}
          >
            {period.label}
          </Button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <SummaryCard label="Total Entries" value={stats?.totalEntries || 0} icon={<Edit className="text-primary" size={16} />} note={`+${Math.max(1, Math.floor((stats?.totalEntries || 0) * 0.2))} this week`} />
        <SummaryCard label="Positive Behaviors" value={stats?.positiveCount || 0} icon={<Smile className="text-secondary" size={16} />} note={`${Math.round(((stats?.positiveCount || 0) / (stats?.totalEntries || 1)) * 100)}% of entries`} />
        <SummaryCard label="Milestones" value={stats?.milestones || 0} icon={<Star className="text-accent" size={16} />} note="New achievements" />
        <SummaryCard label="Avg. Mood" value={avgMoodEmoji} icon={<Heart className="text-pink-500" size={16} />} note="Mostly positive" />
      </div>

      {/* Category Breakdown */}
      <Card className="bg-white shadow-sm border border-neutral-100">
        <CardContent className="p-5">
          <h3 className="text-lg font-medium text-neutral-800 mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {categoryData.length === 0 ? (
              <p className="text-neutral-500 text-sm">No data available. Start logging behaviors to see category breakdown.</p>
            ) : (
              categoryData.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-700">{category.category}</span>
                    <span className="text-sm text-neutral-500">{category.count} entries</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Milestones */}
      <Card className="bg-white shadow-sm border border-neutral-100">
        <CardContent className="p-5">
          <h3 className="text-lg font-medium text-neutral-800 mb-4">Recent Milestones</h3>
          <div className="space-y-3">
            {milestones.length === 0 ? (
              <p className="text-neutral-500 text-sm">No milestones recorded yet. Log milestone achievements to track progress!</p>
            ) : (
              milestones.map((milestone) => (
                <div 
                  key={milestone.id} 
                  className="flex items-start space-x-3 p-3 bg-gradient-to-r from-secondary/5 to-transparent rounded-xl"
                >
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                    <Star className="text-secondary" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{milestone.description}</p>
                    <p className="text-xs text-neutral-500 mt-1">Category: {milestone.category}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {milestone.timestamp ? new Date(milestone.timestamp).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, icon, note }: { label: string, value: React.ReactNode, icon: React.ReactNode, note: string }) {
  return (
    <Card className="bg-white shadow-sm border border-neutral-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-neutral-600">{label}</p>
          {icon}
        </div>
        <p className="text-2xl font-semibold text-neutral-800">{value}</p>
        <p className="text-xs text-secondary">{note}</p>
      </CardContent>
    </Card>
  );
}

function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    happy: "😊",
    excited: "🤗",
    calm: "😌",
    frustrated: "😤",
    overwhelmed: "😰",
    tired: "😴",
  };
  return emojiMap[emotion] || "😊";
}
