import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { assets } from '../assets/assets'
import { jsPDF } from "jspdf"
import { AppointmentRowSkeleton } from '../components/SkeletonLoader'

const MyAppointment = () => {
  const {backendUrl, token, userData} = useContext(AppContext) 
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedAptId, setSelectedAptId] = useState(null)
  const [userRating, setUserRating] = useState(5)
  const [userComment, setUserComment] = useState('')

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

  const handleOpenReviewModal = (appointmentId) => {
    setSelectedAptId(appointmentId)
    setUserRating(5)
    setUserComment('')
    setShowReviewModal(true)
  }

  const submitAppointmentReview = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/appointment/submit-review', {
        appointmentId: selectedAptId,
        rating: userRating,
        comment: userComment
      }, {
        headers: {
          token
        }
      })

      if (data.success) {
        toast.success(data.message)
        setShowReviewModal(false)
        await getUserAppointments()
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

  const downloadPDF = (appointment) => {
    try {
      const doc = new jsPDF()
      
      // Add Title
      doc.setFont("Helvetica", "bold")
      doc.setFontSize(22)
      doc.setTextColor(95, 111, 255) // Theme primary color
      doc.text("Prescripto Medical Appointment", 20, 30)
      
      doc.setDrawColor(220, 220, 220)
      doc.line(20, 35, 190, 35)
      
      // Body settings
      doc.setFont("Helvetica", "normal")
      doc.setFontSize(12)
      doc.setTextColor(80, 80, 80)
      
      const details = [
        { label: "Appointment ID:", value: appointment._id },
        { label: "Doctor Name:", value: appointment.docData.name },
        { label: "Speciality:", value: appointment.docData.speciality },
        { label: "Date:", value: formatDate(appointment.slotDate) },
        { label: "Time:", value: appointment.slotTime },
        { label: "Payment Status:", value: appointment.payment ? "Paid" : "Pending" },
        { label: "Booking Status:", value: appointment.cancelled ? "Cancelled" : appointment.isCompleted ? "Completed" : "Scheduled" }
      ]
      
      let y = 50
      details.forEach(detail => {
        doc.setFont("Helvetica", "bold")
        doc.text(detail.label, 20, y)
        doc.setFont("Helvetica", "normal")
        doc.text(detail.value.toString(), 70, y)
        y += 12
      })
      
      // Footer
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text("Thank you for choosing Prescripto Medical Services.", 20, 170)
      
      doc.save(`Appointment_${appointment._id.slice(-6)}.pdf`)
      toast.success("PDF downloaded successfully!")
    } catch (err) {
      console.log(err)
      toast.error("Failed to generate PDF")
    }
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
        <div className="space-y-4 mt-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <AppointmentRowSkeleton key={idx} />
          ))}
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
                  <div className="flex flex-col gap-2">
                    <button className='text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-600 rounded cursor-default font-medium bg-green-50'>
                      Completed
                    </button>
                    {!item.isReviewed ? (
                      <button 
                        onClick={() => handleOpenReviewModal(item._id)}
                        className='text-sm text-white bg-primary text-center sm:min-w-48 py-2 rounded hover:bg-opacity-95 active:scale-95 transition-all font-semibold cursor-pointer'
                      >
                        Review Doctor
                      </button>
                    ) : (
                      <div className="text-center text-xs text-amber-500 font-bold py-2 bg-amber-50/50 border border-amber-100 rounded sm:min-w-48 select-none">
                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                      </div>
                    )}
                  </div>
                )}
                {item.cancelled && (
                  <button className='text-sm text-red-600 text-center sm:min-w-48 py-2 border border-red-600 rounded cursor-default'>
                    Cancelled
                  </button>
                )}
                <button 
                  onClick={() => downloadPDF(item)}
                  className='text-sm text-slate-500 text-center sm:min-w-48 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-all duration-300 active:scale-95 font-medium'
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Review & Rating Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-scaleUp p-6 space-y-6 text-left" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">Review Doctor</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/50 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600 font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-500">Please rate your experience with this doctor and provide feedback.</p>
              
              {/* Stars selection */}
              <div className="flex justify-center items-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="text-3xl transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                    type="button"
                  >
                    <span className={star <= userRating ? 'text-amber-400' : 'text-slate-200'}>★</span>
                  </button>
                ))}
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comments</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl outline-none focus:border-primary resize-none text-sm"
                  placeholder="Share details of your consult experience..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-semibold rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={submitAppointmentReview}
                className="px-6 py-2 bg-primary text-white hover:bg-opacity-95 font-semibold rounded-xl text-sm transition-all shadow active:scale-95 cursor-pointer"
              >
                Submit Review
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointment
