import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { assets } from '../assets/assets'

const MyAppointment = () => {
  const {backendUrl, token, userData} = useContext(AppContext) 
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const getUserAppointments = async () => {
    try {
      // Use userData from context or fallback to localStorage
      let user = userData;
      if (!user) {
        try {
          const storedUserData = localStorage.getItem('userData');
          if (storedUserData) {
            user = JSON.parse(storedUserData);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      if (!user || !user._id) {
        toast.error('User data not found. Please login again.')
        setLoading(false)
        return
      }

      const { data } = await axios.post(backendUrl + '/api/appointment/get-user-appointments', {
        userId: user._id
      }, {
        headers: {
          token
        }
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/appointment/cancel', {
        appointmentId
      }, {
        headers: {
          token
        }
      })

      if (data.success) {
        toast.success(data.message)
        await getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const payOnline = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/payment/create-session', {
        appointmentId
      }, {
        headers: {
          token
        }
      })

      if (data.success) {
        window.location.href = data.session_url
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const isUpcoming = (slotDate) => {
    const appointmentDate = new Date(slotDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return appointmentDate >= today
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      
      {loading ? (
        <div className='flex justify-center items-center h-32'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <img className='w-32 mx-auto mb-4 opacity-50' src={assets.appointment_img} alt="No appointments" />
          <p>No appointments booked yet</p>
        </div>
      ) : (
        <div>
          {appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={index}>
              <div className='flex items-center justify-center'>
                <div className='relative w-24 h-24 sm:w-32 sm:h-32'>
                  <img 
                    className='w-full h-full bg-indigo-50 rounded-full object-cover object-center' 
                    src={item.docData.image || assets.doc1} 
                    alt={item.docData.name}
                    onError={(e) => {
                      e.target.src = assets.doc1; // Fallback to default image
                    }}
                  />
                </div>
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Date & Time:</p>
                <p className='text-xs'>{formatDate(item.slotDate)} | {item.slotTime}</p>
                <div className='flex items-center gap-2 mt-2'>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.cancelled ? 'bg-red-100 text-red-600' :
                    item.isCompleted ? 'bg-green-100 text-green-600' :
                    isUpcoming(item.slotDate) ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.cancelled ? 'Cancelled' :
                     item.isCompleted ? 'Completed' :
                     isUpcoming(item.slotDate) ? 'Upcoming' :
                     'Past'}
                  </span>
                  {!item.cancelled && !item.payment && (
                    <span className='px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600'>
                      Payment Pending
                    </span>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && !item.isCompleted && isUpcoming(item.slotDate) && (
                  <>
                    {!item.payment && (
                      <button 
                        onClick={() => payOnline(item._id)}
                        className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                      >
                        Pay Online
                      </button>
                    )}
                    <button 
                      onClick={() => cancelAppointment(item._id)}
                      className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                    >
                      Cancel appointment
                    </button>
                  </>
                )}
                {item.isCompleted && (
                  <button className='text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-600 rounded cursor-default'>
                    Completed
                  </button>
                )}
                {item.cancelled && (
                  <button className='text-sm text-red-600 text-center sm:min-w-48 py-2 border border-red-600 rounded cursor-default'>
                    Cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointment
