import React, { useContext, useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {AppContext} from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors,currencySymbol,token,backendUrl,userData} = useContext(AppContext)
  const navigate = useNavigate()
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']

  const [docInfo,setDocInfo] = useState(null)
  const [docSlots,setDocSlots] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  // Check if user profile is complete
  const isProfileComplete = () => {
    if (!userData) return false;
    
    const requiredFields = [
      userData.phone && userData.phone !== '0000000000',
      userData.gender && userData.gender !== 'Not Selected',
      userData.dob && userData.dob !== 'Not Selected'
    ];

    return requiredFields.every(field => field === true);
  }
  const fetchDocInfo = async () =>{
    const docInfo = doctors.find(doc => doc._id ===docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  const getAvailableSlots = async () => {
      let today = new Date()
      let tempDocSlots = []

      let i = 0
      while (tempDocSlots.length < 7) {
        let currentDate = new Date(today)
        currentDate.setDate(today.getDate() + i)

        let endTime = new Date()
        endTime.setDate(today.getDate() + i)
        endTime.setHours(21, 0, 0, 0)

        if (today.getDate() === currentDate.getDate()) {
          currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
        } else {
          currentDate.setHours(10)
          currentDate.setMinutes(0)
        }

        let timeSlots = []
        while (currentDate < endTime) {
            let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
            
            timeSlots.push({
              datetime: new Date(currentDate),
              time: formattedTime 
            })

            currentDate.setMinutes(currentDate.getMinutes() + 30)
        }
        
        if (timeSlots.length > 0) {
          tempDocSlots.push(timeSlots)
        }
        i++
      }
      setDocSlots(tempDocSlots)
  }

  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId])

  useEffect(() =>{
    getAvailableSlots()
  },[docInfo])

  useEffect(() =>{
    console.log(docSlots)
  },[docSlots])

  const bookAppointment = async () => {
    if (!token) {
      return toast.error('Please login to book appointment')
    }

    if (!slotTime) {
      return toast.error('Please select a time slot')
    }

    // Check if profile is complete
    if (!isProfileComplete()) {
      toast.error('Please complete your profile details before booking an appointment')
      setTimeout(() => {
        navigate('/my-profile')
      }, 2000)
      return
    }

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
      return toast.error('User data not found. Please login again.')
    }

    try {
      setIsBooking(true)
      
      const date = docSlots[slotIndex][0].datetime
      const slotDate = date.toLocaleDateString()
      
      const { data } = await axios.post(backendUrl + '/api/appointment/book', {
        userId: user._id,
        docId,
        slotDate,
        slotTime
      }, {
        headers: {
          token
        }
      })

      if (data.success) {
        toast.success(data.message)
        // Reset slot selection
        setSlotTime('')
        setSlotIndex(0)
        // Refresh slots
        await getAvailableSlots()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to book appointment')
    } finally {
      setIsBooking(false)
    }
  }

  return docInfo &&(
    <div>
      {/* ------------doctor details --------------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/*-------- Doc Info: name , degree and exprience ---------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>  
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* Doctor Rating Stars */}
          <div className="flex items-center gap-1.5 mt-2 select-none">
            <span className="text-amber-400 font-bold text-base">★</span>
            <span className="text-slate-700 text-sm font-semibold">{docInfo.averageRating || '0.0'}</span>
            <span className="text-slate-400 text-xs font-medium">({docInfo.totalReviews || 0} reviews)</span>
          </div>
          {/*---------Doctor About ---------- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-x-[700px] mt-1'>
              {docInfo.about }
            </p>
          </div>
          <p className='text-gray-500 font-medium mt-4 '>
            Appointment fee : <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {userData && !isProfileComplete() && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6 mx-2 sm:mx-0'>
          <div className='flex items-center gap-3'>
            <svg className='w-5 h-5 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
            </svg>
            <div className='flex-1'>
              <p className='text-sm font-medium text-yellow-800'>Please complete your profile before booking</p>
              <p className='text-xs text-yellow-600 mt-1'>
                {!userData.phone || userData.phone === '0000000000' ? '• Phone number ' : ''}
                {userData.gender === 'Not Selected' || !userData.gender ? '• Gender ' : ''}
                {userData.dob === 'Not Selected' || !userData.dob ? '• Date of birth ' : ''}
                are required
              </p>
            </div>
            <button 
              onClick={() => navigate('/my-profile')}
              className='px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-all'
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}

      {/*----------Booking Slots -------------- */}

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ?'bg-primary text-white ':'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>

              </div>

            ))
          }
        </div>
        <div>
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlots.length && docSlots[slotIndex].map((item,index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white':'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>  
          <button 
            onClick={bookAppointment}
            disabled={isBooking || !slotTime}
            className={`bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 ${isBooking || !slotTime ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 transition-all'}`}
          >
            {isBooking ? 'Booking...' : slotTime ? 'Book an Appointment' : 'Select a Time Slot'}
          </button>
        </div>
        {/* --------Listing related doctor--------- */}
        <RelatedDoctors  docId={docId} speciality = {docInfo.speciality} />


      </div>
    </div>
  )
}

export default Appointment
