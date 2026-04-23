import React, { useState } from 'react'
import { STANDARD_PARTS } from '../data/costTables'
import { exportBOM } from '../utils/exportToExcel'

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

function BOM({ bomData, setBomData, commodityData, teamInfo }) {
  const [newPart, setNewPart] = useState({
    partNumber: '',
    partName: '',
    assembly: '',
    commodity: '',
    makeBuy: 'Make',
    quantity: 1,
    unitCost: 0
  })

  const generatePartNumber = (commodity, assembly, index) => {
    const assemblyCode = assembly.substring(0, 2).toUpperCase()
    const num = String(index + 1).padStart(3, '0')
    return `${commodity}-${assemblyCode}-${num}`
  }

  const handlePartSelect = (partName) => {
    const commodity = newPart.commodity
    if (!commodity) {
      alert('Please select a commodity first')
      return
    }
    
    const standardParts = STANDARD_PARTS[commodity] || []
    const part = standardParts.find(p => p.name === partName)
    if (part) {
      setNewPart({
        ...newPart,
        partName: part.name,
        unitCost: part.defaultCost
      })
    }
  }

  const handleCommodityChange = (commodity) => {
    setNewPart({
      ...newPart,
      commodity,
      partName: '',
      unitCost: 0
    })
  }

  const handleAddPart = () => {
    if (!newPart.partName || !newPart.assembly || !newPart.commodity) {
      alert('Please fill in Part Name, Assembly, and Commodity')
      return
    }

    const partNumber = newPart.partNumber || generatePartNumber(
      newPart.commodity,
      newPart.assembly,
      bomData.length
    )

    const part = {
      ...newPart,
      partNumber,
      extendedCost: newPart.unitCost * newPart.quantity
    }

    setBomData([...bomData, part])
    setNewPart({
      partNumber: '',
      partName: '',
      assembly: '',
      commodity: '',
      makeBuy: 'Make',
      quantity: 1,
      unitCost: 0
    })
  }

  const handleDeletePart = (index) => {
    setBomData(bomData.filter((_, i) => i !== index))
  }

  const grandTotal = bomData.reduce((sum, part) => sum + part.extendedCost, 0)

  return (
    <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Bill of Materials (BOM)</h1>
        <button
          onClick={() => exportBOM(bomData, teamInfo)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          Export to Excel
        </button>
      </div>

      {/* Add New Part Form */}
      <div className="glass-dark p-4 sm:p-6 rounded-lg mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Add New Part</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Part Name *</label>
            <select
              value={newPart.partName}
              onChange={(e) => handlePartSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-lg"
            >
              <option value="">Select Part</option>
              {newPart.commodity && (STANDARD_PARTS[newPart.commodity] || []).map((part, idx) => (
                <option key={idx} value={part.name}>{part.name}</option>
              ))}
              <option value="custom">-- Custom Part --</option>
            </select>
            {newPart.partName === 'custom' && (
              <input
                type="text"
                value={newPart.customPartName || ''}
                onChange={(e) => setNewPart({ ...newPart, customPartName: e.target.value })}
                placeholder="Enter custom part name"
                className="w-full px-3 py-2 rounded-lg mt-1"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Assembly *</label>
            <input
              type="text"
              value={newPart.assembly}
              onChange={(e) => setNewPart({ ...newPart, assembly: e.target.value })}
              className="w-full px-3 py-2 rounded-lg"
              placeholder="e.g., Main Frame"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Commodity *</label>
            <select
              value={newPart.commodity}
              onChange={(e) => handleCommodityChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg"
            >
              <option value="">Select commodity</option>
              {Object.entries(COMMODITIES).map(([code, name]) => (
                <option key={code} value={code}>{code} - {name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Part Number</label>
            <input
              type="text"
              value={newPart.partNumber}
              onChange={(e) => setNewPart({ ...newPart, partNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg"
              placeholder="Auto-generated if empty"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Make/Buy</label>
            <select
              value={newPart.makeBuy}
              onChange={(e) => setNewPart({ ...newPart, makeBuy: e.target.value })}
              className="w-full px-3 py-2 rounded-lg"
            >
              <option value="Make">Make</option>
              <option value="Buy">Buy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Quantity</label>
            <input
              type="number"
              value={newPart.quantity}
              onChange={(e) => setNewPart({ ...newPart, quantity: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Unit Cost (₹)</label>
            <input
              type="number"
              value={newPart.unitCost}
              onChange={(e) => setNewPart({ ...newPart, unitCost: parseFloat(e.target.value) || 0 })}
              className={`w-full px-3 py-2 rounded-lg ${newPart.partName && newPart.partName !== 'custom' ? 'bg-white/70' : ''}`}
              min="0"
              step="0.01"
              readOnly={newPart.partName && newPart.partName !== 'custom'}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddPart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Add Part
            </button>
          </div>
        </div>
      </div>

      {/* BOM Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/20 text-white">
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Part Number</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Part Name</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm hidden sm:table-cell">Assembly</th>
              <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Commodity</th>
              <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm hidden sm:table-cell">Make/Buy</th>
              <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Quantity</th>
              <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm hidden sm:table-cell">Unit Cost (₹)</th>
              <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">Extended Cost (₹)</th>
              <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bomData.map((part, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                <td className="px-2 sm:px-4 py-3 font-mono text-xs sm:text-sm text-white">{part.partNumber}</td>
                <td className="px-2 sm:px-4 py-3 text-white text-xs sm:text-sm">{part.partName}</td>
                <td className="px-2 sm:px-4 py-3 text-white text-xs sm:text-sm hidden sm:table-cell">{part.assembly}</td>
                <td className="px-2 sm:px-4 py-3 text-center font-mono text-white text-xs sm:text-sm">{part.commodity}</td>
                <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">
                  <span className={`px-2 py-1 rounded text-xs ${
                    part.makeBuy === 'Make' ? 'bg-green-600/30 text-green-200' : 'bg-blue-600/30 text-blue-200'
                  }`}>
                    {part.makeBuy}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-white text-xs sm:text-sm">{part.quantity}</td>
                <td className="px-2 sm:px-4 py-3 text-right text-white text-xs sm:text-sm hidden sm:table-cell">₹{part.unitCost.toFixed(2)}</td>
                <td className="px-2 sm:px-4 py-3 text-right font-semibold text-white text-xs sm:text-sm">₹{part.extendedCost.toFixed(2)}</td>
                <td className="px-2 sm:px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeletePart(index)}
                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {bomData.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-white/70 text-sm">
                  No parts added yet. Use the form above to add parts.
                </td>
              </tr>
            )}
            <tr className="bg-white/20 font-bold">
              <td colSpan="7" className="px-2 sm:px-4 py-3 text-right text-white text-xs sm:text-sm">GRAND TOTAL</td>
              <td className="px-2 sm:px-4 py-3 text-right text-lg sm:text-xl text-white">₹{grandTotal.toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 glass-dark rounded-lg border-l-4 border-blue-400">
        <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Part Numbering Format</h3>
        <p className="text-white/90 text-xs sm:text-sm">
          Format: [Commodity Code] - [Assembly Code] - [Part Number]<br />
          Example: FR-FM-001 (Frame - Main Frame - 001)
        </p>
      </div>
    </div>
  )
}

export default BOM
