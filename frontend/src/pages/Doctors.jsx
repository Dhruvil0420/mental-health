import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)

  const [showFilter, setShowFilter] = useState(false)
  const [filterDoc, setFilterDoc] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const navigate = useNavigate()

  useEffect(() => {
    const decoded = decodeURIComponent(speciality || "").toLowerCase()

    const filtered = speciality
      ? doctors.filter(doc =>
          doc.speciality?.toLowerCase().includes(decoded)
        )
      : doctors

    setFilterDoc(filtered)
    setCurrentPage(1) // Reset page when speciality changes
  }, [doctors, speciality])

  const totalPages = Math.ceil(filterDoc.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDoctors = filterDoc.slice(indexOfFirstItem, indexOfLastItem)

  const specialities = [
    'Psychiatrist',
    'Clinical Psychologist',
    'Counselling Psychologist',
    'Psychotherapist',
    'Child & Adolescent Psychiatrist',
    'Addiction Psychiatrist'
  ]

  return (
    <div>
      <p className="text-gray-600">
        Browse our mental health specialists.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">

        {/* FILTER BUTTON (MOBILE) */}
        <button
          className={`py-1 px-3 border rounded text-sm sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        {/* FILTER LIST */}
        <div className={`${showFilter ? 'flex' : 'hidden'} sm:flex flex-col gap-4 text-sm text-gray-600`}>
          {specialities.map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality === spec
                  ? navigate('/doctors')
                  : navigate(`/doctors/${encodeURIComponent(spec)}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded cursor-pointer ${
                decodeURIComponent(speciality || "") === spec
                  ? 'bg-indigo-100 text-black'
                  : ''
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* DOCTOR GRID & PAGINATION CONTAINER */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          <div
            className="w-full grid gap-4 gap-y-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
          >
            {currentDoctors.length > 0 ? (
              currentDoctors.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
                >
                  <img className="bg-blue-50" src={item.image} alt={item.name} />

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <p>Available</p>
                    </div>

                    <p className="text-gray-900 text-lg font-medium">
                      {item.name}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {item.speciality}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No doctors found</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 w-full">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-gray-700 bg-white"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                    currentPage === page 
                      ? 'bg-primary text-white shadow' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-gray-700 bg-white"
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Doctors