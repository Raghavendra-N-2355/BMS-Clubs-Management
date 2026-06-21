import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          usn: string | null;
          phone: string | null;
          department_id: string | null;
          semester: number | null;
          role: 'student' | 'admin' | 'superadmin';
          avatar_url: string | null;
          bio: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          usn?: string | null;
          phone?: string | null;
          department_id?: string | null;
          semester?: number | null;
          role?: 'student' | 'admin' | 'superadmin';
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          usn?: string | null;
          phone?: string | null;
          department_id?: string | null;
          semester?: number | null;
          role?: 'student' | 'admin' | 'superadmin';
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      clubs: {
        Row: {
          id: string;
          name: string;
          department_id: string;
          description: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          faculty_coordinator_name: string | null;
          faculty_coordinator_email: string | null;
          student_coordinator_name: string | null;
          student_coordinator_email: string | null;
          member_count: number;
          is_active: boolean;
          admin_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          department_id: string;
          description?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          faculty_coordinator_name?: string | null;
          faculty_coordinator_email?: string | null;
          student_coordinator_name?: string | null;
          student_coordinator_email?: string | null;
          member_count?: number;
          is_active?: boolean;
          admin_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department_id?: string;
          description?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          faculty_coordinator_name?: string | null;
          faculty_coordinator_email?: string | null;
          student_coordinator_name?: string | null;
          student_coordinator_email?: string | null;
          member_count?: number;
          is_active?: boolean;
          admin_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          club_id: string;
          department_id: string | null;
          poster_url: string | null;
          category: 'workshop' | 'hackathon' | 'seminar' | 'competition' | 'cultural' | 'sports' | 'technical' | 'other';
          event_type: 'online' | 'offline' | 'hybrid';
          venue: string | null;
          online_link: string | null;
          event_date: string;
          start_time: string | null;
          end_time: string | null;
          registration_fee: number;
          max_participants: number | null;
          current_participants: number;
          is_registration_open: boolean;
          registration_deadline: string | null;
          prerequisites: string | null;
          tags: string[] | null;
          is_approved: boolean;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          club_id: string;
          department_id?: string | null;
          poster_url?: string | null;
          category: 'workshop' | 'hackathon' | 'seminar' | 'competition' | 'cultural' | 'sports' | 'technical' | 'other';
          event_type?: 'online' | 'offline' | 'hybrid';
          venue?: string | null;
          online_link?: string | null;
          event_date: string;
          start_time?: string | null;
          end_time?: string | null;
          registration_fee?: number;
          max_participants?: number | null;
          current_participants?: number;
          is_registration_open?: boolean;
          registration_deadline?: string | null;
          prerequisites?: string | null;
          tags?: string[] | null;
          is_approved?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          club_id?: string;
          department_id?: string | null;
          poster_url?: string | null;
          category?: 'workshop' | 'hackathon' | 'seminar' | 'competition' | 'cultural' | 'sports' | 'technical' | 'other';
          event_type?: 'online' | 'offline' | 'hybrid';
          venue?: string | null;
          online_link?: string | null;
          event_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          registration_fee?: number;
          max_participants?: number | null;
          current_participants?: number;
          is_registration_open?: boolean;
          registration_deadline?: string | null;
          prerequisites?: string | null;
          tags?: string[] | null;
          is_approved?: boolean;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'waitlisted';
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_id: string | null;
          amount_paid: number;
          ticket_number: string | null;
          qr_code: string | null;
          certificate_issued: boolean;
          certificate_url: string | null;
          attended: boolean;
          notes: string | null;
          registered_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'waitlisted';
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_id?: string | null;
          amount_paid?: number;
          ticket_number?: string | null;
          qr_code?: string | null;
          certificate_issued?: boolean;
          certificate_url?: string | null;
          attended?: boolean;
          notes?: string | null;
          registered_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'waitlisted';
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_id?: string | null;
          amount_paid?: number;
          ticket_number?: string | null;
          qr_code?: string | null;
          certificate_issued?: boolean;
          certificate_url?: string | null;
          attended?: boolean;
          notes?: string | null;
          registered_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          registration_id: string;
          user_id: string;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          amount: number;
          currency: string;
          status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
          payment_method: string | null;
          receipt_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          registration_id: string;
          user_id: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          amount: number;
          currency?: string;
          status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
          payment_method?: string | null;
          receipt_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          registration_id?: string;
          user_id?: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
          payment_method?: string | null;
          receipt_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      club_members: {
        Row: {
          id: string;
          club_id: string;
          user_id: string;
          joined_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          club_id: string;
          user_id: string;
          joined_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          club_id?: string;
          user_id?: string;
          joined_at?: string;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Row'];

export type Insertable<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Insert'];

export type Updatable<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Update'];
