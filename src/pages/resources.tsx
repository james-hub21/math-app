import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, GraduationCap, MessageCircle, Hand, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RESOURCE_CATEGORIES } from "@/lib/types";

interface ResourcesProps {
  onNavigate: (view: string) => void;
}

export default function Resources({ onNavigate }: ResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/resources", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory
        ? `/api/resources?category=${selectedCategory}`
        : "/api/resources";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    },
  });

  const filteredResources = resources.filter((resource: any) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const iconMap = {
    "graduation-cap": GraduationCap,
    "comments": MessageCircle,
    "hand-paper": Hand,
    "users": Users,
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded"></div>
          <div className="h-12 bg-neutral-200 rounded-xl"></div>
          <div className="grid grid-cols-2 gap-4">
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
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("dashboard")}
          className="p-2 rounded-full hover:bg-neutral-100"
        >
          <ArrowLeft className="text-neutral-600" size={20} />
        </Button>
        <h2 className="text-xl font-medium text-neutral-800">Math Learning Resources</h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-white rounded-xl border border-neutral-200 focus:border-primary"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-2 gap-4">
        {RESOURCE_CATEGORIES.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap];
          const isSelected = selectedCategory === category.value;

          return (
            <Button
              key={category.value}
              variant="ghost"
              onClick={() => setSelectedCategory(isSelected ? "" : category.value)}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-shadow h-auto flex-col space-y-2 touch-feedback ${isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-neutral-100 hover:shadow-md"
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.color === 'blue' ? 'bg-blue-100' :
                  category.color === 'green' ? 'bg-green-100' :
                    category.color === 'purple' ? 'bg-purple-100' :
                      'bg-red-100'
                }`}>
                <Icon className={
                  category.color === 'blue' ? 'text-blue-600' :
                    category.color === 'green' ? 'text-green-600' :
                      category.color === 'purple' ? 'text-purple-600' :
                        'text-red-600'
                } size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-800">{category.value}</p>
                <p className="text-xs text-neutral-500">
                  {category.value === 'Number Concepts' ? 'Basic number skills' :
                    category.value === 'Visual Math' ? 'Visual learning tools' :
                      category.value === 'Interactive Games' ? 'Engaging activities' :
                        'Hands-on materials'}
                </p>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Featured Resources */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-neutral-800">
          {selectedCategory ? `${selectedCategory} Resources` : "Featured Resources"}
        </h3>

        {filteredResources.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <p className="text-neutral-500">
                {searchQuery || selectedCategory
                  ? "No resources found matching your criteria."
                  : "No resources available at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredResources.map((resource: any) => (
            <Card key={resource.id} className="bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {resource.imageUrl && (
                    <img
                      src={resource.imageUrl}
                      alt={resource.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-800 mb-1">{resource.title}</h4>
                    <p className="text-sm text-neutral-600 mb-2">{resource.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs font-medium ${resource.category === 'Number Concepts' ? 'text-blue-600' :
                          resource.category === 'Visual Math' ? 'text-green-600' :
                            resource.category === 'Interactive Games' ? 'text-purple-600' :
                              'text-red-600'
                        }`}>
                        {resource.category}
                      </span>
                      {resource.readTime && (
                        <span className="text-xs text-neutral-400">{resource.readTime}</span>
                      )}
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400" size={12} />
                        <span className="text-xs text-neutral-500">{resource.rating || 5}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Community Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5">
        <h3 className="text-lg font-medium text-neutral-800 mb-3">Community Tips</h3>
        <div className="space-y-3">
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-sm text-neutral-700 mb-2">
              No parent feedback has been submitted yet.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">—</span>
              </div>
              <span className="text-xs text-neutral-500">No entries</span>
            </div>
          </div>

          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-sm text-neutral-700 mb-2">
              Awaiting insights from parents.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">—</span>
              </div>
              <span className="text-xs text-neutral-500">No entries</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
