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
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          plan: "free" | "starter" | "pro";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "starter" | "pro";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "starter" | "pro";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          current_period_end?: string | null;
          updated_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          tool_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_name?: string;
        };
      };
      saved_audits: {
        Row: {
          id: string;
          user_id: string;
          app_id: string;
          store: "apple" | "google";
          app_name: string;
          audit_data: Json;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          app_id: string;
          store: "apple" | "google";
          app_name: string;
          audit_data: Json;
          score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          app_id?: string;
          store?: "apple" | "google";
          app_name?: string;
          audit_data?: Json;
          score?: number;
        };
      };
      tracked_apps: {
        Row: {
          id: string;
          user_id: string;
          app_id: string;
          store: "apple" | "google";
          app_name: string;
          role: "own" | "competitor";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          app_id: string;
          store: "apple" | "google";
          app_name: string;
          role: "own" | "competitor";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          app_id?: string;
          store?: "apple" | "google";
          app_name?: string;
          role?: "own" | "competitor";
        };
      };
      app_snapshots: {
        Row: {
          id: string;
          tracked_app_id: string;
          date: string;
          rating: number | null;
          review_count: number | null;
          rank_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracked_app_id: string;
          date: string;
          rating?: number | null;
          review_count?: number | null;
          rank_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracked_app_id?: string;
          date?: string;
          rating?: number | null;
          review_count?: number | null;
          rank_data?: Json | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          confirmed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          confirmed?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plan_type: "free" | "starter" | "pro";
      store_type: "apple" | "google";
      app_role: "own" | "competitor";
    };
  };
}
