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
          airtime: number | null
          ccq: number | null
          channel: string | null
          channel_width: string | null
          connection: string | null
          device_type: string | null
          distance: number | null
          download_bps: number | null
          eth_proto: string | null
          experience: string | null
          first_seen: string | null
          icmp: boolean | null
          ip_address: string | null
          last_seen: string | null
          mac_address: string
          name: string | null
          network: string | null
          noise_floor: number | null
          organization_id: number | null
          rx_rate: number | null
          signal_strength: number | null
          src_ip: string | null
          technology: string | null
          tx_power: number | null
          tx_rate: number | null
          upload_bps: number | null
          uptime: string | null
          usage_mb: number | null
          vendor: string | null
          wifi: string | null
        }
        Insert: {
          airtime?: number | null
          ccq?: number | null
          channel?: string | null
          channel_width?: string | null
          connection?: string | null
          device_type?: string | null
          distance?: number | null
          download_bps?: number | null
          eth_proto?: string | null
          experience?: string | null
          first_seen?: string | null
          icmp?: boolean | null
          ip_address?: string | null
          last_seen?: string | null
          mac_address: string
          name?: string | null
          network?: string | null
          noise_floor?: number | null
          organization_id?: number | null
          rx_rate?: number | null
          signal_strength?: number | null
          src_ip?: string | null
          technology?: string | null
          tx_power?: number | null
          tx_rate?: number | null
          upload_bps?: number | null
          uptime?: string | null
          usage_mb?: number | null
          vendor?: string | null
          wifi?: string | null
        }
        Update: {
          airtime?: number | null
          ccq?: number | null
          channel?: string | null
          channel_width?: string | null
          connection?: string | null
          device_type?: string | null
          distance?: number | null
          download_bps?: number | null
          eth_proto?: string | null
          experience?: string | null
          first_seen?: string | null
          icmp?: boolean | null
          ip_address?: string | null
          last_seen?: string | null
          mac_address?: string
          name?: string | null
          network?: string | null
          noise_floor?: number | null
          organization_id?: number | null
          rx_rate?: number | null
          signal_strength?: number | null
          src_ip?: string | null
          technology?: string | null
          tx_power?: number | null
          tx_rate?: number | null
          upload_bps?: number | null
          uptime?: string | null
          usage_mb?: number | null
          vendor?: string | null
          wifi?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      capture_devices: {
        Row: {
          capture_filter: string | null
          config: Json | null
          credential_set: string
          enabled: boolean
          id: number
          ip: string
          name: string
          port: number
          protocol: string
          return_path_credential_set: string
          vendor: string
        }
        Insert: {
          capture_filter?: string | null
          config?: Json | null
          credential_set: string
          enabled?: boolean
          id?: number
          ip: string
          name: string
          port: number
          protocol: string
          return_path_credential_set: string
          vendor: string
        }
        Update: {
          capture_filter?: string | null
          config?: Json | null
          credential_set?: string
          enabled?: boolean
          id?: number
          ip?: string
          name?: string
          port?: number
          protocol?: string
          return_path_credential_set?: string
          vendor?: string
        }
        Relationships: []
      }
      capture_settings: {
        Row: {
          auto_discovery: Json | null
          capture_commands: Json
          capture_directory: string
          capture_server: Json
          credentials: Json
          extract_pcap_commands: Json
          id: number
          interface_commands: Json
          interface_regex: Json
          remove_pcap_commands: Json
          return_paths: Json
          stop_capture_commands: Json
          storage_mode: string
          storage_timeout: number
          tmp_directories: Json
          vendors: Json
        }
        Insert: {
          auto_discovery?: Json | null
          capture_commands: Json
          capture_directory: string
          capture_server: Json
          credentials: Json
          extract_pcap_commands: Json
          id?: number
          interface_commands: Json
          interface_regex: Json
          remove_pcap_commands: Json
          return_paths: Json
          stop_capture_commands: Json
          storage_mode: string
          storage_timeout: number
          tmp_directories: Json
          vendors: Json
        }
        Update: {
          auto_discovery?: Json | null
          capture_commands?: Json
          capture_directory?: string
          capture_server?: Json
          credentials?: Json
          extract_pcap_commands?: Json
          id?: number
          interface_commands?: Json
          interface_regex?: Json
          remove_pcap_commands?: Json
          return_paths?: Json
          stop_capture_commands?: Json
          storage_mode?: string
          storage_timeout?: number
          tmp_directories?: Json
          vendors?: Json
        }
        Relationships: []
      }
      device_load_stats: {
        Row: {
          collection_status: string
          device_name: string
          id: number
          load_avg_15m: number
          load_avg_1m: number
          load_avg_5m: number
          memory_used_percent: number
          status_reason: string | null
          storage_used_percent: number
          timestamp: string
          traffic_in_mbps: number
          traffic_out_mbps: number
        }
        Insert: {
          collection_status: string
          device_name: string
          id?: number
          load_avg_15m: number
          load_avg_1m: number
          load_avg_5m: number
          memory_used_percent: number
          status_reason?: string | null
          storage_used_percent: number
          timestamp?: string
          traffic_in_mbps: number
          traffic_out_mbps: number
        }
        Update: {
          collection_status?: string
          device_name?: string
          id?: number
          load_avg_15m?: number
          load_avg_1m?: number
          load_avg_5m?: number
          memory_used_percent?: number
          status_reason?: string | null
          storage_used_percent?: number
          timestamp?: string
          traffic_in_mbps?: number
          traffic_out_mbps?: number
        }
        Relationships: []
      }
      device_metrics_summary: {
        Row: {
          device_count: number
          id: number
          metric_name: string
          metric_value: number
          timestamp: string
        }
        Insert: {
          device_count: number
          id?: number
          metric_name: string
          metric_value: number
          timestamp?: string
        }
        Update: {
          device_count?: number
          id?: number
          metric_name?: string
          metric_value?: number
          timestamp?: string
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
      network_devices: {
        Row: {
          application: string | null
          ch_24_ghz: string | null
          ch_5_ghz: string | null
          connected: number | null
          device_type: string
          download: string | null
          experience: string | null
          first_seen: string | null
          id: number
          ip_address: string | null
          last_seen: string | null
          mac_address: string | null
          name: string
          organization_id: number | null
          parent_device: string | null
          status: string | null
          uplink: string | null
          upload: string | null
          usage_24hr: string | null
        }
        Insert: {
          application?: string | null
          ch_24_ghz?: string | null
          ch_5_ghz?: string | null
          connected?: number | null
          device_type: string
          download?: string | null
          experience?: string | null
          first_seen?: string | null
          id?: number
          ip_address?: string | null
          last_seen?: string | null
          mac_address?: string | null
          name: string
          organization_id?: number | null
          parent_device?: string | null
          status?: string | null
          uplink?: string | null
          upload?: string | null
          usage_24hr?: string | null
        }
        Update: {
          application?: string | null
          ch_24_ghz?: string | null
          ch_5_ghz?: string | null
          connected?: number | null
          device_type?: string
          download?: string | null
          experience?: string | null
          first_seen?: string | null
          id?: number
          ip_address?: string | null
          last_seen?: string | null
          mac_address?: string | null
          name?: string
          organization_id?: number | null
          parent_device?: string | null
          status?: string | null
          uplink?: string | null
          upload?: string | null
          usage_24hr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_devices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_ip_ranges: {
        Row: {
          description: string | null
          id: number
          netmask: string
          network: string
          organization_id: number
        }
        Insert: {
          description?: string | null
          id?: number
          netmask: string
          network: string
          organization_id: number
        }
        Update: {
          description?: string | null
          id?: number
          netmask?: string
          network?: string
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_ip_ranges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_vendors: {
        Row: {
          description: string | null
          id: number
          organization_id: number
          vendor: string
        }
        Insert: {
          description?: string | null
          id?: number
          organization_id: number
          vendor: string
        }
        Update: {
          description?: string | null
          id?: number
          organization_id?: number
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      pcap_files: {
        Row: {
          capture_end: string | null
          capture_start: string
          created_at: string
          device_id: number | null
          file_name: string
          file_size_bytes: number
          id: number
          packet_count: number | null
          status: string
          storage_path: string
        }
        Insert: {
          capture_end?: string | null
          capture_start: string
          created_at?: string
          device_id?: number | null
          file_name: string
          file_size_bytes: number
          id?: number
          packet_count?: number | null
          status: string
          storage_path: string
        }
        Update: {
          capture_end?: string | null
          capture_start?: string
          created_at?: string
          device_id?: number | null
          file_name?: string
          file_size_bytes?: number
          id?: number
          packet_count?: number | null
          status?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "pcap_files_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "capture_devices"
            referencedColumns: ["id"]
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
