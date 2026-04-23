import React, { useState } from 'react'
import { MATERIALS, PROCESSES, FASTENERS, TOOLING, STANDARD_PARTS } from '../data/costTables'
import { exportCommoditySheet } from '../utils/exportToExcel'

function CommoditySheet({ commodityCode, commodityName, data, setData }) {
  const [assemblyName, setAssemblyName] = useState(data.assembly || '')

  const updateData = (section, index, field, value) => {
    const newData = { ...data }
    newData[section][index][field] = value
    setData(newData)
  }

  const handleMaterialSelect = (index, materialName) => {
    const material = MATERIALS.find(m => m.name === materialName)
    if (material) {
      const newData = { ...data }
      newData.materials[index] = {
        ...newData.materials[index],
        material: material.name,
        unitCost: material.unitCost,
        unit: material.unit,
        density: material.density
      }
      setData(newData)
    }
  }

  const handleProcessSelect = (index, processName) => {
    const process = PROCESSES.find(p => p.name === processName)
    if (process) {
      const newData = { ...data }
      newData.processes[index] = {
        ...newData.processes[index],
        process: process.name,
        unitCost: process.unitCost,
        unit: process.unit,
        multiplier: process.multiplier,
        multVal: process.multiplier
      }
      setData(newData)
    }
  }

  const handleFastenerSelect = (index, fastenerName) => {
    const fastener = FASTENERS.find(f => f.name === fastenerName)
    if (fastener) {
      const newData = { ...data }
      newData.fasteners[index] = {
        ...newData.fasteners[index],
        fastener: fastener.name,
        unitCost: fastener.unitCost,
        unit: fastener.unit
      }
      setData(newData)
    }
  }

  const handleToolingSelect = (index, toolingName) => {
    const tooling = TOOLING.find(t => t.name === toolingName)
    if (tooling) {
      const newData = { ...data }
      newData.tooling[index] = {
        ...newData.tooling[index],
        tooling: tooling.name,
        unitCost: tooling.unitCost,
        unit: tooling.unit,
        pvf: tooling.pvf
      }
      setData(newData)
    }
  }

  const handlePartSelect = (index, partName) => {
    const standardParts = STANDARD_PARTS[commodityCode] || []
    const part = standardParts.find(p => p.name === partName)
    if (part) {
      const newData = { ...data }
      newData.parts[index] = {
        ...newData.parts[index],
        name: part.name,
        cost: part.defaultCost
      }
      setData(newData)
    }
  }

  const calculateMaterialWeight = (item) => {
    // Calculate weight from area or length and density
    if (item.area && item.density) {
      return item.area * item.density
    }
    if (item.length && item.density) {
      return item.length * item.density
    }
    return 0
  }

  const calculateMaterialCost = (item) => {
    // Auto-calculate material cost based on weight and unit cost
    const weight = calculateMaterialWeight(item)
    if (weight > 0 && item.unitCost) {
      return weight * item.unitCost
    }
    return item.unitCost * item.quantity
  }

  const addItem = (section) => {
    const newData = { ...data }
    const newItem = section === 'parts' ? { name: '', cost: 0, quantity: 1 } :
                    section === 'materials' ? { material: '', use: '', unitCost: 0, unit: '', size1: '', unit1: '', size2: '', unit2: '', area: 0, length: 0, density: 0, quantity: 1 } :
                    section === 'processes' ? { process: '', use: '', unitCost: 0, unit: '', quantity: 1, multiplier: 1, multVal: 1 } :
                    section === 'fasteners' ? { fastener: '', use: '', unitCost: 0, size1: '', unit1: '', size2: '', unit2: '', quantity: 1 } :
                    { tooling: '', use: '', unitCost: 0, unit: '', quantity: 1, pvf: 3000, fraction: 1 }
    newData[section] = [...newData[section], newItem]
    setData(newData)
  }

  const deleteItem = (section, index) => {
    const newData = { ...data }
    newData[section] = newData[section].filter((_, i) => i !== index)
    setData(newData)
  }

  const calculateSubtotal = (section, item) => {
    if (section === 'parts') return item.cost * item.quantity
    if (section === 'materials') return calculateMaterialCost(item)
    if (section === 'processes') return item.unitCost * item.quantity * item.multiplier
    if (section === 'fasteners') return item.unitCost * item.quantity
    if (section === 'tooling') return item.unitCost * item.quantity * item.pvf * item.fraction
    return 0
  }

  const calculateAssemblyTotal = () => {
    let total = 0
    data.parts?.forEach(item => total += calculateSubtotal('parts', item))
    data.materials?.forEach(item => total += calculateSubtotal('materials', item))
    data.processes?.forEach(item => total += calculateSubtotal('processes', item))
    data.fasteners?.forEach(item => total += calculateSubtotal('fasteners', item))
    data.tooling?.forEach(item => total += calculateSubtotal('tooling', item))
    return total
  }

  return (
    <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{commodityName} ({commodityCode})</h1>
        <button
          onClick={() => exportCommoditySheet(commodityCode, commodityName, data)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          Export to Excel
        </button>
      </div>

      {/* Header Section */}
      <div className="glass-dark p-4 sm:p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">University</label>
            <input type="text" value="Ajeenkya DY Patil University" readOnly className="w-full px-3 py-2 rounded-lg bg-white/70" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Team Name</label>
            <input type="text" value="Javitron" readOnly className="w-full px-3 py-2 rounded-lg bg-white/70" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">System</label>
            <input type="text" value={commodityName} readOnly className="w-full px-3 py-2 rounded-lg bg-white/70" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Assembly</label>
            <input
              type="text"
              value={assemblyName}
              onChange={(e) => setAssemblyName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg"
              placeholder="Enter assembly name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">P/N Base</label>
            <input type="text" value={`${commodityCode}-XX-001`} readOnly className="w-full px-3 py-2 rounded-lg bg-white/70" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Suffix</label>
            <input type="text" placeholder="Enter suffix" className="w-full px-3 py-2 rounded-lg" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 text-white">Details</label>
          <textarea className="w-full px-3 py-2 rounded-lg" rows="2" placeholder="Enter assembly details"></textarea>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Car #</label>
            <input type="text" placeholder="Car number" className="w-full px-3 py-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Asm Cost (₹)</label>
            <input type="text" value={`₹${calculateAssemblyTotal().toFixed(2)}`} readOnly className="w-full px-3 py-2 rounded-lg bg-white/70 font-semibold" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Qty</label>
            <input type="number" value="1" readOnly className="w-full px-3 py-2 rounded-lg bg-white/70" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Extended Cost (₹)</label>
            <input type="text" value={`₹${calculateAssemblyTotal().toFixed(2)}`} readOnly className="w-full px-3 py-2 rounded-lg bg-white/70 font-semibold" />
          </div>
        </div>
      </div>

      {/* Parts Section */}
      <SectionTable
        title="Parts"
        data={data.parts || []}
        headers={['Item', 'Part', 'Part Cost (₹)', 'Quantity', 'Sub Total (₹)']}
        renderItem={(item, index) => (
          <>
            <td className="px-2 sm:px-4 py-2 text-center text-white">{index + 1}</td>
            <td className="px-2 sm:px-4 py-2">
              <select
                value={item.name}
                onChange={(e) => handlePartSelect(index, e.target.value)}
                className="w-full px-2 py-1 rounded-lg"
              >
                <option value="">Select Part</option>
                {(STANDARD_PARTS[commodityCode] || []).map((part, idx) => (
                  <option key={idx} value={part.name}>{part.name}</option>
                ))}
                <option value="custom">-- Custom Part --</option>
              </select>
              {item.name === 'custom' && (
                <input
                  type="text"
                  value={item.customName || ''}
                  onChange={(e) => updateData('parts', index, 'customName', e.target.value)}
                  placeholder="Enter custom part name"
                  className="w-full px-2 py-1 rounded-lg mt-1"
                />
              )}
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input
                type="number"
                value={item.cost}
                onChange={(e) => updateData('parts', index, 'cost', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 rounded-lg"
                min="0"
                step="0.01"
              />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateData('parts', index, 'quantity', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 rounded-lg"
                min="1"
              />
            </td>
            <td className="px-2 sm:px-4 py-2 text-right font-semibold text-white">₹{calculateSubtotal('parts', item).toFixed(2)}</td>
          </>
        )}
        onAdd={() => addItem('parts')}
        onDelete={(index) => deleteItem('parts', index)}
      />

      {/* Materials Section */}
      <SectionTable
        title="Materials"
        data={data.materials || []}
        headers={['Item', 'Material', 'Use', 'Unit Cost (₹)', 'Unit', 'Area', 'Length', 'Density', 'Qty', 'Sub Total (₹)']}
        renderItem={(item, index) => (
          <>
            <td className="px-2 sm:px-4 py-2 text-center text-white">{index + 1}</td>
            <td className="px-2 sm:px-4 py-2">
              <select
                value={item.material}
                onChange={(e) => handleMaterialSelect(index, e.target.value)}
                className="w-full px-2 py-1 rounded-lg"
              >
                <option value="">Select Material</option>
                {MATERIALS.map((material) => (
                  <option key={material.id} value={material.name}>{material.name}</option>
                ))}
              </select>
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.use} onChange={(e) => updateData('materials', index, 'use', e.target.value)} className="w-full px-2 py-1 rounded-lg" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.unitCost} onChange={(e) => updateData('materials', index, 'unitCost', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg bg-white/70" min="0" step="0.01" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.unit} onChange={(e) => updateData('materials', index, 'unit', e.target.value)} className="w-10 sm:w-12 px-2 py-1 rounded-lg bg-white/70" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.area} onChange={(e) => updateData('materials', index, 'area', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg" placeholder="Enter area" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.length} onChange={(e) => updateData('materials', index, 'length', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg" placeholder="Enter length" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.density} onChange={(e) => updateData('materials', index, 'density', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg bg-white/70" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.quantity} onChange={(e) => updateData('materials', index, 'quantity', parseInt(e.target.value) || 0)} className="w-14 sm:w-16 px-2 py-1 rounded-lg" min="1" />
            </td>
            <td className="px-2 sm:px-4 py-2 text-right font-semibold text-white">₹{calculateSubtotal('materials', item).toFixed(2)}</td>
          </>
        )}
        onAdd={() => addItem('materials')}
        onDelete={(index) => deleteItem('materials', index)}
        compact
      />

      {/* Processes Section */}
      <SectionTable
        title="Processes"
        data={data.processes || []}
        headers={['Item', 'Process', 'Use', 'Unit Cost (₹)', 'Unit', 'Quantity', 'Multiplier', 'Sub Total (₹)']}
        renderItem={(item, index) => (
          <>
            <td className="px-2 sm:px-4 py-2 text-center text-white">{index + 1}</td>
            <td className="px-2 sm:px-4 py-2">
              <select
                value={item.process}
                onChange={(e) => handleProcessSelect(index, e.target.value)}
                className="w-full px-2 py-1 rounded-lg"
              >
                <option value="">Select Process</option>
                {PROCESSES.map((process) => (
                  <option key={process.id} value={process.name}>{process.name}</option>
                ))}
              </select>
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.use} onChange={(e) => updateData('processes', index, 'use', e.target.value)} className="w-full px-2 py-1 rounded-lg" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.unitCost} onChange={(e) => updateData('processes', index, 'unitCost', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg bg-white/70" min="0" step="0.01" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.unit} onChange={(e) => updateData('processes', index, 'unit', e.target.value)} className="w-10 sm:w-12 px-2 py-1 rounded-lg bg-white/70" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.quantity} onChange={(e) => updateData('processes', index, 'quantity', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg" min="0" step="0.1" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.multiplier} onChange={(e) => updateData('processes', index, 'multiplier', parseFloat(e.target.value) || 1)} className="w-14 sm:w-16 px-2 py-1 rounded-lg bg-white/70" min="0" step="0.1" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2 text-right font-semibold text-white">₹{calculateSubtotal('processes', item).toFixed(2)}</td>
          </>
        )}
        onAdd={() => addItem('processes')}
        onDelete={(index) => deleteItem('processes', index)}
      />

      {/* Fasteners Section */}
      <SectionTable
        title="Fasteners"
        data={data.fasteners || []}
        headers={['Item', 'Fastener', 'Use', 'Unit Cost (₹)', 'Unit', 'Quantity', 'Sub Total (₹)']}
        renderItem={(item, index) => (
          <>
            <td className="px-2 sm:px-4 py-2 text-center text-white">{index + 1}</td>
            <td className="px-2 sm:px-4 py-2">
              <select
                value={item.fastener}
                onChange={(e) => handleFastenerSelect(index, e.target.value)}
                className="w-full px-2 py-1 rounded-lg"
              >
                <option value="">Select Fastener</option>
                {FASTENERS.map((fastener) => (
                  <option key={fastener.id} value={fastener.name}>{fastener.name}</option>
                ))}
              </select>
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.use} onChange={(e) => updateData('fasteners', index, 'use', e.target.value)} className="w-full px-2 py-1 rounded-lg" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.unitCost} onChange={(e) => updateData('fasteners', index, 'unitCost', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg bg-white/70" min="0" step="0.01" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.unit} onChange={(e) => updateData('fasteners', index, 'unit', e.target.value)} className="w-10 sm:w-12 px-2 py-1 rounded-lg bg-white/70" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.quantity} onChange={(e) => updateData('fasteners', index, 'quantity', parseInt(e.target.value) || 0)} className="w-14 sm:w-16 px-2 py-1 rounded-lg" min="1" />
            </td>
            <td className="px-2 sm:px-4 py-2 text-right font-semibold text-white">₹{calculateSubtotal('fasteners', item).toFixed(2)}</td>
          </>
        )}
        onAdd={() => addItem('fasteners')}
        onDelete={(index) => deleteItem('fasteners', index)}
      />

      {/* Tooling Section */}
      <SectionTable
        title="Tooling"
        data={data.tooling || []}
        headers={['Item', 'Tooling', 'Use', 'Unit Cost (₹)', 'Unit', 'Quantity', 'PVF', 'Fraction', 'Sub Total (₹)']}
        renderItem={(item, index) => (
          <>
            <td className="px-2 sm:px-4 py-2 text-center text-white">{index + 1}</td>
            <td className="px-2 sm:px-4 py-2">
              <select
                value={item.tooling}
                onChange={(e) => handleToolingSelect(index, e.target.value)}
                className="w-full px-2 py-1 rounded-lg"
              >
                <option value="">Select Tooling</option>
                {TOOLING.map((tool) => (
                  <option key={tool.id} value={tool.name}>{tool.name}</option>
                ))}
              </select>
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.use} onChange={(e) => updateData('tooling', index, 'use', e.target.value)} className="w-full px-2 py-1 rounded-lg" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.unitCost} onChange={(e) => updateData('tooling', index, 'unitCost', parseFloat(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 rounded-lg bg-white/70" min="0" step="0.01" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="text" value={item.unit} onChange={(e) => updateData('tooling', index, 'unit', e.target.value)} className="w-10 sm:w-12 px-2 py-1 rounded-lg bg-white/70" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.quantity} onChange={(e) => updateData('tooling', index, 'quantity', parseInt(e.target.value) || 0)} className="w-14 sm:w-16 px-2 py-1 rounded-lg" min="1" />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.pvf} onChange={(e) => updateData('tooling', index, 'pvf', parseFloat(e.target.value) || 3000)} className="w-14 sm:w-16 px-2 py-1 rounded-lg bg-white/70" min="0" readOnly />
            </td>
            <td className="px-2 sm:px-4 py-2">
              <input type="number" value={item.fraction} onChange={(e) => updateData('tooling', index, 'fraction', parseFloat(e.target.value) || 1)} className="w-14 sm:w-16 px-2 py-1 rounded-lg" min="0" max="1" step="0.1" />
            </td>
            <td className="px-2 sm:px-4 py-2 text-right font-semibold text-white">₹{calculateSubtotal('tooling', item).toFixed(2)}</td>
          </>
        )}
        onAdd={() => addItem('tooling')}
        onDelete={(index) => deleteItem('tooling', index)}
      />
    </div>
  )
}

function SectionTable({ title, data, headers, renderItem, onAdd, onDelete, compact = false }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-white/20">
              {headers.map((header, index) => (
                <th key={index} className="px-2 sm:px-4 py-2 text-left font-semibold text-white">{header}</th>
              ))}
              <th className="px-2 sm:px-4 py-2 text-center font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                {renderItem(item, index)}
                <td className="px-2 sm:px-4 py-2 text-center">
                  <button onClick={() => onDelete(index)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={headers.length + 1} className="px-4 py-4 text-center text-white/70 text-sm">
                  No items added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button onClick={onAdd} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm">
        + Add {title} Item
      </button>
    </div>
  )
}

export default CommoditySheet
