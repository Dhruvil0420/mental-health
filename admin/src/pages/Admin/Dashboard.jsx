import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Dashboard = () => {
    const { aToken } = useContext(AdminContext)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
        }
    }, [aToken]);

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

    // Calculate statistics
    const getAppointmentStats = () => {
        const stats = {
            total: appointments.length,
            scheduled: appointments.filter(a => !a.cancelled && !a.isCompleted).length,
            completed: appointments.filter(a => a.isCompleted).length,
            cancelled: appointments.filter(a => a.cancelled).length,
            totalEarnings: appointments.filter(a => a.payment).reduce((sum, a) => sum + a.amount, 0),
            monthlyEarnings: appointments.filter(a => a.payment && new Date(a.date).getMonth() === new Date().getMonth()).reduce((sum, a) => sum + a.amount, 0)
        };
        return stats;
    };
    
    const stats = getAppointmentStats()
    
    // Get recent appointments (last 5)
    const recentAppointments = appointments.slice(0, 5)
    
    // Get top performing doctors
    const getTopDoctors = () => {
        const doctorStats = {}
        
        appointments.forEach(apt => {
            if (!doctorStats[apt.docData.name]) {
                doctorStats[apt.docData.name] = {
                    name: apt.docData.name,
                    speciality: apt.docData.speciality,
                    appointments: 0,
                    earnings: 0
                }
            }
            doctorStats[apt.docData.name].appointments++
            if (apt.payment) {
                doctorStats[apt.docData.name].earnings += apt.amount
            }
        })
        
        return Object.values(doctorStats)
            .sort((a, b) => b.earnings - a.earnings)
            .slice(0, 4)
    }
    
    const topDoctors = getTopDoctors()

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Welcome back, Admin. Here is today's practice overview.</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Doctors */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-350">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Doctors</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{topDoctors.length}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <img className="w-6 h-6 opacity-90" src={assets.doctor_icon} alt="Doctors" />
                        </div>
                    </div>
                </div>
                
                {/* Total Patients */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-350">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Patients</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{appointments.length}</h3>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <img className="w-6 h-6 opacity-90" src={assets.patients_icon} alt="Patients" />
                        </div>
                    </div>
                </div>
                
                {/* Total Appointments */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-350">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Appointments</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</h3>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <img className="w-6 h-6 opacity-90" src={assets.appointments_icon} alt="Appointments" />
                        </div>
                    </div>
                </div>
                
                {/* Total Earnings */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-350">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Earnings</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">${stats.totalEarnings.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <img className="w-6 h-6 opacity-90" src={assets.earning_icon} alt="Earnings" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <div className="text-center p-3 border-r border-slate-200/60 last:border-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
                    <p className="text-base sm:text-lg font-bold text-primary mt-1">${stats.monthlyEarnings.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 border-r border-slate-200/60 last:border-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Slots</p>
                    <p className="text-base sm:text-lg font-bold text-blue-600 mt-1">{stats.scheduled}</p>
                </div>
                <div className="text-center p-3 border-r border-slate-200/60 last:border-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Cancelled Bookings</p>
                    <p className="text-base sm:text-lg font-bold text-red-600 mt-1">{stats.cancelled}</p>
                </div>
                <div className="text-center p-3 last:border-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Sessions</p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-1">{stats.completed}</p>
                </div>
            </div>

            {/* Recent Appointments & Top Doctors Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                
                {/* Recent Appointments */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Recent Appointments</h2>
                        <span className="text-xs text-primary font-medium bg-primary/10 px-2.5 py-1 rounded-full">Last 5 bookins</span>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : recentAppointments.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm">No recent bookings found.</div>
                    ) : (
                        <div className="space-y-4 flex-1">
                            {recentAppointments.map((appointment) => (
                                <div key={appointment._id} className="flex items-center justify-between p-4 border border-slate-50 hover:bg-slate-50/50 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                                            {appointment.userData.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-800">{appointment.userData.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Doctor: {appointment.docData.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-slate-700">{appointment.slotDate}</p>
                                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${
                                            appointment.cancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                                            appointment.isCompleted ? 'bg-green-50 text-green-600 border border-green-100' :
                                            'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                            {appointment.cancelled ? 'Cancelled' :
                                             appointment.isCompleted ? 'Completed' :
                                             'Scheduled'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Performing Doctors */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Top Performing Doctors</h2>
                        <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-full">By earnings</span>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : topDoctors.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm">No doctor statistics available.</div>
                    ) : (
                        <div className="space-y-4 flex-1">
                            {topDoctors.map((doctor, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-slate-50 hover:bg-slate-50/50 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center font-bold text-sm">
                                            {doctor.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-800">{doctor.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{doctor.speciality}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-800">${doctor.earnings.toLocaleString()}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{doctor.appointments} bookings</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
