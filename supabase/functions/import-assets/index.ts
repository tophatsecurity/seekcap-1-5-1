import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const data = await req.json();
    const assets = Object.entries(data).map(([mac, details]: [string, any]) => {
      return {
        mac_address: mac,
        src_ip: details.src_ip || null,
        eth_proto: details.eth_proto || null,
        icmp: details.icmp || false,
        ip_protocols: details.ip_protocols || [],
        tcp_ports: details.tcp_ports || [],
        udp_ports: details.udp_ports || [],
        scada_protocols: details.scada_protocols || [],
        scada_data: details.scada_data || {}
      };
    });

    // Keep track of successes and failures
    const results = {
      total: assets.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const asset of assets) {
      try {
        // Insert or update the main asset record
        const { error: assetError } = await supabaseClient
          .from("assets")
          .upsert({
            mac_address: asset.mac_address,
            src_ip: asset.src_ip,
            eth_proto: asset.eth_proto,
            icmp: asset.icmp
          });

        if (assetError) throw assetError;

        // Handle IP protocols
        if (asset.ip_protocols && asset.ip_protocols.length > 0) {
          // First, delete existing protocols for this asset to avoid duplicates
          await supabaseClient
            .from("ip_protocols")
            .delete()
            .eq("asset_mac", asset.mac_address);

          // Insert new protocols
          for (const protocol of asset.ip_protocols) {
            await supabaseClient
              .from("ip_protocols")
              .insert({
                asset_mac: asset.mac_address,
                protocol: protocol
              });
          }
        }

        // Handle TCP ports
        if (asset.tcp_ports && asset.tcp_ports.length > 0) {
          // First, delete existing ports for this asset
          await supabaseClient
            .from("tcp_ports")
            .delete()
            .eq("asset_mac", asset.mac_address);

          // Insert new ports
          for (const port of asset.tcp_ports) {
            await supabaseClient
              .from("tcp_ports")
              .insert({
                asset_mac: asset.mac_address,
                port: port
              });
          }
        }

        // Handle UDP ports
        if (asset.udp_ports && asset.udp_ports.length > 0) {
          // First, delete existing ports for this asset
          await supabaseClient
            .from("udp_ports")
            .delete()
            .eq("asset_mac", asset.mac_address);

          // Insert new ports
          for (const port of asset.udp_ports) {
            await supabaseClient
              .from("udp_ports")
              .insert({
                asset_mac: asset.mac_address,
                port: port
              });
          }
        }

        // Handle SCADA protocols
        if (asset.scada_protocols && asset.scada_protocols.length > 0) {
          // First, delete existing protocols for this asset
          await supabaseClient
            .from("scada_protocols")
            .delete()
            .eq("asset_mac", asset.mac_address);

          // Insert new protocols
          for (const protocol of asset.scada_protocols) {
            await supabaseClient
              .from("scada_protocols")
              .insert({
                asset_mac: asset.mac_address,
                protocol: protocol
              });
          }
        }

        // Handle SCADA data
        if (asset.scada_data && Object.keys(asset.scada_data).length > 0) {
          // First, delete existing data for this asset
          await supabaseClient
            .from("scada_data")
            .delete()
            .eq("asset_mac", asset.mac_address);

          // Insert new data
          for (const [key, value] of Object.entries(asset.scada_data)) {
            await supabaseClient
              .from("scada_data")
              .insert({
                asset_mac: asset.mac_address,
                key: key,
                value: value
              });
          }
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          mac: asset.mac_address,
          error: error.message
        });
        console.error(`Error processing asset ${asset.mac_address}:`, error);
      }
    }

    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error processing import request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
