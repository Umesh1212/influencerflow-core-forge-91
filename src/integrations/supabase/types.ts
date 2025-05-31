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
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          diff: Json | null
          id: string
          logged_at: string | null
          row_id: string
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          diff?: Json | null
          id?: string
          logged_at?: string | null
          row_id: string
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          diff?: Json | null
          id?: string
          logged_at?: string | null
          row_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          billing_email: string
          created_at: string | null
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          billing_email: string
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          billing_email?: string
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_creators: {
        Row: {
          campaign_id: string
          created_at: string | null
          creator_id: string
          id: string
          quoted_fee_numeric: number | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          terms: Json | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          creator_id: string
          id?: string
          quoted_fee_numeric?: number | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          terms?: Json | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          quoted_fee_numeric?: number | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          terms?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_kpis"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          brand_id: string
          brief: string | null
          budget_numeric: number | null
          created_at: string | null
          currency: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          brief?: string | null
          budget_numeric?: number | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          brief?: string | null
          budget_numeric?: number | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          campaign_creator_id: string
          created_at: string | null
          id: string
          pdf_url: string | null
          signed_at: string | null
          status: string | null
        }
        Insert: {
          campaign_creator_id: string
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          signed_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_creator_id?: string
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          signed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          ig_id: string | null
          languages: string[] | null
          payout_method: Json | null
          stats: Json | null
          user_id: string
          yt_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          ig_id?: string | null
          languages?: string[] | null
          payout_method?: Json | null
          stats?: Json | null
          user_id: string
          yt_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          ig_id?: string | null
          languages?: string[] | null
          payout_method?: Json | null
          stats?: Json | null
          user_id?: string
          yt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_numeric: number
          campaign_id: string
          created_at: string | null
          currency: string | null
          due_date: string
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
        }
        Insert: {
          amount_numeric: number
          campaign_id: string
          created_at?: string | null
          currency?: string | null
          due_date: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Update: {
          amount_numeric?: number
          campaign_id?: string
          created_at?: string | null
          currency?: string | null
          due_date?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_kpis"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "invoices_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          campaign_creator_id: string
          created_at: string | null
          id: string
          sender_role: Database["public"]["Enums"]["user_role"]
          voice_url: string | null
        }
        Insert: {
          body?: string | null
          campaign_creator_id: string
          created_at?: string | null
          id?: string
          sender_role: Database["public"]["Enums"]["user_role"]
          voice_url?: string | null
        }
        Update: {
          body?: string | null
          campaign_creator_id?: string
          created_at?: string | null
          id?: string
          sender_role?: Database["public"]["Enums"]["user_role"]
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount_numeric: number
          campaign_id: string
          created_at: string | null
          creator_id: string
          id: string
          milestone: string | null
          released_at: string | null
          status: Database["public"]["Enums"]["payout_status"] | null
        }
        Insert: {
          amount_numeric: number
          campaign_id: string
          created_at?: string | null
          creator_id: string
          id?: string
          milestone?: string | null
          released_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
        }
        Update: {
          amount_numeric?: number
          campaign_id?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          milestone?: string | null
          released_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_kpis"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "payouts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          campaign_creator_id: string
          created_at: string | null
          fetched_at: string | null
          id: string
          metrics: Json | null
          platform: string
          post_url: string | null
        }
        Insert: {
          campaign_creator_id: string
          created_at?: string | null
          fetched_at?: string | null
          id?: string
          metrics?: Json | null
          platform: string
          post_url?: string | null
        }
        Update: {
          campaign_creator_id?: string
          created_at?: string | null
          fetched_at?: string | null
          id?: string
          metrics?: Json | null
          platform?: string
          post_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          locale: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          locale?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          locale?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      campaign_kpis: {
        Row: {
          campaign_id: string | null
          cpm_numeric: number | null
          engagements_sum: number | null
          updated_at: string | null
          views_sum: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      draft_outreach: {
        Args: { campaign_creator_uuid: string }
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_brand_access: {
        Args: { brand_uuid: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      release_payout: {
        Args: { payout_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      campaign_status:
        | "draft"
        | "sent"
        | "negotiating"
        | "signed"
        | "live"
        | "completed"
        | "archived"
      invoice_status: "pending" | "paid" | "overdue"
      payout_status: "scheduled" | "released"
      user_role: "brand" | "agency" | "creator" | "admin"
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
    Enums: {
      campaign_status: [
        "draft",
        "sent",
        "negotiating",
        "signed",
        "live",
        "completed",
        "archived",
      ],
      invoice_status: ["pending", "paid", "overdue"],
      payout_status: ["scheduled", "released"],
      user_role: ["brand", "agency", "creator", "admin"],
    },
  },
} as const
