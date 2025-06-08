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
          credential_groups: Json | null
          credentials: Json
          devices: Json | null
          extract_pcap_commands: Json
          fail_safe: Json | null
          id: number
          interface_commands: Json
          interface_regex: Json
          remove_pcap_commands: Json
          return_paths: Json
          schedule: Json | null
          stop_capture_commands: Json
          storage_mode: string
          storage_timeout: number
          syslog: Json | null
          tmp_directories: Json
          vendors: Json
        }
        Insert: {
          auto_discovery?: Json | null
          capture_commands: Json
          capture_directory: string
          capture_server: Json
          credential_groups?: Json | null
          credentials: Json
          devices?: Json | null
          extract_pcap_commands: Json
          fail_safe?: Json | null
          id?: number
          interface_commands: Json
          interface_regex: Json
          remove_pcap_commands: Json
          return_paths: Json
          schedule?: Json | null
          stop_capture_commands: Json
          storage_mode: string
          storage_timeout: number
          syslog?: Json | null
          tmp_directories: Json
          vendors: Json
        }
        Update: {
          auto_discovery?: Json | null
          capture_commands?: Json
          capture_directory?: string
          capture_server?: Json
          credential_groups?: Json | null
          credentials?: Json
          devices?: Json | null
          extract_pcap_commands?: Json
          fail_safe?: Json | null
          id?: number
          interface_commands?: Json
          interface_regex?: Json
          remove_pcap_commands?: Json
          return_paths?: Json
          schedule?: Json | null
          stop_capture_commands?: Json
          storage_mode?: string
          storage_timeout?: number
          syslog?: Json | null
          tmp_directories?: Json
          vendors?: Json
        }
        Relationships: []
      }
      credential_sets: {
        Row: {
          created_at: string | null
          enable_password: string | null
          enable_required: boolean | null
          id: number
          name: string
          password: string | null
          updated_at: string | null
          user_name: string
        }
        Insert: {
          created_at?: string | null
          enable_password?: string | null
          enable_required?: boolean | null
          id?: number
          name: string
          password?: string | null
          updated_at?: string | null
          user_name: string
        }
        Update: {
          created_at?: string | null
          enable_password?: string | null
          enable_required?: boolean | null
          id?: number
          name?: string
          password?: string | null
          updated_at?: string | null
          user_name?: string
        }
        Relationships: []
      }
      device_configurations: {
        Row: {
          configuration: Json
          created_at: string
          created_by: string | null
          description: string | null
          device_type: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          updated_by: string | null
          vendor: string | null
          version: number
        }
        Insert: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          device_type: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          updated_by?: string | null
          vendor?: string | null
          version?: number
        }
        Update: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          device_type?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          updated_by?: string | null
          vendor?: string | null
          version?: number
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
          timestamp: string | null
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
          timestamp?: string | null
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
          timestamp?: string | null
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
          timestamp: string | null
        }
        Insert: {
          device_count: number
          id?: number
          metric_name: string
          metric_value: number
          timestamp?: string | null
        }
        Update: {
          device_count?: number
          id?: number
          metric_name?: string
          metric_value?: number
          timestamp?: string | null
        }
        Relationships: []
      }
      discovered_devices: {
        Row: {
          auto_discover_neighbors: boolean | null
          capture_filter: string | null
          connection_mode: string | null
          credential_set: string | null
          description: string | null
          device_group: string | null
          device_type: string | null
          discovery_enabled: boolean | null
          enabled: boolean | null
          hostname: string | null
          id: string
          ip: string
          last_seen: string | null
          mac_address: string | null
          name: string | null
          port: number | null
          ports: Json | null
          protocol: string | null
          return_path_credential_set: string | null
          schedule: Json | null
          seed: boolean | null
          source: string | null
          status: string | null
          vendor: string | null
        }
        Insert: {
          auto_discover_neighbors?: boolean | null
          capture_filter?: string | null
          connection_mode?: string | null
          credential_set?: string | null
          description?: string | null
          device_group?: string | null
          device_type?: string | null
          discovery_enabled?: boolean | null
          enabled?: boolean | null
          hostname?: string | null
          id?: string
          ip: string
          last_seen?: string | null
          mac_address?: string | null
          name?: string | null
          port?: number | null
          ports?: Json | null
          protocol?: string | null
          return_path_credential_set?: string | null
          schedule?: Json | null
          seed?: boolean | null
          source?: string | null
          status?: string | null
          vendor?: string | null
        }
        Update: {
          auto_discover_neighbors?: boolean | null
          capture_filter?: string | null
          connection_mode?: string | null
          credential_set?: string | null
          description?: string | null
          device_group?: string | null
          device_type?: string | null
          discovery_enabled?: boolean | null
          enabled?: boolean | null
          hostname?: string | null
          id?: string
          ip?: string
          last_seen?: string | null
          mac_address?: string | null
          name?: string | null
          port?: number | null
          ports?: Json | null
          protocol?: string | null
          return_path_credential_set?: string | null
          schedule?: Json | null
          seed?: boolean | null
          source?: string | null
          status?: string | null
          vendor?: string | null
        }
        Relationships: []
      }
      discovery_jobs: {
        Row: {
          device: string | null
          devices_found: number | null
          end_time: string | null
          error_message: string | null
          id: string
          ip: string | null
          job_id: string
          progress: number | null
          start_time: string
          status: string
          target_subnet: string | null
        }
        Insert: {
          device?: string | null
          devices_found?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          ip?: string | null
          job_id: string
          progress?: number | null
          start_time?: string
          status: string
          target_subnet?: string | null
        }
        Update: {
          device?: string | null
          devices_found?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          ip?: string | null
          job_id?: string
          progress?: number | null
          start_time?: string
          status?: string
          target_subnet?: string | null
        }
        Relationships: []
      }
      discovery_results: {
        Row: {
          created_at: string | null
          devices: Json
          id: string
          job_id: string
          status: string | null
          summary: Json
        }
        Insert: {
          created_at?: string | null
          devices?: Json
          id?: string
          job_id: string
          status?: string | null
          summary?: Json
        }
        Update: {
          created_at?: string | null
          devices?: Json
          id?: string
          job_id?: string
          status?: string | null
          summary?: Json
        }
        Relationships: []
      }
      discovery_settings: {
        Row: {
          access_mode: string | null
          add_discovered_devices: boolean | null
          created_at: string | null
          credentials_to_try: string[] | null
          description: string | null
          discovery_interval: number | null
          discovery_mode: string | null
          discovery_protocols: Json | null
          enabled: boolean
          exclusions: string[] | null
          id: number
          interval: string | null
          max_devices: number | null
          name: string
          polling_interval: number | null
          port_scan_enabled: boolean | null
          port_scan_ports: number[] | null
          progress: number | null
          protocols: Json | null
          retry_count: number | null
          scan_timeout: number | null
          schedule: Json | null
          seed_device_id: string | null
          seed_ip: string | null
          start_layer: string | null
          status: string | null
          subnet_ranges: string[] | null
          subnet_scan: boolean | null
          subnet_scan_range: string | null
          target_layers: string[] | null
          threads_per_device: number | null
          updated_at: string | null
        }
        Insert: {
          access_mode?: string | null
          add_discovered_devices?: boolean | null
          created_at?: string | null
          credentials_to_try?: string[] | null
          description?: string | null
          discovery_interval?: number | null
          discovery_mode?: string | null
          discovery_protocols?: Json | null
          enabled?: boolean
          exclusions?: string[] | null
          id?: number
          interval?: string | null
          max_devices?: number | null
          name?: string
          polling_interval?: number | null
          port_scan_enabled?: boolean | null
          port_scan_ports?: number[] | null
          progress?: number | null
          protocols?: Json | null
          retry_count?: number | null
          scan_timeout?: number | null
          schedule?: Json | null
          seed_device_id?: string | null
          seed_ip?: string | null
          start_layer?: string | null
          status?: string | null
          subnet_ranges?: string[] | null
          subnet_scan?: boolean | null
          subnet_scan_range?: string | null
          target_layers?: string[] | null
          threads_per_device?: number | null
          updated_at?: string | null
        }
        Update: {
          access_mode?: string | null
          add_discovered_devices?: boolean | null
          created_at?: string | null
          credentials_to_try?: string[] | null
          description?: string | null
          discovery_interval?: number | null
          discovery_mode?: string | null
          discovery_protocols?: Json | null
          enabled?: boolean
          exclusions?: string[] | null
          id?: number
          interval?: string | null
          max_devices?: number | null
          name?: string
          polling_interval?: number | null
          port_scan_enabled?: boolean | null
          port_scan_ports?: number[] | null
          progress?: number | null
          protocols?: Json | null
          retry_count?: number | null
          scan_timeout?: number | null
          schedule?: Json | null
          seed_device_id?: string | null
          seed_ip?: string | null
          start_layer?: string | null
          status?: string | null
          subnet_ranges?: string[] | null
          subnet_scan?: boolean | null
          subnet_scan_range?: string | null
          target_layers?: string[] | null
          threads_per_device?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discovery_tasks: {
        Row: {
          created_at: string
          credential_set: string
          day_of_month: string | null
          day_of_week: string | null
          device_id: string
          enabled: boolean
          frequency: string
          id: string
          label: string | null
          last_run: string | null
          next_run: string | null
          template_id: string | null
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_set?: string
          day_of_month?: string | null
          day_of_week?: string | null
          device_id: string
          enabled?: boolean
          frequency?: string
          id?: string
          label?: string | null
          last_run?: string | null
          next_run?: string | null
          template_id?: string | null
          time?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_set?: string
          day_of_month?: string | null
          day_of_week?: string | null
          device_id?: string
          enabled?: boolean
          frequency?: string
          id?: string
          label?: string | null
          last_run?: string | null
          next_run?: string | null
          template_id?: string | null
          time?: string
          updated_at?: string
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
      network_discovery_devices: {
        Row: {
          capture_filter: string | null
          connection_mode: string | null
          created_at: string | null
          credential_set: string
          enabled: boolean
          id: number
          ip: string
          name: string
          port: number
          prompt: string | null
          protocol: string
          return_path_credential_set: string | null
          seed: boolean | null
          updated_at: string | null
          vendor: string
        }
        Insert: {
          capture_filter?: string | null
          connection_mode?: string | null
          created_at?: string | null
          credential_set: string
          enabled?: boolean
          id?: number
          ip: string
          name: string
          port?: number
          prompt?: string | null
          protocol?: string
          return_path_credential_set?: string | null
          seed?: boolean | null
          updated_at?: string | null
          vendor: string
        }
        Update: {
          capture_filter?: string | null
          connection_mode?: string | null
          created_at?: string | null
          credential_set?: string
          enabled?: boolean
          id?: number
          ip?: string
          name?: string
          port?: number
          prompt?: string | null
          protocol?: string
          return_path_credential_set?: string | null
          seed?: boolean | null
          updated_at?: string | null
          vendor?: string
        }
        Relationships: []
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
      schedule_rule_applications: {
        Row: {
          applied_at: string
          device_group: string | null
          device_id: string | null
          id: string
          rule_id: string
        }
        Insert: {
          applied_at?: string
          device_group?: string | null
          device_id?: string | null
          id?: string
          rule_id: string
        }
        Update: {
          applied_at?: string
          device_group?: string | null
          device_id?: string | null
          id?: string
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_rule_applications_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "discovered_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_rule_applications_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "schedule_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_rules: {
        Row: {
          created_at: string
          day_of_month: string | null
          day_of_week: string | null
          description: string | null
          enabled: boolean
          frequency: string
          id: string
          is_default: boolean
          last_run: string | null
          name: string
          next_run: string | null
          rule_type: string
          time: string | null
        }
        Insert: {
          created_at?: string
          day_of_month?: string | null
          day_of_week?: string | null
          description?: string | null
          enabled?: boolean
          frequency: string
          id?: string
          is_default?: boolean
          last_run?: string | null
          name: string
          next_run?: string | null
          rule_type: string
          time?: string | null
        }
        Update: {
          created_at?: string
          day_of_month?: string | null
          day_of_week?: string | null
          description?: string | null
          enabled?: boolean
          frequency?: string
          id?: string
          is_default?: boolean
          last_run?: string | null
          name?: string
          next_run?: string | null
          rule_type?: string
          time?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          data_mode: string | null
          discovery_api_key: string | null
          discovery_api_url: string | null
          external_job_ids: string[] | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_mode?: string | null
          discovery_api_key?: string | null
          discovery_api_url?: string | null
          external_job_ids?: string[] | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_mode?: string | null
          discovery_api_key?: string | null
          discovery_api_url?: string | null
          external_job_ids?: string[] | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
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
      unified_config: {
        Row: {
          config: Json
          created_at: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bulk_update_discovered_devices: {
        Args: { device_ids: string[]; device_updates: Json }
        Returns: {
          updated_device: Database["public"]["Tables"]["discovered_devices"]["Row"]
        }[]
      }
      update_discovered_device_info: {
        Args: { device_id: string; device_updates: Json }
        Returns: {
          auto_discover_neighbors: boolean | null
          capture_filter: string | null
          connection_mode: string | null
          credential_set: string | null
          description: string | null
          device_group: string | null
          device_type: string | null
          discovery_enabled: boolean | null
          enabled: boolean | null
          hostname: string | null
          id: string
          ip: string
          last_seen: string | null
          mac_address: string | null
          name: string | null
          port: number | null
          ports: Json | null
          protocol: string | null
          return_path_credential_set: string | null
          schedule: Json | null
          seed: boolean | null
          source: string | null
          status: string | null
          vendor: string | null
        }
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
