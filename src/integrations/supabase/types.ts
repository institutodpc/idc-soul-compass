export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      answers: {
        Row: {
          created_at: string | null
          id: string
          option_id: number | null
          question_id: number
          user_id: string
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_id?: number | null
          question_id: number
          user_id: string
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          option_id?: number | null
          question_id?: number
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_answers_question"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_answers_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_hierarchy: {
        Row: {
          dominance_level: string
          hierarchy_position: number
          profile_id: number
        }
        Insert: {
          dominance_level: string
          hierarchy_position: number
          profile_id: number
        }
        Update: {
          dominance_level?: string
          hierarchy_position?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile_hierarchy_profile"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_hierarchy_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_weights: {
        Row: {
          profile_id: number | null
          question_id: number
          weight: number | null
        }
        Insert: {
          profile_id?: number | null
          question_id: number
          weight?: number | null
        }
        Update: {
          profile_id?: number | null
          question_id?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile_weights_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          biblical_character: string | null
          common_pains: string[] | null
          descricao: string | null
          exaltation: string | null
          formation: string | null
          id: number
          nome: string | null
          prophetic_summary: string | null
          refuge: string | null
          steps_to_exit: string[] | null
        }
        Insert: {
          biblical_character?: string | null
          common_pains?: string[] | null
          descricao?: string | null
          exaltation?: string | null
          formation?: string | null
          id: number
          nome?: string | null
          prophetic_summary?: string | null
          refuge?: string | null
          steps_to_exit?: string[] | null
        }
        Update: {
          biblical_character?: string | null
          common_pains?: string[] | null
          descricao?: string | null
          exaltation?: string | null
          formation?: string | null
          id?: number
          nome?: string | null
          prophetic_summary?: string | null
          refuge?: string | null
          steps_to_exit?: string[] | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          id: number
          text: string | null
        }
        Insert: {
          category?: string | null
          id: number
          text?: string | null
        }
        Update: {
          category?: string | null
          id?: number
          text?: string | null
        }
        Relationships: []
      }
      user_profile_scores: {
        Row: {
          created_at: string | null
          id: string
          profile_id: number
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: number
          score: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: number
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile_scores_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_scores_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          last_quiz_date: string | null
          name: string
          quiz_count: number | null
          top_profile_id: number | null
          top_profile_score: number | null
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_quiz_date?: string | null
          name: string
          quiz_count?: number | null
          top_profile_id?: number | null
          top_profile_score?: number | null
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_quiz_date?: string | null
          name?: string
          quiz_count?: number | null
          top_profile_id?: number | null
          top_profile_score?: number | null
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profiles_profile"
            columns: ["top_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_top_profile_id_fkey"
            columns: ["top_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nome: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_perfil_dominante: {
        Args: { usuario_id: string }
        Returns: {
          perfil_id: string
          nome: string
          categoria: string
          pontuacao_total: number
          nivel_alerta: string
        }[]
      }
      calcular_perfis: {
        Args: { user_uuid: string }
        Returns: {
          profile_id: number
          score_normalizado: number
        }[]
      }
      finalizar_quiz: {
        Args: { user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
