#!/usr/bin/env python3
"""
Extract process data from CostTable_Processes_2025.xls using xlrd directly
"""

import xlrd
import json

print("Reading Process Cost Table with xlrd...")

try:
    wb = xlrd.open_workbook('/Users/brajeshkumar/Desktop/SUPRA REPORt/CostTable_Processes_2025.xls')
    print(f"Number of sheets: {wb.nsheets}")
    print(f"Sheet names: {wb.sheet_names()}")
    
    for sheet_name in wb.sheet_names():
        ws = wb.sheet_by_name(sheet_name)
        print(f"\n=== Sheet: {sheet_name} ===")
        print(f"Rows: {ws.nrows}, Cols: {ws.ncols}")
        
        # Print first 15 rows
        for row_idx in range(min(15, ws.nrows)):
            row = ws.row_values(row_idx)
            print(f"Row {row_idx}: {row}")
            
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
