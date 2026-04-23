import React from 'react'

function CoverPage({ teamInfo, setTeamInfo }) {
  const handleChange = (field, value) => {
    setTeamInfo(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
        SUPRA SAEINDIA Cost Report
      </h1>

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-48 font-semibold text-white text-sm sm:text-base">University:</label>
          <input
            type="text"
            value={teamInfo.university}
            onChange={(e) => handleChange('university', e.target.value)}
            className="flex-1 w-full px-4 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-48 font-semibold text-white text-sm sm:text-base">Team Name:</label>
          <input
            type="text"
            value={teamInfo.teamName}
            onChange={(e) => handleChange('teamName', e.target.value)}
            className="flex-1 w-full px-4 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-48 font-semibold text-white text-sm sm:text-base">Car Number:</label>
          <input
            type="text"
            value={teamInfo.carNumber}
            onChange={(e) => handleChange('carNumber', e.target.value)}
            placeholder="Enter car number"
            className="flex-1 w-full px-4 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-48 font-semibold text-white text-sm sm:text-base">Season / Year:</label>
          <input
            type="text"
            value={teamInfo.seasonYear}
            onChange={(e) => handleChange('seasonYear', e.target.value)}
            className="flex-1 w-full px-4 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-48 font-semibold text-white text-sm sm:text-base">Vehicle Class:</label>
          <input
            type="text"
            value={teamInfo.vehicleClass}
            onChange={(e) => handleChange('vehicleClass', e.target.value)}
            className="flex-1 w-full px-4 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-48 font-semibold text-white text-sm sm:text-base">Report Date:</label>
          <input
            type="date"
            value={new Date().toISOString().split('T')[0]}
            readOnly
            className="flex-1 w-full px-4 py-2 rounded-lg bg-white/70"
          />
        </div>
      </div>

      <div className="mt-6 sm:mt-8 p-4 glass-dark rounded-lg">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-white">Instructions</h2>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-sm sm:text-base">
          <li>Fill in all required fields above</li>
          <li>Car Number is required for submission</li>
          <li>Navigate to other pages using the top navigation bar</li>
          <li>Complete BOM and commodity sheets before exporting</li>
        </ul>
      </div>
    </div>
  )
}

export default CoverPage
