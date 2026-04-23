import React, { useState } from 'react'

function PenaltyCalculations() {
  const [methodA, setMethodA] = useState({
    missingMaterial: { count: 0, points: 1 },
    missingProcess: { count: 0, points: 1 },
    missingFastener: { count: 0, points: 1 },
    missingPart: { count: 0, points: 3 },
    missingAssembly: { count: 0, points: 5 }
  })

  const [methodB, setMethodB] = useState({
    correctCost: 0,
    yourCost: 0
  })

  const calculateMethodATotal = () => {
    return Object.values(methodA).reduce((sum, item) => sum + (item.count * item.points), 0)
  }

  const calculateMethodBPenalty = () => {
    return 2 * (methodB.correctCost - methodB.yourCost)
  }

  return (
    <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Penalty Calculations</h1>

      {/* Method A: Direct Penalty */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Method A: Direct Penalty</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/20 text-white">
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Category</th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Points per Item</th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">Count</th>
                <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(methodA).map(([key, item]) => (
                <tr key={key} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="px-2 sm:px-4 py-3 capitalize text-white text-xs sm:text-sm">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center text-white text-xs sm:text-sm">{item.points}</td>
                  <td className="px-2 sm:px-4 py-3 text-center">
                    <input
                      type="number"
                      value={item.count}
                      onChange={(e) => setMethodA(prev => ({
                        ...prev,
                        [key]: { ...prev[key], count: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-16 sm:w-20 px-2 py-1 rounded-lg text-center"
                      min="0"
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-right font-semibold text-white text-xs sm:text-sm">
                    {item.count * item.points}
                  </td>
                </tr>
              ))}
              <tr className="bg-white/20 font-bold">
                <td className="px-2 sm:px-4 py-3 text-white text-xs sm:text-sm" colSpan="3">Method A Total:</td>
                <td className="px-2 sm:px-4 py-3 text-right text-lg sm:text-xl text-white">{calculateMethodATotal()} points</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Method B: Cost Penalty */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Method B: Cost Penalty</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/20 text-white">
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Correct Cost (₹)</th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Your Cost (₹)</th>
                <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">Difference</th>
                <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">Penalty (2 × Diff)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="px-2 sm:px-4 py-3">
                  <input
                    type="number"
                    value={methodB.correctCost}
                    onChange={(e) => setMethodB(prev => ({ ...prev, correctCost: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-2 sm:px-4 py-3">
                  <input
                    type="number"
                    value={methodB.yourCost}
                    onChange={(e) => setMethodB(prev => ({ ...prev, yourCost: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-2 sm:px-4 py-3 text-right text-white text-xs sm:text-sm">
                  ₹{(methodB.correctCost - methodB.yourCost).toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-3 text-right font-semibold text-white text-xs sm:text-sm">
                  ₹{calculateMethodBPenalty().toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Information */}
      <div className="p-4 glass-dark rounded-lg border-l-4 border-blue-400">
        <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Penalty Calculation Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-xs sm:text-sm">
          <li><strong>Method A:</strong> Direct penalty points for missing/inaccurate items</li>
          <li><strong>Method B:</strong> Cost penalty = 2 × (Correct Cost - Your Cost)</li>
          <li>Judges will apply the higher of the two penalties</li>
          <li>Ensure all BOM entries are complete to minimize penalties</li>
        </ul>
      </div>
    </div>
  )
}

export default PenaltyCalculations
