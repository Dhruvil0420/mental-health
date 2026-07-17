import add_icon from './add_icon.svg'
import admin_logo from './admin_logo.svg'
import appointment_icon from './appointment_icon.svg'
import cancel_icon from './cancel_icon.svg'
import doctor_icon from './doctor_icon.svg'
import home_icon from './home_icon.svg'
import people_icon from './people_icon.svg'
import upload_area from './upload_area.svg'
import list_icon from './list_icon.svg'
import tick_icon from './tick_icon.svg'
import appointments_icon from './appointments_icon.svg'
import earning_icon from './earning_icon.svg'
import patients_icon from './patients_icon.svg'

export const assets = {
    add_icon,
    admin_logo,
    appointment_icon,
    cancel_icon,
    doctor_icon,
    upload_area,
    home_icon,
    patients_icon,
    people_icon,
    list_icon,
    tick_icon,
    appointments_icon,
    earning_icon
}

// Dashboard Statistics
export const dashboardStats = {
    totalDoctors: 15,
    totalPatients: 1247,
    totalAppointments: 3421,
    totalEarnings: 284750,
    monthlyEarnings: 45230,
    newPatients: 89,
    cancelledAppointments: 23,
    completedAppointments: 3398
}

// Recent Appointments
export const recentAppointments = [
    {
        id: 'APT001',
        patientName: 'Sarah Johnson',
        doctorName: 'Dr. Maya Sharma',
        speciality: 'Psychiatrist',
        date: '2024-01-15',
        time: '10:30 AM',
        status: 'Completed',
        fees: 90
    },
    {
        id: 'APT002',
        patientName: 'Michael Chen',
        doctorName: 'Dr. Arjun Mehta',
        speciality: 'Clinical Psychologist',
        date: '2024-01-15',
        time: '2:00 PM',
        status: 'Completed',
        fees: 75
    },
    {
        id: 'APT003',
        patientName: 'Emma Wilson',
        doctorName: 'Dr. Nisha Verma',
        speciality: 'Counselling Psychologist',
        date: '2024-01-15',
        time: '3:30 PM',
        status: 'Cancelled',
        fees: 55
    },
    {
        id: 'APT004',
        patientName: 'James Anderson',
        doctorName: 'Dr. Karan Iyer',
        speciality: 'Psychotherapist',
        date: '2024-01-16',
        time: '11:00 AM',
        status: 'Scheduled',
        fees: 70
    },
    {
        id: 'APT005',
        patientName: 'Sophia Martinez',
        doctorName: 'Dr. Riya Kapoor',
        speciality: 'Child & Adolescent Psychiatrist',
        date: '2024-01-16',
        time: '9:00 AM',
        status: 'Scheduled',
        fees: 95
    }
]

// All Appointments
export const allAppointments = [
    {
        id: 'APT001',
        patientName: 'Sarah Johnson',
        patientEmail: 'sarah.j@email.com',
        patientPhone: '+1-234-567-8901',
        doctorName: 'Dr. Maya Sharma',
        speciality: 'Psychiatrist',
        date: '2024-01-15',
        time: '10:30 AM',
        status: 'Completed',
        fees: 90,
        paymentStatus: 'Paid'
    },
    {
        id: 'APT002',
        patientName: 'Michael Chen',
        patientEmail: 'michael.chen@email.com',
        patientPhone: '+1-234-567-8902',
        doctorName: 'Dr. Arjun Mehta',
        speciality: 'Clinical Psychologist',
        date: '2024-01-15',
        time: '2:00 PM',
        status: 'Completed',
        fees: 75,
        paymentStatus: 'Paid'
    },
    {
        id: 'APT003',
        patientName: 'Emma Wilson',
        patientEmail: 'emma.w@email.com',
        patientPhone: '+1-234-567-8903',
        doctorName: 'Dr. Nisha Verma',
        speciality: 'Counselling Psychologist',
        date: '2024-01-15',
        time: '3:30 PM',
        status: 'Cancelled',
        fees: 55,
        paymentStatus: 'Refunded'
    },
    {
        id: 'APT004',
        patientName: 'James Anderson',
        patientEmail: 'james.a@email.com',
        patientPhone: '+1-234-567-8904',
        doctorName: 'Dr. Karan Iyer',
        speciality: 'Psychotherapist',
        date: '2024-01-16',
        time: '11:00 AM',
        status: 'Scheduled',
        fees: 70,
        paymentStatus: 'Pending'
    },
    {
        id: 'APT005',
        patientName: 'Sophia Martinez',
        patientEmail: 'sophia.m@email.com',
        patientPhone: '+1-234-567-8905',
        doctorName: 'Dr. Riya Kapoor',
        speciality: 'Child & Adolescent Psychiatrist',
        date: '2024-01-16',
        time: '9:00 AM',
        status: 'Scheduled',
        fees: 95,
        paymentStatus: 'Paid'
    },
    {
        id: 'APT006',
        patientName: 'David Brown',
        patientEmail: 'david.b@email.com',
        patientPhone: '+1-234-567-8906',
        doctorName: 'Dr. Vivek Rao',
        speciality: 'Addiction Psychiatrist',
        date: '2024-01-16',
        time: '1:30 PM',
        status: 'Scheduled',
        fees: 100,
        paymentStatus: 'Pending'
    },
    {
        id: 'APT007',
        patientName: 'Lisa Garcia',
        patientEmail: 'lisa.g@email.com',
        patientPhone: '+1-234-567-8907',
        doctorName: 'Dr. Sneha Bhat',
        speciality: 'Psychiatrist',
        date: '2024-01-17',
        time: '10:00 AM',
        status: 'Scheduled',
        fees: 85,
        paymentStatus: 'Paid'
    },
    {
        id: 'APT008',
        patientName: 'Robert Taylor',
        patientEmail: 'robert.t@email.com',
        patientPhone: '+1-234-567-8908',
        doctorName: 'Dr. Neel Joshi',
        speciality: 'Clinical Psychologist',
        date: '2024-01-17',
        time: '3:00 PM',
        status: 'Scheduled',
        fees: 65,
        paymentStatus: 'Pending'
    }
]

// Monthly Revenue Data
export const monthlyRevenue = [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 38000 },
    { month: 'Mar', revenue: 45000 },
    { month: 'Apr', revenue: 52000 },
    { month: 'May', revenue: 48000 },
    { month: 'Jun', revenue: 55000 },
    { month: 'Jul', revenue: 51000 },
    { month: 'Aug', revenue: 49000 },
    { month: 'Sep', revenue: 53000 },
    { month: 'Oct', revenue: 58000 },
    { month: 'Nov', revenue: 62000 },
    { month: 'Dec', revenue: 45000 }
]

// Top Performing Doctors
export const topDoctors = [
    {
        name: 'Dr. Maya Sharma',
        speciality: 'Psychiatrist',
        appointments: 156,
        earnings: 14040,
        rating: 4.8
    },
    {
        name: 'Dr. Riya Kapoor',
        speciality: 'Child & Adolescent Psychiatrist',
        appointments: 142,
        earnings: 13490,
        rating: 4.9
    },
    {
        name: 'Dr. Vivek Rao',
        speciality: 'Addiction Psychiatrist',
        appointments: 128,
        earnings: 12800,
        rating: 4.7
    },
    {
        name: 'Dr. Karan Iyer',
        speciality: 'Psychotherapist',
        appointments: 119,
        earnings: 8330,
        rating: 4.6
    }
]
