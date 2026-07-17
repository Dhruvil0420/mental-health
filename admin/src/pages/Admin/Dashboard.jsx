import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
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
        <div className='m-5'>
            <h1 className='text-2xl font-semibold'>Admin Dashboard</h1>
            
            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
                <div className='bg-white border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center gap-3'>
                        <img className='w-12' src={assets.doctor_icon} alt="Doctors" />
                        <div>
                            <p className='text-2xl font-semibold'>{topDoctors.length}</p>
                            <p className='text-gray-600 text-sm'>Total Doctors</p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-white border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center gap-3'>
                        <img className='w-12' src={assets.patients_icon} alt="Patients" />
                        <div>
                            <p className='text-2xl font-semibold'>{appointments.length}</p>
                            <p className='text-gray-600 text-sm'>Total Patients</p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-white border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center gap-3'>
                        <img className='w-12' src={assets.appointments_icon} alt="Appointments" />
                        <div>
                            <p className='text-2xl font-semibold'>{stats.total}</p>
                            <p className='text-gray-600 text-sm'>Total Appointments</p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-white border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center gap-3'>
                        <img className='w-12' src={assets.earning_icon} alt="Earnings" />
                        <div>
                            <p className='text-2xl font-semibold'>${stats.totalEarnings.toLocaleString()}</p>
                            <p className='text-gray-600 text-sm'>Total Earnings</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
                <div className='bg-primary/10 border border-primary/20 rounded-lg p-4'>
                    <p className='text-xl font-semibold text-primary'>${stats.monthlyEarnings.toLocaleString()}</p>
                    <p className='text-gray-600 text-sm'>Monthly Earnings</p>
                </div>
                
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                    <p className='text-xl font-semibold text-green-600'>{stats.scheduled}</p>
                    <p className='text-gray-600 text-sm'>Scheduled</p>
                </div>
                
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-xl font-semibold text-red-600'>{stats.cancelled}</p>
                    <p className='text-gray-600 text-sm'>Cancelled</p>
                </div>
                
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <p className='text-xl font-semibold text-blue-600'>{stats.completed}</p>
                    <p className='text-gray-600 text-sm'>Completed</p>
                </div>
            </div>

            {/* Recent Appointments & Top Doctors */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
                {/* Recent Appointments */}
                <div className='bg-white border border-gray-200 rounded-lg p-6'>
                    <h2 className='text-lg font-semibold mb-4'>Recent Appointments</h2>
                    {loading ? (
                        <div className='flex justify-center items-center h-32'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                        </div>
                    ) : recentAppointments.length === 0 ? (
                        <div className='text-center py-8 text-gray-500'>
                            No appointments yet
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {recentAppointments.map((appointment, index) => (
                                <div key={appointment._id} className='flex items-center justify-between p-3 border border-gray-100 rounded-lg'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                                            <span className='text-primary text-sm font-medium'>
                                                {appointment.userData.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='font-medium text-sm'>{appointment.userData.name}</p>
                                            <p className='text-xs text-gray-600'>{appointment.docData.name}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-sm font-medium'>{appointment.slotDate}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            appointment.cancelled ? 'bg-red-100 text-red-600' :
                                            appointment.isCompleted ? 'bg-green-100 text-green-600' :
                                            'bg-blue-100 text-blue-600'
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
                <div className='bg-white border border-gray-200 rounded-lg p-6'>
                    <h2 className='text-lg font-semibold mb-4'>Top Performing Doctors</h2>
                    {loading ? (
                        <div className='flex justify-center items-center h-32'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                        </div>
                    ) : topDoctors.length === 0 ? (
                        <div className='text-center py-8 text-gray-500'>
                            No doctor data available
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {topDoctors.map((doctor, index) => (
                                <div key={index} className='flex items-center justify-between p-3 border border-gray-100 rounded-lg'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                                            <span className='text-primary text-sm font-medium'>
                                                {doctor.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='font-medium text-sm'>{doctor.name}</p>
                                            <p className='text-xs text-gray-600'>{doctor.speciality}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-sm font-medium'>${doctor.earnings.toLocaleString()}</p>
                                        <p className='text-xs text-gray-600'>{doctor.appointments} appointments</p>
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
