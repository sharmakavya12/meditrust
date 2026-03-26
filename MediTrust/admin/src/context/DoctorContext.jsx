import { useState, useEffect } from "react";
import { createContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);
    useEffect(() => {
        if (dToken) {
            localStorage.setItem('dToken', dToken);
            console.log(" dToken saved to localStorage");
        } else {
            localStorage.removeItem('dToken');
            console.log(" dToken removed from localStorage");
        }
    }, [dToken]);

    useEffect(() => {
        if (dToken) {
            console.log("dToken available");
            getAppointments();
            getDashData();
            getProfileData();
        }
    }, [dToken]);
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: { Authorization: `Bearer ${dToken}` } });
            if (data.success) {
                setAppointments(data.appointments);
                console.log(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const appointmentComplete = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, { headers: { Authorization: `Bearer ${dToken}` } });
            if (data.success) {
                await getAppointments();
                await getDashData();
                console.log(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const appointmentCancel = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, { headers: { Authorization: `Bearer ${dToken}` } });
            if (data.success) {
                await getAppointments();
                await getDashData();
                console.log(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers: { Authorization: `Bearer ${dToken}` } });
            if (data.success) {
                setDashData(data.dashData);
                console.log("Dashboard data updated");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { Authorization: `Bearer ${dToken}` } });
            if (data.success) {
                setProfileData(data.profileData);
                console.log(data.profileData);
                console.log("Profile data loaded");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Auto fetch dashboard whenever appointments change
    useEffect(() => {
        if (dToken) {
            getDashData();
        }
    }, [appointments, dToken]);

    const value = {
        dToken,
        setDToken,
        backendUrl,
        getAppointments,
        appointments,
        setAppointments,
        appointmentComplete,
        appointmentCancel,
        dashData,
        setDashData,
        getDashData,
        getProfileData, 
        setProfileData,
        profileData,
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;


