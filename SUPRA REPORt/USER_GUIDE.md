# SUPRA SAEINDIA Cost Report Workbook - User Guide

## Team: Javitron
## University: Ajeenkya DY Patil University
## Season: 2025-26

### Workbook Structure

The workbook contains the following sheets:

1. **Cover Page** - Team information and report details
2. **Table of Contents** - Navigation guide
3. **Cost Summary** - Overall cost breakdown by commodity
4. **BOM** - Bill of Materials with all parts
5. **Penalty Calculations** - Method A and Method B penalty tracking
6. **Commodity Sheets** (8 sheets):
   - BR - Brakes
   - EN - Engine & Drivetrain
   - FR - Frame & Body
   - EL - Electrical
   - MS - Misc
   - ST - Steering
   - SU - Suspension
   - WT - Wheels

### How to Use

#### 1. Fill in Car Number
- Go to Cover Page sheet
- Enter your car number in cell E9

#### 2. Complete BOM
- Go to BOM sheet
- Fill in all parts with:
  - Part Number (format: XX-YY-001, e.g., FR-FM-001)
  - Part Name
  - Assembly
  - Commodity (BR, EN, FR, EL, MS, ST, SU, WT)
  - Make/Buy (Make or Buy)
  - Quantity
  - Unit Cost (₹)

#### 3. Complete Commodity Sheets
For each commodity sheet:
- Fill in Assembly name
- Add Parts in the Parts section
- Add Materials in the Materials section
- Add Processes in the Processes section
- Add Fasteners in the Fasteners section
- Add Tooling in the Tooling section

#### 4. Part Numbering Format
Follow Appendix C-2: [Commodity Code] - [Assembly Code] - [Part Number]
Example: SU-AR-001 (Suspension - A-Arm - 001)

#### 5. Cost Calculations
All cost calculations are automatic formulas:
- Parts: Sub Total = Part Cost × Quantity
- Materials: Sub Total = Unit Cost × Quantity
- Processes: Sub Total = Unit Cost × Quantity × Multiplier
- Fasteners: Sub Total = Unit Cost × Quantity
- Tooling: Sub Total = Unit Cost × Quantity × PVF × Fraction Included

#### 6. Validation
- Red highlight = Error (missing required field)
- Yellow highlight = Warning (incomplete data)
- Fill all red cells before submission

#### 7. Made Parts
For parts made from raw material:
- Specify raw material type, shape, dimensions
- Provide gross weight, net weight, density
- Include process sequence with multipliers
- Minimum 1 mm machining stock required
- PVF = 3000 by default

#### 8. Bought Parts
For bought parts:
- Use exact cost table entries
- No manual cost overrides allowed
- Match size, grade, length from cost tables

#### 9. Penalty Calculations
- Method A: Direct penalty points
- Method B: Cost penalty = 2 × (Correct Cost - Your Cost)

### Export to PDF
1. Open the workbook in Excel
2. File > Save As > PDF
3. Select all sheets
4. Save as PDF

### Important Notes
- English only
- INR currency (₹)
- 2 decimal places for costs
- Do not modify formula cells (protected)
- Do not reorder sheets
- Follow commodity sequence: BR, EN, FR, EL, MS, ST, SU, WT

### Support
For questions, refer to:
- Appendix_C1_CostMethodology.pdf
- Cost Report Guidelines.pdf
- Cost tables provided
