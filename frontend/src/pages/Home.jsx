import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Home = () => {
  const { backendUrl, token, userData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [reminder, setReminder] = useState(null)
  const navigate = useNavigate()

  // Parse appointment slotDate (e.g. '2026-07-20') and slotTime (e.g. '10:00 AM') into a local Date object
  const parseAppointmentDateTime = (dateStr, timeStr) => {
    try {
      const dateParts = dateStr.split('-')
      if (dateParts.length !== 3) return null
      
      const year = parseInt(dateParts[0])
      const month = parseInt(dateParts[1]) - 1 // JS months are 0-indexed
      const day = parseInt(dateParts[2])

      const timeMatch = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
      if (!timeMatch) return null

      let hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2])
      const ampm = timeMatch[3].toUpperCase()

      if (ampm === 'PM' && hours < 12) hours += 12
      if (ampm === 'AM' && hours === 12) hours = 0

      return new Date(year, month, day, hours, minutes)
    } catch (e) {
      return null
    }
  }

  const getUserAppointments = async () => {
    try {
      // Fetch user data from localStorage if not available in context
      let user = userData
      if (!user) {
        const storedUserData = localStorage.getItem('userData')
        if (storedUserData) {
          user = JSON.parse(storedUserData)
        }
      }

      if (!user || !user._id) return

      const { data } = await axios.post(
        backendUrl + '/api/appointment/get-user-appointments',
        { userId: user._id },
        { headers: { token } }
      )

      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (error) {
      console.log('Error fetching appointments for home reminders:', error)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token, userData])

  useEffect(() => {
    if (appointments.length === 0) {
      setReminder(null)
      return
    }

    const now = new Date()
    const upcoming = appointments.find((apt) => {
      if (apt.cancelled || apt.isCompleted) return false
      
      const aptTime = parseAppointmentDateTime(apt.slotDate, apt.slotTime)
      if (!aptTime) return false

      const diffMs = aptTime - now
      const diffHours = diffMs / (1000 * 60 * 60)
      
      // Return true if the appointment occurs in the next 24 hours
      return diffHours >= 0 && diffHours <= 24
    })

    setReminder(upcoming || null)
  }, [appointments])

  return (
    <div className="space-y-6">
      {/* 24-Hour Upcoming Appointment Reminder Alert */}
      {reminder && (
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md animate-fadeIn mt-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl animate-pulse">
              ⏰
            </span>
            <div>
              <p className="font-bold text-sm text-white">Upcoming Appointment Reminder</p>
              <p className="text-xs text-white/90 mt-0.5">
                You have a medical appointment scheduled with <strong className="text-white font-semibold">{reminder.docData.name}</strong> ({reminder.docData.speciality}) on <strong className="text-white font-semibold">{reminder.slotDate} at {reminder.slotTime}</strong>.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/my-appointments')}
            className="px-4 py-2 bg-white text-indigo-600 hover:bg-slate-50 font-semibold rounded-xl text-xs transition-all shadow active:scale-95 whitespace-nowrap self-end sm:self-auto cursor-pointer"
          >
            View My Appointments
          </button>
        </div>
      )}

      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home
