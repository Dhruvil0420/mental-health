import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const AllApointments = () => {
  const { aToken } = useContext(AdminContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
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

  const handleMarkAsPaid = async (appointmentId) => {
    if (window.confirm('Are you sure you want to mark this appointment as paid manually?')) {
      try {
        const { data } = await axios.post(backendUrl + '/api/appointment/mark-paid', {
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
          <table className="w-full border-collapse text-left text-sm text-slate-500 min-w-max">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold tracking-wider text-[11px] sm:text-xs uppercase">
              <tr>
                <th className="px-3 py-3 sm:px-6 sm:py-4">ID</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Patient</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Doctor</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Date & Time</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Fees</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Status</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Payment</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-3 py-16 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-3 py-16 text-center text-slate-400">
                    No appointments matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className="hover:bg-slate-50/30 transition-all cursor-pointer text-xs sm:text-sm"
                  >
                    <td className="px-3 py-3 sm:px-6 sm:py-4 font-mono text-[10px] sm:text-xs text-slate-400">
                      #{appointment._id.slice(-6)}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">
                          {appointment.userData.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                          {appointment.userData.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">
                          {appointment.docData.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                          {appointment.docData.speciality}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-slate-700 font-medium">{appointment.slotDate}</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{appointment.slotTime}</div>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-bold text-slate-800">
                      ${appointment.amount}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full ${appointment.cancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                          appointment.isCompleted ? 'bg-green-50 text-green-600 border border-green-100' :
                            'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                        {getStatusText(appointment)}
                      </span>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full ${appointment.cancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                          appointment.payment ? 'bg-green-50 text-green-600 border border-green-100' :
                            'bg-yellow-50 text-yellow-600 border border-yellow-100'
                        }`}>
                        {getPaymentText(appointment)}
                      </span>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary transition-all active:scale-95 shadow-sm cursor-pointer"
                      >
                        View Details
                      </button>
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

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-scaleUp text-left" onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="bg-primary/5 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Appointment Details</h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: #{selectedAppointment._id}</p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/50 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600 font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">

              {/* Patient Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Information</h4>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.userData?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.userData?.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.userData?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gender:</span>
                    <span className="font-semibold text-slate-700 capitalize">{selectedAppointment.userData?.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">DOB:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.userData?.dob || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor Information</h4>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Doctor Name:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.docData?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Speciality:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.docData?.speciality}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Degree:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.docData?.degree || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointment Details</h4>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Date & Time:</span>
                    <span className="font-semibold text-slate-700">{selectedAppointment.slotDate} | {selectedAppointment.slotTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Fees Amount:</span>
                    <span className="font-bold text-slate-800">${selectedAppointment.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full ${selectedAppointment.cancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                        selectedAppointment.payment ? 'bg-green-50 text-green-600 border border-green-100' :
                          'bg-yellow-50 text-yellow-600 border border-yellow-100'
                      }`}>
                      {getPaymentText(selectedAppointment)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Booking Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full ${selectedAppointment.cancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                        selectedAppointment.isCompleted ? 'bg-green-50 text-green-600 border border-green-100' :
                          'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                      {getStatusText(selectedAppointment)}
                    </span>
                  </div>
                  {selectedAppointment.stripeSessionId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Stripe Session ID:</span>
                      <span className="font-mono text-xs text-slate-600 break-all max-w-[200px] text-right">{selectedAppointment.stripeSessionId}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer / Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {!selectedAppointment.cancelled && !selectedAppointment.isCompleted && (
                  <>
                    {!selectedAppointment.payment && (
                      <button
                        onClick={() => {
                          handleMarkAsPaid(selectedAppointment._id);
                          setSelectedAppointment(null);
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all active:scale-95 shadow-sm cursor-pointer"
                        title="Accept Payment"
                      >
                        Accept Payment
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleCompleteAppointment(selectedAppointment._id);
                        setSelectedAppointment(null);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all active:scale-95 shadow-sm cursor-pointer"
                      title="Mark Completed"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => {
                        handleCancelAppointment(selectedAppointment._id);
                        setSelectedAppointment(null);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all active:scale-95 shadow-sm cursor-pointer"
                      title="Cancel Appointment"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-primary text-white hover:bg-opacity-95 font-semibold text-sm px-6 py-2 rounded-xl transition-all shadow active:scale-95 cursor-pointer ml-auto"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default AllApointments
