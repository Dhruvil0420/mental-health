import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
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
    <div className='m-5'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h1 className='text-2xl font-semibold'>All Appointments</h1>
        
        {/* Search and Filter */}
        <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search appointments...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary w-full sm:w-64'
            />
            <img className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' src={assets.list_icon} alt="Search" />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary'
          >
            <option value='All'>All Status</option>
            <option value='Scheduled'>Scheduled</option>
            <option value='Completed'>Completed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {loading ? (
          <div className='col-span-4 flex justify-center items-center h-32'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        ) : (
          <>
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                    <img className='w-10' src={assets.appointments_icon} alt="Total" />
                    <div>
                        <p className='text-xl font-semibold'>{appointments.length}</p>
                        <p className='text-gray-600 text-sm'>Total Appointments</p>
                    </div>
                </div>
            </div>
            
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                        <span className='text-blue-600 font-semibold'>S</span>
                    </div>
                    <div>
                        <p className='text-xl font-semibold text-blue-600'>
                            {appointments.filter(a => !a.cancelled && !a.isCompleted).length}
                        </p>
                        <p className='text-gray-600 text-sm'>Scheduled</p>
                    </div>
                </div>
            </div>
            
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                        <span className='text-green-600 font-semibold'>C</span>
                    </div>
                    <div>
                        <p className='text-xl font-semibold text-green-600'>
                            {appointments.filter(a => a.isCompleted).length}
                        </p>
                        <p className='text-gray-600 text-sm'>Completed</p>
                    </div>
                </div>
            </div>
            
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                        <span className='text-red-600 font-semibold'>X</span>
                    </div>
                    <div>
                        <p className='text-xl font-semibold text-red-600'>
                            {appointments.filter(a => a.cancelled).length}
                        </p>
                        <p className='text-gray-600 text-sm'>Cancelled</p>
                    </div>
                </div>
            </div>
          </>
        )}
      </div>

      {/* Appointments Table */}
      <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Appointment ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Patient
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Doctor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date & Time
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Fees
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Payment
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="8" className='px-6 py-12 text-center'>
                    <div className='flex justify-center items-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className='px-6 py-12 text-center text-gray-500'>
                    No appointments found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {appointment._id.slice(-6)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {appointment.userData.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {appointment.userData.email}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {appointment.docData.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {appointment.docData.speciality}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      <div>{appointment.slotDate}</div>
                      <div className='text-gray-500'>{appointment.slotTime}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      ${appointment.amount}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment)}`}>
                        {getStatusText(appointment)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentColor(appointment)}`}>
                        {getPaymentText(appointment)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex gap-2'>
                        <button className='text-primary hover:text-primary/80'>
                          <img className='w-4 h-4' src={assets.list_icon} alt="View" />
                        </button>
                        {!appointment.cancelled && !appointment.isCompleted && (
                          <>
                            <button 
                              onClick={() => handleCompleteAppointment(appointment._id)}
                              className='text-green-600 hover:text-green-800'
                              title="Mark as completed"
                            >
                              <img className='w-4 h-4' src={assets.tick_icon} alt="Complete" />
                            </button>
                            <button 
                              onClick={() => handleCancelAppointment(appointment._id)}
                              className='text-red-600 hover:text-red-800'
                              title="Cancel appointment"
                            >
                              <img className='w-4 h-4' src={assets.cancel_icon} alt="Cancel" />
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
      <div className='flex items-center justify-between mt-6'>
        <div className='text-sm text-gray-700'>
          Showing <span className='font-medium'>1</span> to{' '}
          <span className='font-medium'>{filteredAppointments.length}</span> of{' '}
          <span className='font-medium'>{filteredAppointments.length}</span> results
        </div>
        <div className='flex gap-2'>
          <button className='px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50'>
            Previous
          </button>
          <button className='px-3 py-1 bg-primary text-white rounded-md text-sm'>
            1
          </button>
          <button className='px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50'>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllApointments
