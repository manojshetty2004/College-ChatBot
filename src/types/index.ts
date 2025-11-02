// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  student_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';

export interface Profile {
  user_id: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  year?: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

// Chat Types
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: 'user' | 'bot' | 'system';
  timestamp: string;
  attachments?: string[];
}

// Knowledge Base Types
export interface KnowledgeBase {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  created_by: string;
  created_at: string;
}

// Faculty Types
export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  office_hours?: string;
  contact_info?: string;
  avatar_url?: string;
}

// Course Types
export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  prerequisites?: string[];
  description?: string;
  faculty_id?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  created_by: string;
  created_at: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publish_date: string;
  expires_at?: string;
}

// Feedback Types
export interface Feedback {
  id: string;
  message_id: string;
  rating: number;
  comment?: string;
  user_id: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  requiredRole?: UserRole[];
}
