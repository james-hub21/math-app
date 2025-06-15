import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Calendar, Share, Info, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CommunicationProps {
  onNavigate: (view: string) => void;
}

export default function Communication({ onNavigate }: CommunicationProps) {
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["/api/team-members"],
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "bg-secondary" : "bg-neutral-300";
  };

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
        <h2 className="text-xl font-medium text-neutral-800">Messages & Communication</h2>
      </div>

      {/* Team Members */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-neutral-800">Your Support Team</h3>

        {(teamMembers as any[]).length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <p className="text-neutral-500">No team members added yet. Connect with your child's support team!</p>
            </CardContent>
          </Card>
        ) : (
          (teamMembers as any[]).map((member: any) => (
            <Card
              key={member.id}
              className="bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.role === 'Speech Therapist' ? 'bg-gradient-to-br from-green-400 to-green-500' :
                    member.role === 'Special Education Teacher' ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                      'bg-gradient-to-br from-purple-400 to-purple-500'
                    }`}>
                    <span className="text-white font-medium">{getInitials(member.name)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-800">{member.name}</h4>
                    <p className="text-sm text-neutral-500">{member.role}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(member.isOnline)}`}></div>
                    <span className="text-xs text-neutral-500">
                      {member.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-sm text-neutral-600">
                    {member.role === 'Math Learning Specialist'
                      ? "Great progress with number recognition! Emma counted to 20 independently today."
                      : "Emma showed excellent problem-solving skills in math class today!"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {member.isOnline ? "2 hours ago" : "Yesterday"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Messages */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-neutral-800">Recent Updates</h3>

        <Card className="bg-blue-50 border-l-4 border-primary">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                <Info className="text-primary" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800 mb-1">No Data Available</p>
                <p className="text-sm text-neutral-700 mb-2">
                  There are currently no records to display. Please check back later or add new entries to populate this section.
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-400">Just now</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        <Card className="bg-blue-50 border-l-4 border-primary">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                <Info className="text-primary" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800 mb-1">No Data Available</p>
                <p className="text-sm text-neutral-700 mb-2">
                  There is currently no information to display.
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-400">—</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions */}
      <Card className="bg-white shadow-sm border border-neutral-100">
        <CardContent className="p-4">
          <h4 className="font-medium text-neutral-800 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors touch-feedback justify-start"
            >
              <Plus className="text-primary" size={20} />
              <span className="text-sm font-medium text-neutral-800">Send New Message</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors touch-feedback justify-start"
            >
              <Calendar className="text-secondary" size={20} />
              <span className="text-sm font-medium text-neutral-800">Schedule Appointment</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors touch-feedback justify-start"
            >
              <Share className="text-accent" size={20} />
              <span className="text-sm font-medium text-neutral-800">Share Progress Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
