import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
import { sendAppointmentBookingEmail, sendAppointmentCancellationEmail } from '../config/nodemailer.js';

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

        // Send booking confirmation email
        await sendAppointmentBookingEmail(user.email, newAppointment);

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

// API to manually mark appointment as paid (for admin)
const markPaidAppointment = async (req, res) => {
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

        appointment.payment = true;
        await appointment.save();

        // Send booking confirmation email showing Paid status
        if (appointment.userData && appointment.userData.email) {
            await sendAppointmentBookingEmail(appointment.userData.email, appointment);
        }

        res.json({ 
            success: true, 
            message: 'Appointment marked as paid manually' 
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// API to submit rating and review for completed appointment (for user)
const submitReview = async (req, res) => {
    try {
        const { appointmentId, rating, comment } = req.body;
        const userId = req.body.userId; // injected by authUser middleware

        if (!appointmentId || !rating) {
            return res.json({ 
                success: false, 
                message: 'Appointment ID and rating are required' 
            });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        // Verify if appointment belongs to user
        if (appointment.userId.toString() !== userId.toString()) {
            return res.json({ 
                success: false, 
                message: 'Unauthorized access to this appointment' 
            });
        }

        // Verify if appointment is completed
        if (!appointment.isCompleted) {
            return res.json({ 
                success: false, 
                message: 'Only completed appointments can be reviewed' 
            });
        }

        // Verify if already reviewed
        if (appointment.isReviewed) {
            return res.json({ 
                success: false, 
                message: 'Appointment is already reviewed' 
            });
        }

        // Update appointment review
        appointment.rating = Number(rating);
        appointment.comment = comment || "";
        appointment.isReviewed = true;
        await appointment.save();

        // Recalculate doctor ratings
        const docId = appointment.docId;
        const reviews = await appointmentModel.find({ docId, isReviewed: true });
        const totalReviews = reviews.length;
        const sumRatings = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 0;

        await doctorModel.findByIdAndUpdate(docId, {
            averageRating,
            totalReviews
        });

        res.json({ 
            success: true, 
            message: 'Thank you! Review submitted successfully.' 
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
    getAllAppointments,
    markPaidAppointment,
    submitReview
};
