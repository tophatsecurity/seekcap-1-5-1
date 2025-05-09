
# Network Monitoring Utilities

This directory contains utility scripts for managing and updating the network monitoring system.

## Update Stats Script

The `update_stats.py` script allows you to update asset and device load statistics in the Supabase database.

### Requirements

- Python 3.6+
- `requests` library (install with `pip install requests`)

### Usage

```
python update_stats.py [--mode MODE] [--limit LIMIT] [--debug]
```

### Options

- `--mode`: Specify what to update: assets, stats, both, or summary metrics
  - `assets`: Update only asset data
  - `stats`: Update only device load statistics
  - `both`: Update both assets and stats (default)
  - `summary`: Update the metrics summary table

- `--limit`: Limit the number of records to update

- `--debug`: Enable detailed debug output

### Examples

```bash
# Update both assets and stats (default behavior)
python update_stats.py

# Update only asset information
python update_stats.py --mode assets

# Update only device load statistics
python update_stats.py --mode stats

# Update metrics summary table
python update_stats.py --mode summary

# Update only 10 assets
python update_stats.py --mode assets --limit 10

# Enable detailed debug output
python update_stats.py --debug
```

### Security Note

This script contains an API key for your Supabase project. In production environments, consider:

1. Moving the API key to an environment variable
2. Using a more restricted API key with only the necessary permissions
3. Implementing additional authentication if needed

## Schedule Updates

You can schedule this script to run periodically using cron (Linux/Mac) or Task Scheduler (Windows).

### Example cron entry (Linux/Mac)

```
# Run every 15 minutes
*/15 * * * * cd /path/to/script && python update_stats.py
```

### Windows Task Scheduler

Create a new task that runs:
```
python C:\path\to\script\update_stats.py
```
