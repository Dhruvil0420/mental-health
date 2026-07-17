import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const AllApointments = () => {
  const { aToken } = useContext(AdminContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Get all appointments for admin
  const getAllAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl + '/api/appointment/get-all', {}, {
        headers: {
          Authorization: `Bearer ${aToken}`
        }
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/appointment/cancel', {
        appointmentId
      }, {
        headers: {
          Authorization: `Bearer ${aToken}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        await getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Complete appointment
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/appointment/complete', {
        appointmentId
      }, {
        headers: {
          Authorization: `Bearer ${aToken}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        await getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const filteredAppointments = appointments.filter(appointment => {
    const status = appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Scheduled'
    const matchesStatus = filterStatus === 'All' || status === filterStatus
    const matchesSearch = appointment.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.docData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.docData.speciality.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (appointment) => {
    if (appointment.cancelled) return 'bg-red-100 text-red-600'
    if (appointment.isCompleted) return 'bg-green-100 text-green-600'
    return 'bg-blue-100 text-blue-600'
  }

  const getStatusText = (appointment) => {
    if (appointment.cancelled) return 'Cancelled'
    if (appointment.isCompleted) return 'Completed'
    return 'Scheduled'
  }

  const getPaymentColor = (appointment) => {
    if (appointment.cancelled) return 'bg-red-100 text-red-600'
    if (appointment.payment) return 'bg-green-100 text-green-600'
    return 'bg-yellow-100 text-yellow-600'
  }

  const getPaymentText = (appointment) => {
    if (appointment.cancelled) return 'Refunded'
    if (appointment.payment) return 'Paid'
    return 'Pending'
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(appointmentId)
    }
  }

  const handleCompleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to mark this appointment as completed?')) {
      await completeAppointment(appointmentId)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">All Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage patient appointment logs and transaction statuses.</p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search patients, doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl outline-none focus:outline-none w-full text-sm transition-all shadow-sm"
            />
            <img className="absolute left-3 top-3 w-4 h-4 opacity-50" src={assets.list_icon} alt="Search" />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl outline-none focus:outline-none text-sm transition-all shadow-sm cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                        <img className="w-6 h-6 opacity-75" src={assets.appointments_icon} alt="Total" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-800">{appointments.length}</h4>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Total</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
                        S
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-800">
                            {appointments.filter(a => !a.cancelled && !a.isCompleted).length}
                        </h4>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Scheduled</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold text-sm">
                        C
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-800">
                            {appointments.filter(a => a.isCompleted).length}
                        </h4>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Completed</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold text-sm">
                        X
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-800">
                            {appointments.filter(a => a.cancelled).length}
                        </h4>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Cancelled</p>
                    </div>
                </div>
            </div>
          </>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold tracking-wider text-xs uppercase">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Fees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                    No appointments matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-slate-50/30 transition-all">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{appointment._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {appointment.userData.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {appointment.userData.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {appointment.docData.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {appointment.docData.speciality}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700 font-medium">{appointment.slotDate}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{appointment.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      ${appointment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        appointment.cancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                        appointment.isCompleted ? 'bg-green-50 text-green-600 border border-green-100' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {getStatusText(appointment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        appointment.cancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                        appointment.payment ? 'bg-green-50 text-green-600 border border-green-100' :
                        'bg-yellow-50 text-yellow-600 border border-yellow-100'
                      }`}>
                        {getPaymentText(appointment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex gap-2.5 justify-end">
                        {!appointment.cancelled && !appointment.isCompleted && (
                          <>
                            <button 
                              onClick={() => handleCompleteAppointment(appointment._id)}
                              className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-sm"
                              title="Mark Completed"
                            >
                              <img className="w-3 h-3" src={assets.tick_icon} alt="Complete" />
                            </button>
                            <button 
                              onClick={() => handleCancelAppointment(appointment._id)}
                              className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-sm"
                              title="Cancel Appointment"
                            >
                              <img className="w-3 h-3" src={assets.cancel_icon} alt="Cancel" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-slate-700">1</span> to{' '}
          <span className="font-semibold text-slate-700">{filteredAppointments.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{filteredAppointments.length}</span> results
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95">
            Previous
          </button>
          <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold shadow hover:bg-opacity-95 transition-all active:scale-95">
            1
          </button>
          <button className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllApointments
