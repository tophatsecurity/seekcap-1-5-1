
#!/usr/bin/env python3
"""
Script to update asset and device load statistics in Supabase database.
Run with: python update_stats.py --mode [assets|stats|both]
"""

import argparse
import json
import random
import time
import uuid
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import requests

# Configuration - replace with your Supabase project details
SUPABASE_URL = "https://rigarhwhsjbajtwwccoo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ2FyaHdoc2piYWp0d3djY29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODk2NjYsImV4cCI6MjA1NjE2NTY2Nn0.2hbvjVB50n7oEeAwoBn-RuPRfn1JFJiFbebvS6lu8YQ"  # Use anon key for public operations or service_role key for admin operations

# Helper functions
def get_timestamp() -> str:
    """Get current timestamp in ISO format."""
    return datetime.utcnow().isoformat()

def supabase_request(endpoint: str, method: str = 'GET', data: Optional[Dict] = None) -> Dict:
    """Make a request to the Supabase REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal" if method in ['POST', 'PATCH', 'DELETE'] else "return=representation"
    }
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json=data)
        elif method == 'PATCH':
            response = requests.patch(url, headers=headers, json=data)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        
        if method == 'DELETE' or (method in ['POST', 'PATCH'] and headers["Prefer"] == "return=minimal"):
            return {"success": True}
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making request to {url}: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response status: {e.response.status_code}")
            print(f"Response body: {e.response.text}")
        return {"error": str(e)}

def fetch_assets() -> List[Dict]:
    """Fetch all assets from the database."""
    print("Fetching existing assets...")
    return supabase_request("assets")

def fetch_device_stats() -> List[Dict]:
    """Fetch all device load statistics from the database."""
    print("Fetching existing device load statistics...")
    return supabase_request("device_load_stats")

def update_asset(mac_address: str, updates: Dict) -> Dict:
    """Update an asset in the database."""
    print(f"Updating asset {mac_address}...")
    endpoint = f"assets?mac_address=eq.{mac_address}"
    return supabase_request(endpoint, method='PATCH', data=updates)

def update_device_stats(device_id: int, updates: Dict) -> Dict:
    """Update device load statistics in the database."""
    print(f"Updating device load stat with ID {device_id}...")
    endpoint = f"device_load_stats?id=eq.{device_id}"
    return supabase_request(endpoint, method='PATCH', data=updates)

def insert_device_stats(stats: Dict) -> Dict:
    """Insert new device load statistics in the database."""
    print(f"Inserting new device load stat for {stats['device_name']}...")
    return supabase_request("device_load_stats", method='POST', data=stats)

def generate_random_updates_for_assets(assets: List[Dict]) -> None:
    """Generate random updates for assets."""
    experience_options = ['Excellent', 'Good', 'Fair', 'Poor']
    
    for asset in assets:
        # Only update some assets randomly
        if random.random() > 0.7:
            continue
            
        updates = {
            "last_seen": get_timestamp(),
            "signal_strength": random.randint(-90, -30) if random.random() > 0.3 else asset.get('signal_strength'),
            "download_bps": int(random.randint(1000000, 300000000)) if random.random() > 0.3 else asset.get('download_bps'),
            "upload_bps": int(random.randint(500000, 100000000)) if random.random() > 0.3 else asset.get('upload_bps'),
            "usage_mb": int(asset.get('usage_mb', 0) + random.randint(10, 500)) if random.random() > 0.5 else asset.get('usage_mb'),
            "experience": random.choice(experience_options) if random.random() > 0.5 else asset.get('experience')
        }
        
        result = update_asset(asset['mac_address'], updates)
        if "error" in result:
            print(f"Failed to update asset {asset['mac_address']}: {result['error']}")
        else:
            print(f"Successfully updated asset {asset['mac_address']}")

def generate_random_updates_for_device_stats(stats: List[Dict]) -> None:
    """Generate random updates for device load statistics."""
    status_options = ['active', 'halted', 'limited']
    status_reasons = {
        'halted': ['CPU Overload', 'Memory Exhaustion', 'Critical Error', 'System Failure'],
        'limited': ['High Load', 'Memory Pressure', 'Network Congestion', 'Resource Contention']
    }
    
    for stat in stats:
        # Decide whether to update or insert new stats
        should_update = random.random() > 0.3
        
        new_status = random.choices(status_options, weights=[0.8, 0.1, 0.1])[0]
        new_reason = None
        if new_status != 'active':
            new_reason = random.choice(status_reasons.get(new_status, ['Unknown']))
        
        updates = {
            "load_avg_1m": round(random.uniform(0.01, 8.0), 2),
            "load_avg_5m": round(random.uniform(0.01, 6.0), 2),
            "load_avg_15m": round(random.uniform(0.01, 5.0), 2),
            "memory_used_percent": round(random.uniform(10.0, 95.0), 1),
            "storage_used_percent": round(random.uniform(20.0, 90.0), 1),
            "traffic_in_mbps": round(random.uniform(1.0, 500.0), 1),
            "traffic_out_mbps": round(random.uniform(0.5, 300.0), 1),
            "collection_status": new_status,
            "status_reason": new_reason,
            "timestamp": get_timestamp()
        }
        
        if should_update:
            result = update_device_stats(stat['id'], updates)
            if "error" in result:
                print(f"Failed to update device stat {stat['id']}: {result['error']}")
            else:
                print(f"Successfully updated device stat {stat['id']}")
        else:
            # Create a new entry with different device name
            new_device_name = f"device-{uuid.uuid4().hex[:8]}"
            new_stat = {**updates, "device_name": new_device_name}
            result = insert_device_stats(new_stat)
            if "error" in result:
                print(f"Failed to insert device stat for {new_device_name}: {result['error']}")
            else:
                print(f"Successfully inserted device stat for {new_device_name}")

def update_metrics_summary() -> None:
    """Update or insert device metrics summary data."""
    print("Updating device metrics summary...")
    
    metrics = [
        {"metric_name": "avg_cpu_load", "metric_value": round(random.uniform(0.1, 5.0), 2), "device_count": random.randint(5, 50)},
        {"metric_name": "avg_memory_usage", "metric_value": round(random.uniform(20.0, 80.0), 1), "device_count": random.randint(5, 50)},
        {"metric_name": "avg_storage_usage", "metric_value": round(random.uniform(30.0, 75.0), 1), "device_count": random.randint(5, 50)},
        {"metric_name": "avg_network_in", "metric_value": round(random.uniform(10.0, 250.0), 1), "device_count": random.randint(5, 50)},
        {"metric_name": "avg_network_out", "metric_value": round(random.uniform(5.0, 150.0), 1), "device_count": random.randint(5, 50)},
        {"metric_name": "total_active_devices", "metric_value": random.randint(10, 100), "device_count": random.randint(10, 100)},
        {"metric_name": "total_halted_devices", "metric_value": random.randint(0, 10), "device_count": random.randint(0, 10)},
        {"metric_name": "total_limited_devices", "metric_value": random.randint(0, 15), "device_count": random.randint(0, 15)}
    ]
    
    for metric in metrics:
        result = supabase_request("device_metrics_summary", method='POST', data=metric)
        if "error" in result:
            print(f"Failed to insert/update metric {metric['metric_name']}: {result['error']}")
        else:
            print(f"Successfully inserted/updated metric {metric['metric_name']}")

def main():
    parser = argparse.ArgumentParser(description='Update asset and device load statistics in the Supabase database.')
    parser.add_argument('--mode', choices=['assets', 'stats', 'both', 'summary'], default='both', 
                        help='Specify what to update: assets, stats, both, or summary metrics')
    parser.add_argument('--limit', type=int, default=None, help='Limit the number of records to update')
    args = parser.parse_args()
    
    try:
        if args.mode in ['assets', 'both']:
            assets = fetch_assets()
            if args.limit:
                assets = assets[:args.limit]
            if assets:
                generate_random_updates_for_assets(assets)
            else:
                print("No assets found in the database")
        
        if args.mode in ['stats', 'both']:
            stats = fetch_device_stats()
            if args.limit:
                stats = stats[:args.limit]
            if stats:
                generate_random_updates_for_device_stats(stats)
            else:
                print("No device load statistics found in the database")
                # Create some initial stats if none exist
                device_names = ["router-main", "switch-core", "firewall-edge", "access-point-1", "server-primary"]
                for name in device_names:
                    new_stat = {
                        "device_name": name,
                        "load_avg_1m": round(random.uniform(0.01, 3.0), 2),
                        "load_avg_5m": round(random.uniform(0.01, 2.5), 2),
                        "load_avg_15m": round(random.uniform(0.01, 2.0), 2),
                        "memory_used_percent": round(random.uniform(10.0, 80.0), 1),
                        "storage_used_percent": round(random.uniform(20.0, 70.0), 1),
                        "traffic_in_mbps": round(random.uniform(1.0, 200.0), 1),
                        "traffic_out_mbps": round(random.uniform(0.5, 100.0), 1),
                        "collection_status": "active",
                        "timestamp": get_timestamp()
                    }
                    insert_device_stats(new_stat)
        
        if args.mode == 'summary':
            update_metrics_summary()
            
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
