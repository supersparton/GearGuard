export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: Database["public"]["Enums"]["activity_action"]
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          performed_at: string | null
          performed_by: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["activity_action"]
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string | null
          performed_by?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["activity_action"]
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category_id: string | null
          company_name: string | null
          created_at: string | null
          default_technician_id: string | null
          department: string
          description: string | null
          id: string
          location: string
          maintenance_team_id: string
          name: string
          notes: string | null
          purchase_date: string
          scrap_date: string | null
          serial_number: string
          status: Database["public"]["Enums"]["equipment_status"] | null
          updated_at: string | null
          used_by_employee_name: string | null
          warranty_expiry: string | null
          work_center_id: string | null
        }
        Insert: {
          category_id?: string | null
          company_name?: string | null
          created_at?: string | null
          default_technician_id?: string | null
          department: string
          description?: string | null
          id?: string
          location: string
          maintenance_team_id: string
          name: string
          notes?: string | null
          purchase_date: string
          scrap_date?: string | null
          serial_number: string
          status?: Database["public"]["Enums"]["equipment_status"] | null
          updated_at?: string | null
          used_by_employee_name?: string | null
          warranty_expiry?: string | null
          work_center_id?: string | null
        }
        Update: {
          category_id?: string | null
          company_name?: string | null
          created_at?: string | null
          default_technician_id?: string | null
          department?: string
          description?: string | null
          id?: string
          location?: string
          maintenance_team_id?: string
          name?: string
          notes?: string | null
          purchase_date?: string
          scrap_date?: string | null
          serial_number?: string
          status?: Database["public"]["Enums"]["equipment_status"] | null
          updated_at?: string | null
          used_by_employee_name?: string | null
          warranty_expiry?: string | null
          work_center_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_default_technician_id_fkey"
            columns: ["default_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "maintenance_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_work_center_id_fkey"
            columns: ["work_center_id"]
            isOneToOne: false
            referencedRelation: "work_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          assigned_technician_id: string | null
          category_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          duration_hours: number | null
          equipment_id: string
          id: string
          maintenance_team_id: string | null
          priority: Database["public"]["Enums"]["request_priority"] | null
          request_number: string | null
          request_type: Database["public"]["Enums"]["request_type"] | null
          resolution_notes: string | null
          scheduled_date: string | null
          stage: Database["public"]["Enums"]["request_stage"] | null
          started_at: string | null
          subject: string
          target_type: string | null
          updated_at: string | null
          work_center_id: string | null
        }
        Insert: {
          assigned_technician_id?: string | null
          category_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          duration_hours?: number | null
          equipment_id: string
          id?: string
          maintenance_team_id?: string | null
          priority?: Database["public"]["Enums"]["request_priority"] | null
          request_number?: string | null
          request_type?: Database["public"]["Enums"]["request_type"] | null
          resolution_notes?: string | null
          scheduled_date?: string | null
          stage?: Database["public"]["Enums"]["request_stage"] | null
          started_at?: string | null
          subject: string
          target_type?: string | null
          updated_at?: string | null
          work_center_id?: string | null
        }
        Update: {
          assigned_technician_id?: string | null
          category_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          duration_hours?: number | null
          equipment_id?: string
          id?: string
          maintenance_team_id?: string | null
          priority?: Database["public"]["Enums"]["request_priority"] | null
          request_number?: string | null
          request_type?: Database["public"]["Enums"]["request_type"] | null
          resolution_notes?: string | null
          scheduled_date?: string | null
          stage?: Database["public"]["Enums"]["request_stage"] | null
          started_at?: string | null
          subject?: string
          target_type?: string | null
          updated_at?: string | null
          work_center_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "v_equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "maintenance_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_work_center_id_fkey"
            columns: ["work_center_id"]
            isOneToOne: false
            referencedRelation: "work_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_request_id: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_request_id?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_request_id?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_request_id_fkey"
            columns: ["related_request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_request_id_fkey"
            columns: ["related_request_id"]
            isOneToOne: false
            referencedRelation: "v_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_request_id_fkey"
            columns: ["related_request_id"]
            isOneToOne: false
            referencedRelation: "v_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          first_name: string
          id: string
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["team_role"] | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "maintenance_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_centers: {
        Row: {
          capacity_efficiency: number | null
          code: string | null
          cost_per_hour: number | null
          created_at: string | null
          id: string
          name: string
          oee_target: number | null
          tag: string | null
        }
        Insert: {
          capacity_efficiency?: number | null
          code?: string | null
          cost_per_hour?: number | null
          created_at?: string | null
          id?: string
          name: string
          oee_target?: number | null
          tag?: string | null
        }
        Update: {
          capacity_efficiency?: number | null
          code?: string | null
          cost_per_hour?: number | null
          created_at?: string | null
          id?: string
          name?: string
          oee_target?: number | null
          tag?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_calendar: {
        Row: {
          color: string | null
          description: string | null
          due_date: string | null
          equipment_id: string | null
          equipment_name: string | null
          equipment_serial: string | null
          event_date: string | null
          id: string | null
          is_overdue: boolean | null
          is_preventive: boolean | null
          priority: Database["public"]["Enums"]["request_priority"] | null
          request_number: string | null
          request_type: Database["public"]["Enums"]["request_type"] | null
          scheduled_date: string | null
          stage: Database["public"]["Enums"]["request_stage"] | null
          team_name: string | null
          technician_name: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "v_equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      v_dashboard: {
        Row: {
          active_equipment: number | null
          active_teams: number | null
          active_users: number | null
          avg_repair_hours: number | null
          corrective_requests: number | null
          critical_open: number | null
          high_open: number | null
          in_progress_requests: number | null
          monthly_downtime_hours: number | null
          new_requests: number | null
          open_requests: number | null
          overdue_requests: number | null
          preventive_requests: number | null
          repaired_requests: number | null
          scrap_requests: number | null
          scrapped_equipment: number | null
          total_equipment: number | null
          total_requests: number | null
          under_maintenance_equipment: number | null
        }
        Relationships: []
      }
      v_equipment: {
        Row: {
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_name: string | null
          created_at: string | null
          default_technician_id: string | null
          default_technician_name: string | null
          department: string | null
          description: string | null
          id: string | null
          location: string | null
          maintenance_team_id: string | null
          name: string | null
          notes: string | null
          open_request_count: number | null
          purchase_date: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["equipment_status"] | null
          team_name: string | null
          updated_at: string | null
          warranty_expiry: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_default_technician_id_fkey"
            columns: ["default_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "maintenance_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      v_recent_activity: {
        Row: {
          action: Database["public"]["Enums"]["activity_action"] | null
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string | null
          new_values: Json | null
          old_values: Json | null
          performed_at: string | null
          performed_by: string | null
          performed_by_avatar: string | null
          performed_by_name: string | null
          request_number: string | null
          request_subject: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_requests: {
        Row: {
          assigned_technician_id: string | null
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_name: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          created_by_name: string | null
          days_until_due: number | null
          description: string | null
          due_date: string | null
          duration_hours: number | null
          equipment_id: string | null
          equipment_location: string | null
          equipment_name: string | null
          equipment_serial: string | null
          equipment_status:
            | Database["public"]["Enums"]["equipment_status"]
            | null
          id: string | null
          is_overdue: boolean | null
          maintenance_team_id: string | null
          priority: Database["public"]["Enums"]["request_priority"] | null
          request_number: string | null
          request_type: Database["public"]["Enums"]["request_type"] | null
          resolution_notes: string | null
          scheduled_date: string | null
          stage: Database["public"]["Enums"]["request_stage"] | null
          started_at: string | null
          subject: string | null
          team_name: string | null
          technician_avatar: string | null
          technician_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "v_equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "maintenance_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_maintenance_team_id_fkey"
            columns: ["maintenance_team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      v_teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          member_count: number | null
          name: string | null
          team_lead_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          member_count?: never
          name?: string | null
          team_lead_name?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          member_count?: never
          name?: string | null
          team_lead_name?: never
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_equipment_defaults: {
        Args: { p_equipment_id: string }
        Returns: {
          category_id: string
          category_name: string
          default_technician_id: string
          maintenance_team_id: string
          team_name: string
          technician_name: string
        }[]
      }
      get_team_members: {
        Args: { p_team_id: string }
        Returns: {
          email: string
          first_name: string
          full_name: string
          last_name: string
          team_role: Database["public"]["Enums"]["team_role"]
          user_id: string
        }[]
      }
    }
    Enums: {
      activity_action:
        | "created"
        | "updated"
        | "deleted"
        | "stage_changed"
        | "assigned"
        | "completed"
      equipment_status: "active" | "under_maintenance" | "scrapped"
      request_priority: "low" | "medium" | "high" | "critical"
      request_stage: "new" | "in_progress" | "repaired" | "scrap"
      request_type: "corrective" | "preventive"
      team_role: "lead" | "technician"
      user_role: "admin" | "manager" | "technician"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_action: [
        "created",
        "updated",
        "deleted",
        "stage_changed",
        "assigned",
        "completed",
      ],
      equipment_status: ["active", "under_maintenance", "scrapped"],
      request_priority: ["low", "medium", "high", "critical"],
      request_stage: ["new", "in_progress", "repaired", "scrap"],
      request_type: ["corrective", "preventive"],
      team_role: ["lead", "technician"],
      user_role: ["admin", "manager", "technician"],
    },
  },
} as const
