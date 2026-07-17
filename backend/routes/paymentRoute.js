import express from 'express';
import { createCheckoutSession, verifyStripePayment } from '../controllers/paymentControllers.js';
import authUser from '../middlewares/authUser.js';

const paymentRouter = express.Router();

// Route to create Stripe checkout session (protected)
paymentRouter.post('/create-session', authUser, createCheckoutSession);

// Route to verify Stripe payment (protected)
paymentRouter.post('/verify', authUser, verifyStripePayment);

export default paymentRouter;
