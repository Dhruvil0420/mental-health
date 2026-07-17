import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get all appointments for admin
    const getAllAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(backendUrl + '/api/appointment/get-all', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
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

    const value = {
        backendUrl,
        token,
        setToken,
        appointments,
        loading,
        getAllAppointments,
        cancelAppointment,
        completeAppointment,
        getAppointmentStats
    };

    useEffect(() => {
        if (token) {
            getAllAppointments();
        }
    }, [token]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;