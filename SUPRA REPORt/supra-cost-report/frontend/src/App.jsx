import React, { useState } from 'react'
import CoverPage from './pages/CoverPage'
import CostSummary from './pages/CostSummary'
import BOM from './pages/BOM'
import CommoditySheet from './pages/CommoditySheet'
import PenaltyCalculations from './pages/PenaltyCalculations'

// Team identity
const TEAM_INFO = {
  university: 'Ajeenkya DY Patil University',
  teamName: 'Javitron',
  seasonYear: '2025-26',
  vehicleClass: 'Formula Student / SUPRA',
  carNumber: ''
}

// Commodity codes and names
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

function App() {
  const [currentPage, setCurrentPage] = useState('cover')
  const [teamInfo, setTeamInfo] = useState(TEAM_INFO)
  const [bomData, setBomData] = useState([])
  const [commodityData, setCommodityData] = useState(
    Object.keys(COMMODITIES).reduce((acc, code) => {
      acc[code] = {
        assembly: '',
        parts: [],
        materials: [],
        processes: [],
        fasteners: [],
        tooling: []
      }
      return acc
    }, {})
  )

  const pages = [
    { id: 'cover', label: 'Cover Page' },
    { id: 'summary', label: 'Cost Summary' },
    { id: 'bom', label: 'BOM' },
    { id: 'penalty', label: 'Penalty Calculations' },
    ...Object.entries(COMMODITIES).map(([code, name]) => ({
      id: code,
      label: `${code} - ${name}`
    }))
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'cover':
        return <CoverPage teamInfo={teamInfo} setTeamInfo={setTeamInfo} />
      case 'summary':
        return <CostSummary commodityData={commodityData} teamInfo={teamInfo} />
      case 'bom':
        return <BOM bomData={bomData} setBomData={setBomData} commodityData={commodityData} teamInfo={teamInfo} />
      case 'penalty':
        return <PenaltyCalculations />
      default:
        if (COMMODITIES[currentPage]) {
          return (
            <CommoditySheet
              commodityCode={currentPage}
              commodityName={COMMODITIES[currentPage]}
              data={commodityData[currentPage]}
              setData={( newData) => setCommodityData(prev => ({ ...prev, [currentPage]: newData }))}
            />
          )
        }
        return <div>Page not found</div>
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:py-0 h-auto sm:h-16 gap-3 sm:gap-0">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className="text-lg sm:text-xl font-bold">SUPRA SAEINDIA Cost Report</h1>
              <span className="ml-2 sm:ml-4 text-xs sm:text-sm opacity-75">{teamInfo.teamName}</span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
                    currentPage === page.id
                      ? 'bg-white/90 text-purple-900 font-semibold shadow-lg'
                      : 'hover:bg-white/30 hover:shadow-md'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
