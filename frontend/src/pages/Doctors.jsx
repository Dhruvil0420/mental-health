import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)

  const [showFilter, setShowFilter] = useState(false)
  const [filterDoc, setFilterDoc] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const decoded = decodeURIComponent(speciality || "").toLowerCase()

    const filtered = speciality
      ? doctors.filter(doc =>
          doc.speciality?.toLowerCase().includes(decoded)
        )
      : doctors

    setFilterDoc(filtered)
  }, [doctors, speciality])

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

        {/* DOCTOR GRID */}
        <div
          className="w-full grid gap-4 gap-y-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
        >
          {filterDoc.length > 0 ? (
            filterDoc.map((item) => (
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

      </div>
    </div>
  )
}

export default Doctors