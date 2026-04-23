#!/usr/bin/env python3
"""
Extract cost data from Excel files with better header detection
"""

import pandas as pd
import json

print("Extracting cost data from Excel files...")

# Try different approaches for Materials
print("\n=== MATERIALS ===")
try:
    # Try reading with different header rows
    for header_row in range(10):
        try:
            df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Materials_2025.xls', engine='xlrd', header=header_row)
            # Check if any column looks like a material name column
            for col in df.columns:
                if 'Material' in str(col) or 'material' in str(col) or 'Name' in str(col):
                    print(f"Found potential header at row {header_row}, column: {col}")
                    print(f"Columns: {df.columns.tolist()}")
                    print(df.head(3))
                    break
            else:
                continue
            break
        except:
            continue
except Exception as e:
    print(f"Error reading materials: {e}")

# Try different approaches for Processes
print("\n=== PROCESSES ===")
try:
    for header_row in range(10):
        try:
            df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Processes_2025.xls', engine='xlrd', header=header_row)
            for col in df.columns:
                if 'Process' in str(col) or 'process' in str(col) or 'Name' in str(col):
                    print(f"Found potential header at row {header_row}, column: {col}")
                    print(f"Columns: {df.columns.tolist()}")
                    print(df.head(3))
                    break
            else:
                continue
            break
        except:
            continue
except Exception as e:
    print(f"Error reading processes: {e}")

# Try different approaches for Tooling
print("\n=== TOOLING ===")
try:
    for header_row in range(10):
        try:
            df = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Tooling_2025.xls', engine='xlrd', header=header_row)
            for col in df.columns:
                if 'Tooling' in str(col) or 'tooling' in str(col) or 'Tool' in str(col):
                    print(f"Found potential header at row {header_row}, column: {col}")
                    print(f"Columns: {df.columns.tolist()}")
                    print(df.head(3))
                    break
            else:
                continue
            break
        except:
            continue
except Exception as e:
    print(f"Error reading tooling: {e}")

# Try reading without header to see raw data
print("\n=== RAW DATA INSPECTION ===")
try:
    df_raw = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Materials_2025.xls', engine='xlrd', header=None)
    print("Materials raw data (first 10 rows):")
    print(df_raw.head(10))
except Exception as e:
    print(f"Error reading materials raw: {e}")

try:
    df_raw = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Processes_2025.xls', engine='xlrd', header=None)
    print("\nProcesses raw data (first 10 rows):")
    print(df_raw.head(10))
except Exception as e:
    print(f"Error reading processes raw: {e}")

try:
    df_raw = pd.read_excel('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Tooling_2025.xls', engine='xlrd', header=None)
    print("\nTooling raw data (first 10 rows):")
    print(df_raw.head(10))
except Exception as e:
    print(f"Error reading tooling raw: {e}")
