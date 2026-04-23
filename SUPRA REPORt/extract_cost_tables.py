#!/usr/bin/env python3
"""
Extract cost data from Excel files and convert to JavaScript format
"""

import pandas as pd
import json

# Read the cost table files
print("Reading Excel files...")

try:
    materials_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Materials_2025.xls', engine='xlrd')
    print(f"Materials: {len(materials_df)} rows")
    print("Columns:", materials_df.columns.tolist())
    print(materials_df.head())
except Exception as e:
    print(f"Error reading materials: {e}")
    materials_df = None

try:
    processes_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Processes_2025.xls', engine='xlrd')
    print(f"\nProcesses: {len(processes_df)} rows")
    print("Columns:", processes_df.columns.tolist())
    print(processes_df.head())
except Exception as e:
    print(f"Error reading processes: {e}")
    processes_df = None

try:
    fasteners_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Fasteners_2025.xls', engine='xlrd')
    print(f"\nFasteners: {len(fasteners_df)} rows")
    print("Columns:", fasteners_df.columns.tolist())
    print(fasteners_df.head())
except Exception as e:
    print(f"Error reading fasteners: {e}")
    fasteners_df = None

try:
    tooling_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Tooling_2025.xls', engine='xlrd')
    print(f"\nTooling: {len(tooling_df)} rows")
    print("Columns:", tooling_df.columns.tolist())
    print(tooling_df.head())
except Exception as e:
    print(f"Error reading tooling: {e}")
    tooling_df = None

# Save data to JSON for inspection
data = {
    'materials': materials_df.to_dict('records') if materials_df is not None else [],
    'processes': processes_df.to_dict('records') if processes_df is not None else [],
    'fasteners': fasteners_df.to_dict('records') if fasteners_df is not None else [],
    'tooling': tooling_df.to_dict('records') if tooling_df is not None else []
}

with open('/Users/brajeshkumar/Desktop/SUPRA REPORt/cost_data.json', 'w') as f:
    json.dump(data, f, indent=2, default=str)

print("\nData saved to cost_data.json")
