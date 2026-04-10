export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'teacher' | 'student';
          phone: string | null;
          country_code: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role: 'admin' | 'teacher' | 'student';
          phone?: string | null;
          country_code?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'teacher' | 'student';
          phone?: string | null;
          country_code?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: any[];
      };
      agreements: {
        Row: {
          id: string;
          teacher_id: string;
          student_id: string;
          subject: string;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          student_id: string;
          subject: string;
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: {
          teacher_id?: string;
          student_id?: string;
          subject?: string;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          created_by?: string;
          created_at?: string;
        };
        Relationships: any[];
      };
      teacher_slots: {
        Row: {
          id: string;
          teacher_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          subject: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          subject: string;
          created_at?: string;
        };
        Update: {
          teacher_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          subject?: string;
          created_at?: string;
        };
        Relationships: any[];
      };
      sessions: {
        Row: {
          id: string;
          agreement_id: string | null;
          teacher_id: string;
          student_id: string;
          scheduled_at: string;
          status: 'scheduled' | 'active' | 'completed' | 'cancelled';
          room_name: string;
          started_at: string | null;
          ended_at: string | null;
          recording_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agreement_id?: string | null;
          teacher_id: string;
          student_id: string;
          scheduled_at: string;
          status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
          room_name: string;
          started_at?: string | null;
          ended_at?: string | null;
          recording_url?: string | null;
          created_at?: string;
        };
        Update: {
          agreement_id?: string | null;
          teacher_id?: string;
          student_id?: string;
          scheduled_at?: string;
          status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
          room_name?: string;
          started_at?: string | null;
          ended_at?: string | null;
          recording_url?: string | null;
          created_at?: string;
        };
        Relationships: any[];
      };
      session_recordings: {
        Row: {
          id: string;
          session_id: string;
          file_url: string;
          uploaded_at: string;
          duration_seconds: number | null;
          transcript_text: string | null;
          analysis_result: Json | null;
          alert_sent: boolean;
        };
        Insert: {
          id?: string;
          session_id: string;
          file_url: string;
          uploaded_at?: string;
          duration_seconds?: number | null;
          transcript_text?: string | null;
          analysis_result?: Json | null;
          alert_sent?: boolean;
        };
        Update: {
          session_id?: string;
          file_url?: string;
          uploaded_at?: string;
          duration_seconds?: number | null;
          transcript_text?: string | null;
          analysis_result?: Json | null;
          alert_sent?: boolean;
        };
        Relationships: any[];
      };
      assignments: {
        Row: {
          id: string;
          teacher_id: string;
          agreement_id: string;
          title: string;
          description: string | null;
          questions: Json;
          due_date: string | null;
          is_exam: boolean;
          exam_duration_minutes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          agreement_id: string;
          title: string;
          description?: string | null;
          questions: Json;
          due_date?: string | null;
          is_exam?: boolean;
          exam_duration_minutes?: number | null;
          created_at?: string;
        };
        Update: {
          teacher_id?: string;
          agreement_id?: string;
          title?: string;
          description?: string | null;
          questions?: Json;
          due_date?: string | null;
          is_exam?: boolean;
          exam_duration_minutes?: number | null;
          created_at?: string;
        };
        Relationships: any[];
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          answers: Json;
          score: number | null;
          submitted_at: string;
          started_at: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          answers: Json;
          score?: number | null;
          submitted_at?: string;
          started_at?: string | null;
        };
        Update: {
          assignment_id?: string;
          student_id?: string;
          answers?: Json;
          score?: number | null;
          submitted_at?: string;
          started_at?: string | null;
        };
        Relationships: any[];
      };
      ratings: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          teacher_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          teacher_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          session_id?: string;
          student_id?: string;
          teacher_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: any[];
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string | null;
          file_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content?: string | null;
          file_url?: string | null;
          created_at?: string;
        };
        Update: {
          sender_id?: string;
          receiver_id?: string;
          content?: string | null;
          file_url?: string | null;
          created_at?: string;
        };
        Relationships: any[];
      };
      banned_words: {
        Row: {
          id: string;
          word: string;
          severity: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          word: string;
          severity?: string;
          created_at?: string;
        };
        Update: {
          word?: string;
          severity?: string;
          created_at?: string;
        };
        Relationships: any[];
      };
    };
    Relationships: any[];
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
    CompositeTypes: Record<string, any>;
  };
}
