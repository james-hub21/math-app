import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChildProfileCard } from "@/components/child-profile-card";
import {
  Plus,
  TrendingUp,
  Book,
  MessageCircle,
  Smile,
  AlertTriangle
} from "lucide-react";
import { type DashboardStats } from "@/lib/types";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: behaviorLogs = [] } = useQuery({
    queryKey: ["/api/behavior-logs"],
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-neutral-200 rounded-2xl"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-500 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, James</h2>
        <p className="text-white/90 text-base">Let's make math fun and accessible for James today</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("behavior-log")}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all h-auto flex-col space-y-2"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Plus className="text-rose-500" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">Log Math Activity</p>
              <p className="text-xs text-gray-500">Record learning progress</p>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onNavigate("progress")}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all h-auto flex-col space-y-2"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-blue-500" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">Math Progress</p>
              <p className="text-xs text-gray-500">Track learning goals</p>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onNavigate("resources")}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all h-auto flex-col space-y-2"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Book className="text-green-500" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">Math Resources</p>
              <p className="text-xs text-gray-500">Learning tools</p>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onNavigate("communication")}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all h-auto flex-col space-y-2"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-purple-500" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">Messages</p>
              <p className="text-xs text-gray-500">Connect with team</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Child Profiles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Your Children</h3>
          <Button variant="ghost" className="text-blue-500 text-sm font-medium hover:text-blue-700">
            + Add Child
          </Button>
        </div>

        {stats?.children?.map((child) => (
          <ChildProfileCard 
            key={child.id} 
            child={child} 
            recentLogs={(behaviorLogs as any[]).filter((log: any) => log.childId === child.id)} 
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>

        {stats?.recentActivity?.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No math activities logged yet. Start tracking Emma's math learning journey!</p>
              <Button 
                onClick={() => onNavigate("behavior-log")}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Log First Math Activity
              </Button>
            </CardContent>
          </Card>
        ) : (
          stats?.recentActivity?.map((activity, index) => (
            <Card key={index} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                    activity.type === 'positive' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {activity.type === 'positive' ? (
                      <Smile className="text-green-500" size={16} />
                    ) : (
                      <AlertTriangle className="text-yellow-500" size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <span className={`text-xs font-medium ${
                        activity.type === 'positive' ? 'text-green-500' : 'text-yellow-500'
                      }`}>
                        {activity.category}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
