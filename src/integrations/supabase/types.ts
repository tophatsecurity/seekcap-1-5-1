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
      assets: {
        Row: {
          eth_proto: string | null
          first_seen: string | null
          icmp: boolean | null
          last_seen: string | null
          mac_address: string
          src_ip: string | null
        }
        Insert: {
          eth_proto?: string | null
          first_seen?: string | null
          icmp?: boolean | null
          last_seen?: string | null
          mac_address: string
          src_ip?: string | null
        }
        Update: {
          eth_proto?: string | null
          first_seen?: string | null
          icmp?: boolean | null
          last_seen?: string | null
          mac_address?: string
          src_ip?: string | null
        }
        Relationships: []
      }
      ip_protocols: {
        Row: {
          asset_mac: string | null
          id: number
          protocol: string
        }
        Insert: {
          asset_mac?: string | null
          id?: number
          protocol: string
        }
        Update: {
          asset_mac?: string | null
          id?: number
          protocol?: string
        }
        Relationships: [
          {
            foreignKeyName: "ip_protocols_asset_mac_fkey"
            columns: ["asset_mac"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["mac_address"]
          },
        ]
      }
      scada_data: {
        Row: {
          asset_mac: string | null
          id: number
          key: string
          value: Json
        }
        Insert: {
          asset_mac?: string | null
          id?: number
          key: string
          value: Json
        }
        Update: {
          asset_mac?: string | null
          id?: number
          key?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "scada_data_asset_mac_fkey"
            columns: ["asset_mac"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["mac_address"]
          },
        ]
      }
      scada_protocols: {
        Row: {
          asset_mac: string | null
          id: number
          protocol: string
        }
        Insert: {
          asset_mac?: string | null
          id?: number
          protocol: string
        }
        Update: {
          asset_mac?: string | null
          id?: number
          protocol?: string
        }
        Relationships: [
          {
            foreignKeyName: "scada_protocols_asset_mac_fkey"
            columns: ["asset_mac"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["mac_address"]
          },
        ]
      }
      tcp_ports: {
        Row: {
          asset_mac: string | null
          id: number
          port: number
        }
        Insert: {
          asset_mac?: string | null
          id?: number
          port: number
        }
        Update: {
          asset_mac?: string | null
          id?: number
          port?: number
        }
        Relationships: [
          {
            foreignKeyName: "tcp_ports_asset_mac_fkey"
            columns: ["asset_mac"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["mac_address"]
          },
        ]
      }
      udp_ports: {
        Row: {
          asset_mac: string | null
          id: number
          port: number
        }
        Insert: {
          asset_mac?: string | null
          id?: number
          port: number
        }
        Update: {
          asset_mac?: string | null
          id?: number
          port?: number
        }
        Relationships: [
          {
            foreignKeyName: "udp_ports_asset_mac_fkey"
            columns: ["asset_mac"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["mac_address"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
