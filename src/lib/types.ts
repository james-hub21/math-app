export interface DashboardStats {
  totalEntries: number;
  positiveCount: number;
  milestones: number;
  categoryStats: Record<string, number>;
  recentActivity: any[];
  children: any[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export const BEHAVIOR_CATEGORIES = [
  "Number Recognition",
  "Counting & Quantity", 
  "Basic Operations",
  "Problem Solving",
  "Pattern Recognition",
  "Geometry & Shapes",
  "Measurement"
] as const;

export const EMOTIONS = [
  { value: "happy", label: "😊 Happy" },
  { value: "excited", label: "🤗 Excited" },
  { value: "calm", label: "😌 Calm" },
  { value: "frustrated", label: "😤 Frustrated" },
  { value: "overwhelmed", label: "😰 Overwhelmed" },
  { value: "tired", label: "😴 Tired" }
] as const;

export const BEHAVIOR_TYPES = [
  { value: "positive", label: "Success", icon: "smile", color: "secondary" },
  { value: "challenge", label: "Difficulty", icon: "exclamation", color: "accent" },
  { value: "milestone", label: "Achievement", icon: "star", color: "primary" },
  { value: "note", label: "Math Note", icon: "sticky-note", color: "purple" }
] as const;

export const LOCATIONS = [
  "Home",
  "School", 
  "Math Tutoring",
  "Library",
  "Other"
] as const;

export const DURATIONS = [
  "< 5 minutes",
  "5-15 minutes", 
  "15-30 minutes",
  "30+ minutes"
] as const;

export const RESOURCE_CATEGORIES = [
  { value: "Number Concepts", icon: "graduation-cap", color: "blue" },
  { value: "Visual Math", icon: "comments", color: "green" },
  { value: "Interactive Games", icon: "hand-paper", color: "purple" },
  { value: "Math Tools", icon: "users", color: "red" }
] as const;
