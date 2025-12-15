export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'Data Science' | 'Design';
  progress: number;
  totalModules: number;
  completedModules: number;
  image: string;
  estimatedTime: string;
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  status: 'locked' | 'active' | 'completed';
  type: 'video' | 'quiz' | 'project';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'progress' | 'achievement' | 'comment';
}

export interface Stat {
  label: string;
  value: string | number;
  change: number;
  period: string;
  icon: string;
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
