import React from 'react'
import { exportCostSummary } from '../utils/exportToExcel'

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

function CostSummary({ commodityData, teamInfo }) {
  const calculateCommodityTotal = (code) => {
    const data = commodityData[code]
    if (!data) return 0
    
    let total = 0
    
    // Sum parts
    data.parts?.forEach(part => {
      total += (part.cost || 0) * (part.quantity || 0)
    })
    
    // Sum materials
    data.materials?.forEach(material => {
      total += (material.unitCost || 0) * (material.quantity || 0)
    })
    
    // Sum processes
    data.processes?.forEach(process => {
      total += (process.unitCost || 0) * (process.quantity || 0) * (process.multiplier || 1)
    })
    
    // Sum fasteners
    data.fasteners?.forEach(fastener => {
      total += (fastener.unitCost || 0) * (fastener.quantity || 0)
    })
    
    // Sum tooling
    data.tooling?.forEach(tool => {
      total += (tool.unitCost || 0) * (tool.quantity || 0) * (tool.pvf || 3000) * (tool.fraction || 1)
    })
    
    return total
  }

  const grandTotal = Object.keys(COMMODITIES).reduce((sum, code) => {
    return sum + calculateCommodityTotal(code)
  }, 0)

  return (
    <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Cost Summary</h1>
        <button
          onClick={() => exportCostSummary(commodityData, teamInfo)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          Export to Excel
        </button>
      </div>

      <div className="mb-4 p-4 glass-dark rounded-lg">
        <p className="text-white"><strong>Team:</strong> {teamInfo.teamName}</p>
        <p className="text-white"><strong>University:</strong> {teamInfo.university}</p>
        <p className="text-white"><strong>Season:</strong> {teamInfo.seasonYear}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/20 text-white">
              <th className="px-4 py-3 text-left text-sm sm:text-base">Commodity</th>
              <th className="px-4 py-3 text-center text-sm sm:text-base">Code</th>
              <th className="px-4 py-3 text-right text-sm sm:text-base">Total Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(COMMODITIES).map(([code, name]) => (
              <tr key={code} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                <td className="px-4 py-3 text-white text-sm sm:text-base">{name}</td>
                <td className="px-4 py-3 text-center font-mono text-white text-sm sm:text-base">{code}</td>
                <td className="px-4 py-3 text-right font-semibold text-white text-sm sm:text-base">
                  ₹{calculateCommodityTotal(code).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-white/20 font-bold">
              <td className="px-4 py-3 text-white text-sm sm:text-base" colSpan="2">GRAND TOTAL</td>
              <td className="px-4 py-3 text-right text-lg sm:text-xl text-white">
                ₹{grandTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 glass-dark rounded-lg border-l-4 border-yellow-400">
        <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Note</h3>
        <p className="text-white/90 text-sm sm:text-base">
          Costs are calculated from commodity sheets. Fill in the commodity pages to see accurate totals.
        </p>
      </div>
    </div>
  )
}

export default CostSummary
