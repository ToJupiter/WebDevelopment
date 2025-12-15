export type Role = 'user' | 'admin' | 'creator';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Status = 'draft' | 'published' | 'archived';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type InterviewType = 'simulated' | 'prep_feedback';
export type EventStatus = 'planned' | 'done' | 'missed' | 'cancelled';
export type TemplateStyle = 'modern' | 'classic' | 'minimal';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  current_level: Level;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Roadmap {
  roadmap_id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
  module_count?: number; // From list view
  modules?: Module[];    // From detail view
  created_by?: string;
}

export interface Module {
  module_id: string;
  roadmap_id: string;
  title: string;
  description: string | null;
  content: string | null;
  order_index: number;
  estimated_hours: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  progress_id: string;
  user_id: string;
  module_id: string;
  status: ProgressStatus;
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface LearningEvent {
  event_id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string; // ISO
  end_time: string;   // ISO
  status: EventStatus;
  all_day?: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

// Interview Interfaces
export interface InterviewSession {
  session_id: string;
  user_id: string;
  session_name: string;
  interview_type: InterviewType;
  questions: any; // JSON
  user_answers: any | null; // JSON
  ai_feedback: any | null; // JSON
  score: number | null;
  created_at: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface AuthResponse {
  user_id: string;
  email: string;
  full_name: string;
  current_level: Level;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardOverview {
  enrolled_roadmaps: number;
  completed_modules: number;
  average_completion: string; // "0.00"
}

export enum InterviewStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export interface InterviewFeedback {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}
