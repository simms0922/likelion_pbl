export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      lions: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          part: string;
          is_me: boolean;
          summary: string;
          skills: string[];
          intro: string;
          email: string;
          phone: string;
          website: string;
          message: string;
          organization: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          part: string;
          is_me?: boolean;
          summary: string;
          skills?: string[];
          intro: string;
          email: string;
          phone: string;
          website: string;
          message: string;
          organization?: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          part?: string;
          is_me?: boolean;
          summary?: string;
          skills?: string[];
          intro?: string;
          email?: string;
          phone?: string;
          website?: string;
          message?: string;
          organization?: string;
        };
        Relationships: []; // 👈 이 부분이 추가되었습니다!
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>; // 👈 이 부분도 추가되었습니다!
  };
}