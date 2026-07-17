import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const mentalHealthSpecialities = [
        'Psychiatrist',
        'Clinical Psychologist',
        'Counselling Psychologist',
        'Psychotherapist',
        'Child & Adolescent Psychiatrist',
        'Addiction Psychiatrist'
    ];

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false);

    

    // ✅ Fetch doctors
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list');

            if (data.success) {
                const filteredDoctors = data.doctors.filter((doctor) =>
                    mentalHealthSpecialities.includes(doctor.speciality)
                );
                setDoctors(filteredDoctors);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: {
                    token
                }
            });

            if (data.success) {
                const userData = data.user || data.userData;
                setUserData(userData);
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl ,
        userData,setUserData,
        loadUserProfileData
    };

    // ✅ Run on load
    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }
        else{
            setUserData(false);
        }
    },[token])
    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;