import express from 'express';
import { bookAppointment, getUserAppointments, cancelAppointment, completeAppointment, getDoctorAppointments, getAllAppointments, markPaidAppointment, submitReview } from '../controllers/appointmentControllers.js';
import authUser from '../middlewares/authUser.js';
import authAdmin from '../middlewares/authAdmin.js';

const appointmentRouter = express.Router();

// Book appointment
appointmentRouter.post('/book', authUser, bookAppointment);

// Get user appointments
appointmentRouter.post('/get-user-appointments', authUser, getUserAppointments);

// Cancel appointment
appointmentRouter.post('/cancel', authUser, cancelAppointment);

// Submit doctor rating and review
appointmentRouter.post('/submit-review', authUser, submitReview);

// Complete appointment (for admin/doctor)
appointmentRouter.post('/complete', authAdmin, completeAppointment);

// Mark paid (for admin)
appointmentRouter.post('/mark-paid', authAdmin, markPaidAppointment);

// Get doctor appointments (for admin)
appointmentRouter.post('/get-doctor-appointments', authAdmin, getDoctorAppointments);

// Get all appointments (for admin)
appointmentRouter.post('/get-all', authAdmin, getAllAppointments);

export default appointmentRouter;
