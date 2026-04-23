#!/usr/bin/env python3
"""
Extract cost data from Excel files with proper header handling
"""

import pandas as pd
import json

print("Extracting cost data from Excel files...")

# Extract Fasteners data
try:
    fasteners_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Fasteners_2025.xls', engine='xlrd', header=2)
    fasteners_df = fasteners_df.dropna(subset=['Fastener'])  # Remove rows without fastener name
    
    fasteners_data = []
    for idx, row in fasteners_df.iterrows():
        if pd.notna(row.get('Fastener')):
            fasteners_data.append({
                'id': idx + 1,
                'name': row['Fastener'],
                'unitCost': row.get('Table Price', 0) if pd.notna(row.get('Table Price')) else row.get('Calc Price', 0),
                'unit': 'piece'
            })
    
    print(f"Fasteners: {len(fasteners_data)} items extracted")
except Exception as e:
    print(f"Error reading fasteners: {e}")
    fasteners_data = []

# Extract Tooling data
try:
    tooling_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Tooling_2025.xls', engine='xlrd', header=3)
    tooling_df = tooling_df.dropna(subset=['Tooling'])  # Remove rows without tooling name
    
    tooling_data = []
    for idx, row in tooling_df.iterrows():
        if pd.notna(row.get('Tooling')):
            tooling_data.append({
                'id': idx + 1,
                'name': row['Tooling'],
                'unitCost': row.get('Table Price', 0) if pd.notna(row.get('Table Price')) else 0,
                'unit': 'set',
                'pvf': 3000
            })
    
    print(f"Tooling: {len(tooling_data)} items extracted")
except Exception as e:
    print(f"Error reading tooling: {e}")
    tooling_data = []

# Try to extract Materials data with different header rows
try:
    for header_row in range(5):
        try:
            materials_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Materials_2025.xls', engine='xlrd', header=header_row)
            if 'Material' in materials_df.columns or 'Material Name' in materials_df.columns:
                print(f"Materials: Found header at row {header_row}")
                print(f"Columns: {materials_df.columns.tolist()}")
                materials_df = materials_df.head()
                print(materials_df)
                break
        except:
            continue
except Exception as e:
    print(f"Error reading materials: {e}")

# Try to extract Processes data with different header rows
try:
    for header_row in range(5):
        try:
            processes_df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Processes_2025.xls', engine='xlrd', header=header_row)
            if 'Process' in processes_df.columns or 'Process Name' in processes_df.columns:
                print(f"Processes: Found header at row {header_row}")
                print(f"Columns: {processes_df.columns.tolist()}")
                processes_df = processes_df.head()
                print(processes_df)
                break
        except:
            continue
except Exception as e:
    print(f"Error reading processes: {e}")

# Save extracted data
data = {
    'fasteners': fasteners_data,
    'tooling': tooling_data
}

with open('/Users/brajeshkumar/Desktop/SUPRA REPORt/cost_data_extracted.json', 'w') as f:
    json.dump(data, f, indent=2, default=str)

print("\nExtracted data saved to cost_data_extracted.json")
print(f"Fasteners: {len(fasteners_data)} items")
print(f"Tooling: {len(tooling_data)} items")
