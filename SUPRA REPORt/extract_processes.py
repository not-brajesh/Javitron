#!/usr/bin/env python3
"""
Extract process data from CostTable_Processes_2025.xls
"""

import pandas as pd
import json

print("Reading Process Cost Table...")

try:
    # Try different header rows
    for header_row in range(10):
        try:
            df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Processes_2025.xls', engine='xlrd', header=header_row)
            # Check if any column looks like a process name column
            for col in df.columns:
                if 'Process' in str(col) or 'process' in str(col) or 'Name' in str(col) or 'Description' in str(col):
                    print(f"Found potential header at row {header_row}, column: {col}")
                    print(f"Columns: {df.columns.tolist()}")
                    print(df.head(10))
                    break
            else:
                continue
            break
        except:
            continue
except Exception as e:
    print(f"Error reading processes: {e}")

# Try reading without header to see raw data
print("\n=== RAW DATA INSPECTION ===")
try:
    df_raw = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Processes_2025.xls', engine='xlrd', header=None)
    print("Processes raw data (first 15 rows):")
    print(df_raw.head(15))
except Exception as e:
    print(f"Error reading processes raw: {e}")
