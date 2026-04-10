export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student';
  phone?: string;
  country_code?: string;
  is_active: boolean;
}

export interface Agreement {
  id: string;
  teacher_id: string;
  student_id: string;
  subject: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  teacher?: User;
  student?: User;
}

export interface TeacherSlot {
  id: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
}

export interface Session {
  id: string;
  agreement_id: string;
  teacher_id: string;
  student_id: string;
  scheduled_at: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  room_name: string;
  started_at?: string;
  ended_at?: string;
  recording_url?: string;
  teacher?: User;
  student?: User;
}

export interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Assignment {
  id: string;
  teacher_id: string;
  agreement_id: string;
  title: string;
  description?: string;
  questions: Question[];
  due_date?: string;
  is_exam: boolean;
  exam_duration_minutes?: number;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  answers: Record<number, number>;
  score?: number;
  submitted_at: string;
  started_at?: string;
}

export interface SessionRecording {
  id: string;
  session_id: string;
  file_url: string;
  transcript_text?: string;
  analysis_result?: {
    banned_words_found?: string[];
    timestamp?: number;
  };
  alert_sent: boolean;
}

export interface Rating {
  id: string;
  session_id: string;
  student_id: string;
  teacher_id: string;
  rating: number;
  comment?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content?: string;
  file_url?: string;
  created_at: string;
}
