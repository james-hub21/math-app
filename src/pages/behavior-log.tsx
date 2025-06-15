import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Smile, AlertTriangle, Star, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BEHAVIOR_CATEGORIES, EMOTIONS, BEHAVIOR_TYPES, LOCATIONS, DURATIONS } from "@/lib/types";

const behaviorLogSchema = z.object({
  childId: z.number(),
  type: z.string(),
  category: z.string().min(1, "Category is required"),
  emotion: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  duration: z.string().optional(),
});

type BehaviorLogForm = z.infer<typeof behaviorLogSchema>;

interface BehaviorLogProps {
  onNavigate: (view: string) => void;
}

export default function BehaviorLog({ onNavigate }: BehaviorLogProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: children = [] } = useQuery({
    queryKey: ["/api/children"],
  });

  const form = useForm<BehaviorLogForm>({
    resolver: zodResolver(behaviorLogSchema),
    defaultValues: {
      childId: (children as any[])[0]?.id || 1,
      type: "",
      category: "",
      emotion: "",
      description: "",
      location: "",
      duration: "",
    },
  });

  const createLogMutation = useMutation({
    mutationFn: (data: BehaviorLogForm) =>
      apiRequest("POST", "/api/behavior-logs", data),
    onSuccess: () => {
      toast({
        title: "Behavior logged successfully!",
        description: "The entry has been saved to your child's profile.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/behavior-logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/dashboard"] });
      onNavigate("dashboard");
    },
    onError: () => {
      toast({
        title: "Error saving behavior log",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BehaviorLogForm) => {
    const finalData = {
      ...data,
      type: selectedType,
      emotion: selectedEmotion || undefined,
    };
    createLogMutation.mutate(finalData);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    form.setValue("type", type);
  };

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    form.setValue("emotion", emotion);
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
        <h2 className="text-xl font-medium text-neutral-800">Log Math Learning Activity</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Child Selection */}
          <FormField
            control={form.control}
            name="childId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-700">Select Child</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-primary">
                      <SelectValue placeholder="Select a child..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(children as any[]).map((child: any) => (
                      <SelectItem key={child.id} value={child.id.toString()}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Behavior Type */}
          <div className="space-y-3">
            <FormLabel className="text-sm font-medium text-neutral-700">What type of math activity?</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {BEHAVIOR_TYPES.map((type) => {
                const icons = {
                  smile: Smile,
                  exclamation: AlertTriangle,
                  star: Star,
                  "sticky-note": StickyNote,
                };
                const Icon = icons[type.icon as keyof typeof icons];
                const isSelected = selectedType === type.value;
                
                return (
                  <Button
                    key={type.value}
                    type="button"
                    variant="ghost"
                    onClick={() => handleTypeSelect(type.value)}
                    className={`bg-white rounded-xl p-4 border transition-colors h-auto flex-col space-y-2 touch-feedback ${
                      isSelected 
                        ? `border-${type.color === 'secondary' ? 'secondary' : type.color === 'accent' ? 'accent' : type.color === 'primary' ? 'primary' : 'purple-500'} bg-${type.color === 'secondary' ? 'secondary' : type.color === 'accent' ? 'accent' : type.color === 'primary' ? 'primary' : 'purple'}/10`
                        : "border-neutral-200 hover:shadow-md"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      type.color === 'secondary' ? 'bg-secondary/10' :
                      type.color === 'accent' ? 'bg-accent/10' :
                      type.color === 'primary' ? 'bg-primary/10' :
                      'bg-purple-100'
                    }`}>
                      <Icon className={
                        type.color === 'secondary' ? 'text-secondary' :
                        type.color === 'accent' ? 'text-accent' :
                        type.color === 'primary' ? 'text-primary' :
                        'text-purple-600'
                      } size={20} />
                    </div>
                    <p className="text-sm font-medium text-neutral-800">{type.label}</p>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Category Selection */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-700">Math Area</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-primary">
                      <SelectValue placeholder="Select a math area..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BEHAVIOR_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Emotion Selection */}
          <div className="space-y-3">
            <FormLabel className="text-sm font-medium text-neutral-700">Child's Emotion</FormLabel>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => (
                <Button
                  key={emotion.value}
                  type="button"
                  variant="ghost"
                  onClick={() => handleEmotionSelect(emotion.value)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors touch-feedback ${
                    selectedEmotion === emotion.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-neutral-200 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {emotion.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-700">Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-primary resize-none"
                    rows={4}
                    placeholder="Describe the math activity, concepts practiced, and any strategies used..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Context Information */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-primary">
                        <SelectValue placeholder="Select location..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-primary">
                        <SelectValue placeholder="How long?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DURATIONS.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <Button
              type="submit"
              disabled={createLogMutation.isPending}
              className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors touch-feedback shadow-sm"
            >
              {createLogMutation.isPending ? "Saving..." : "Save Entry"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onNavigate("dashboard")}
              className="w-full bg-neutral-100 text-neutral-700 py-4 rounded-xl font-medium hover:bg-neutral-200 transition-colors touch-feedback"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
