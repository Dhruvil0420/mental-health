import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        if (!userId || !docId || !slotDate || !slotTime) {
            return res.json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.json({ 
                success: false, 
                message: 'Doctor not found' 
            });
        }

        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if slot is already booked
        const existingAppointment = await appointmentModel.findOne({
            docId,
            slotDate,
            slotTime,
            cancelled: false
        });

        if (existingAppointment) {
            return res.json({ 
                success: false, 
                message: 'Slot already booked' 
            });
        }

        // Create appointment
        const appointmentData = {
            userId,
            docId,
            slotDate,
            slotTime,
            userData: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            docData: {
                name: doctor.name,
                speciality: doctor.speciality,
                degree: doctor.degree,
                fees: doctor.fees,
                image: doctor.image
            },
            amount: doctor.fees,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        res.json({ 
            success: true, 
            message: 'Appointment booked successfully',
            appointment: newAppointment
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// API to get user appointments
const getUserAppointments = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const appointments = await appointmentModel.find({ userId })
            .populate('docId')
            .sort({ date: -1 });

        // Update docData with doctor image if not already present
        const updatedAppointments = appointments.map(apt => {
            if (apt.docId && apt.docId.image) {
                apt.docData.image = apt.docId.image;
            }
            return apt;
        });

        res.json({ 
            success: true, 
            appointments: updatedAppointments 
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.json({ 
                success: false, 
                message: 'Appointment ID required' 
            });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        appointment.cancelled = true;
        await appointment.save();

        res.json({ 
            success: true, 
            message: 'Appointment cancelled successfully' 
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// API to mark appointment as completed
const completeAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.json({ 
                success: false, 
                message: 'Appointment ID required' 
            });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        appointment.isCompleted = true;
        appointment.payment = true;
        await appointment.save();

        res.json({ 
            success: true, 
            message: 'Appointment marked as completed' 
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// API to get doctor appointments (for admin)
const getDoctorAppointments = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.json({ 
                success: false, 
                message: 'Doctor ID required' 
            });
        }

        const appointments = await appointmentModel.find({ docId })
            .populate('userId')
            .sort({ date: -1 });

        res.json({ 
            success: true, 
            appointments 
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// API to get all appointments (for admin)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
            .populate('userId')
            .populate('docId')
            .sort({ date: -1 });

        // Update docData with doctor image if not already present
        const updatedAppointments = appointments.map(apt => {
            if (apt.docId && apt.docId.image) {
                apt.docData.image = apt.docId.image;
            }
            return apt;
        });

        res.json({ 
            success: true, 
            appointments: updatedAppointments 
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export { 
    bookAppointment, 
    getUserAppointments, 
    cancelAppointment, 
    completeAppointment,
    getDoctorAppointments,
    getAllAppointments 
};
