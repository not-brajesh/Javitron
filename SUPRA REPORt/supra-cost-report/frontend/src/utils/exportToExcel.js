import * as XLSX from 'xlsx'

// Export Commodity Sheet to Excel
export const exportCommoditySheet = (commodityCode, commodityName, data) => {
  const wb = XLSX.utils.book_new()
  
  // Assembly Info
  const assemblyData = [
    ['Assembly Information'],
    ['Assembly Name', data.assembly || ''],
    ['Assembly Cost', data.assemblyCost || 0],
    ['Quantity', 1],
    ['Extended Cost', data.assemblyCost || 0],
    [],
    ['Parts'],
    ['Item', 'Part', 'Part Cost (₹)', 'Quantity', 'Sub Total (₹)']
  ]
  
  // Parts
  data.parts?.forEach((part, idx) => {
    assemblyData.push([
      idx + 1,
      part.name || '',
      part.cost || 0,
      part.quantity || 0,
      (part.cost || 0) * (part.quantity || 0)
    ])
  })
  
  // Materials
  assemblyData.push([], ['Materials'])
  assemblyData.push(['Item', 'Material', 'Use', 'Unit Cost (₹)', 'Unit', 'Area', 'Length', 'Density', 'Qty', 'Sub Total (₹)'])
  data.materials?.forEach((material, idx) => {
    const weight = calculateMaterialWeight(material)
    const cost = calculateMaterialCost(material)
    assemblyData.push([
      idx + 1,
      material.material || '',
      material.use || '',
      material.unitCost || 0,
      material.unit || '',
      material.area || 0,
      material.length || 0,
      material.density || 0,
      material.quantity || 0,
      cost
    ])
  })
  
  // Processes
  assemblyData.push([], ['Processes'])
  assemblyData.push(['Item', 'Process', 'Use', 'Unit Cost (₹)', 'Unit', 'Quantity', 'Multiplier', 'Sub Total (₹)'])
  data.processes?.forEach((process, idx) => {
    assemblyData.push([
      idx + 1,
      process.process || '',
      process.use || '',
      process.unitCost || 0,
      process.unit || '',
      process.quantity || 0,
      process.multiplier || 1,
      (process.unitCost || 0) * (process.quantity || 0) * (process.multiplier || 1)
    ])
  })
  
  // Fasteners
  assemblyData.push([], ['Fasteners'])
  assemblyData.push(['Item', 'Fastener', 'Use', 'Unit Cost (₹)', 'Unit', 'Quantity', 'Sub Total (₹)'])
  data.fasteners?.forEach((fastener, idx) => {
    assemblyData.push([
      idx + 1,
      fastener.fastener || '',
      fastener.use || '',
      fastener.unitCost || 0,
      fastener.unit || '',
      fastener.quantity || 0,
      (fastener.unitCost || 0) * (fastener.quantity || 0)
    ])
  })
  
  // Tooling
  assemblyData.push([], ['Tooling'])
  assemblyData.push(['Item', 'Tooling', 'Use', 'Unit Cost (₹)', 'Unit', 'Quantity', 'PVF', 'Fraction', 'Sub Total (₹)'])
  data.tooling?.forEach((tool, idx) => {
    assemblyData.push([
      idx + 1,
      tool.tooling || '',
      tool.use || '',
      tool.unitCost || 0,
      tool.unit || '',
      tool.quantity || 0,
      tool.pvf || 3000,
      tool.fraction || 1,
      (tool.unitCost || 0) * (tool.quantity || 0) * (tool.pvf || 3000) * (tool.fraction || 1)
    ])
  })
  
  const ws = XLSX.utils.aoa_to_sheet(assemblyData)
  XLSX.utils.book_append_sheet(wb, ws, commodityName)
  
  XLSX.writeFile(wb, `${commodityCode}_${commodityName.replace(/\s+/g, '_')}_Cost_Report.xlsx`)
}

// Export BOM to Excel
export const exportBOM = (bomData, teamInfo) => {
  const wb = XLSX.utils.book_new()
  
  const bomSheetData = [
    ['Bill of Materials'],
    ['Team', teamInfo.teamName],
    ['University', teamInfo.university],
    [],
    ['Part Number', 'Part Name', 'Assembly', 'Commodity', 'Make/Buy', 'Quantity', 'Unit Cost (₹)', 'Extended Cost (₹)']
  ]
  
  bomData.forEach(part => {
    bomSheetData.push([
      part.partNumber,
      part.partName,
      part.assembly,
      part.commodity,
      part.makeBuy,
      part.quantity,
      part.unitCost,
      part.extendedCost
    ])
  })
  
  // Grand total
  const grandTotal = bomData.reduce((sum, part) => sum + part.extendedCost, 0)
  bomSheetData.push([], ['GRAND TOTAL', '', '', '', '', '', '', grandTotal])
  
  const ws = XLSX.utils.aoa_to_sheet(bomSheetData)
  XLSX.utils.book_append_sheet(wb, ws, 'BOM')
  
  XLSX.writeFile(wb, 'BOM_Export.xlsx')
}

// Export Cost Summary to Excel
export const exportCostSummary = (commodityData, teamInfo) => {
  const wb = XLSX.utils.book_new()
  
  const summaryData = [
    ['Cost Summary'],
    ['Team', teamInfo.teamName],
    ['University', teamInfo.university],
    ['Season', teamInfo.seasonYear],
    [],
    ['Commodity', 'Code', 'Total Cost (₹)']
  ]
  
  const COMMODITIES = {
    'BR': 'Brakes',
    'EN': 'Engine & Drivetrain',
    'FR': 'Frame & Body',
    'EL': 'Electrical',
    'MS': 'Misc',
    'ST': 'Steering',
    'SU': 'Suspension',
    'WT': 'Wheels'
  }
  
  let grandTotal = 0
  Object.entries(COMMODITIES).forEach(([code, name]) => {
    const total = calculateCommodityTotal(commodityData[code])
    grandTotal += total
    summaryData.push([name, code, total])
  })
  
  summaryData.push([], ['GRAND TOTAL', '', grandTotal])
  
  const ws = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, ws, 'Cost Summary')
  
  XLSX.writeFile(wb, 'Cost_Summary_Export.xlsx')
}

// Helper functions
const calculateMaterialWeight = (material) => {
  if (!material) return 0
  const area = material.area || 0
  const length = material.length || 0
  const density = material.density || 0
  
  if (area > 0 && density > 0) {
    return area * density
  } else if (length > 0 && density > 0) {
    return length * density
  }
  return 0
}

const calculateMaterialCost = (material) => {
  if (!material) return 0
  const weight = calculateMaterialWeight(material)
  const unitCost = material.unitCost || 0
  const quantity = material.quantity || 0
  
  return weight * unitCost * quantity
}

const calculateCommodityTotal = (data) => {
  if (!data) return 0
  
  let total = 0
  
  data.parts?.forEach(part => {
    total += (part.cost || 0) * (part.quantity || 0)
  })
  
  data.materials?.forEach(material => {
    total += calculateMaterialCost(material)
  })
  
  data.processes?.forEach(process => {
    total += (process.unitCost || 0) * (process.quantity || 0) * (process.multiplier || 1)
  })
  
  data.fasteners?.forEach(fastener => {
    total += (fastener.unitCost || 0) * (fastener.quantity || 0)
  })
  
  data.tooling?.forEach(tool => {
    total += (tool.unitCost || 0) * (tool.quantity || 0) * (tool.pvf || 3000) * (tool.fraction || 1)
  })
  
  return total
}
