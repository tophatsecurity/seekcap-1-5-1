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
