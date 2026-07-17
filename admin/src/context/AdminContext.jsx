import React, { createContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

// ✅ Create context ONLY ONCE
export const AdminContext = createContext(null);
const AdminContextProvider = ({ children }) => {

    const [aToken, setAToken] = useState(localStorage.getItem('token') || "");
    const [doctors, setDoctors] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Validate token on app load
    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Test the token by making a simple API call
                    await axios.post(`${backendUrl}/api/admin/all-doctors`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    // If successful, token is valid
                    setAToken(token);
                } catch (error) {
                    // If failed, token is invalid, clear it
                    console.log('Invalid token, clearing...');
                    localStorage.removeItem('token');
                    setAToken(false);
                }
            }
        };

        validateToken();
    }, [backendUrl]);

    // Get all doctors
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/all-doctors`,
                {},
                {
                    headers: { Authorization: `Bearer ${aToken}` }
                }
            );

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Change availability
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`,
                { docId },
                {
                    headers: { Authorization: `Bearer ${aToken}` }
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Save token

    const saveToken = (token) => {
        localStorage.setItem('token', token);
        setAToken(token);
    };

    // Logout

    const logout = () => {
        localStorage.removeItem('token');
        setAToken("");
    };

    const value = {
        aToken,
        setAToken,
        saveToken,
        logout,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;