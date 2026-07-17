import React,{useContext,useEffect,useState} from 'react'
import {AdminContext} from '../../context/AdminContext'

const DoctorsList = () => {
    const {doctors,aToken, getAllDoctors,changeAvailability} = useContext(AdminContext)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    },[aToken])

    const totalPages = Math.ceil(doctors.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem)

    return (
        <div className='p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn flex flex-col justify-between min-h-[calc(100vh-120px)]'>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className='text-3xl font-bold text-slate-800'>All Doctors</h1>
                    <p className='text-sm text-slate-500 mt-1'>Manage doctor profiles, specialities, and status listings.</p>
                </div>

                {/* Cards Grid */}
                <div className='w-full flex flex-wrap gap-6 pt-2 justify-start items-stretch'>
                    {
                        currentDoctors.map((item,index)=>(
                            <div className='bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-56 flex flex-col' key={index}>
                                <div className="relative bg-slate-50 overflow-hidden h-48 flex items-center justify-center">
                                    <img className='w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500' src={item.image} alt={item.name} />
                                </div>
                                <div className='p-4 flex-1 flex flex-col justify-between gap-4'>
                                    <div>
                                        <h3 className='text-slate-800 text-base font-bold leading-tight'>{item.name}</h3>
                                        <p className='text-slate-400 text-xs mt-1 font-medium'>{item.speciality}</p>
                                    </div>
                                    <div className='pt-3 border-t border-slate-50 flex items-center justify-between'>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={item.available} 
                                                onChange={() => changeAvailability(item._id)} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                            <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider peer-checked:text-primary">
                                                {item.available ? "Active" : "Paused"}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-400">
                        Showing <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> to{' '}
                        <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, doctors.length)}</span> of{' '}
                        <span className="font-semibold text-slate-700">{doctors.length}</span> doctors
                    </div>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 bg-white"
                        >
                            Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                                    currentPage === page 
                                        ? 'bg-primary text-white shadow' 
                                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 bg-white"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorsList
