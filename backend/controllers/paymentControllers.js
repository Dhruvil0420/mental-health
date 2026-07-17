import Stripe from 'stripe';
import appointmentModel from '../models/appointmentModel.js';

// Initialize stripe with secret key from env variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.body.userId || req.userId;

        if (!appointmentId) {
            return res.json({ success: false, message: 'Appointment ID is required' });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // Verify if appointment belongs to user
        if (appointment.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized access to this appointment' });
        }

        if (appointment.payment) {
            return res.json({ success: false, message: 'Appointment is already paid' });
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: 'Appointment has been cancelled' });
        }

        const origin = req.headers.origin || 'http://localhost:5173';

        // Stripe expects amount in cents
        const unitAmount = Math.round(appointment.amount * 100);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Appointment with ${appointment.docData.name}`,
                            description: `Date: ${appointment.slotDate} | Time: ${appointment.slotTime}`,
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&appointmentId=${appointmentId}`,
            cancel_url: `${origin}/payment-cancel?appointmentId=${appointmentId}`,
        });

        // Store the session ID in the appointment
        appointment.stripeSessionId = session.id;
        await appointment.save();

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe Checkout Session payment status
export const verifyStripePayment = async (req, res) => {
    try {
        const { session_id, appointmentId } = req.body;
        const userId = req.body.userId || req.userId;

        if (!session_id || !appointmentId) {
            return res.json({ success: false, message: 'Missing session_id or appointmentId' });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // Verify if appointment belongs to user
        if (appointment.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized access' });
        }

        // If payment status is already updated
        if (appointment.payment) {
            return res.json({ success: true, message: 'Payment already verified' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            appointment.payment = true;
            await appointment.save();
            return res.json({ success: true, message: 'Payment verified and completed successfully' });
        } else {
            return res.json({ success: false, message: 'Payment has not been completed' });
        }

    } catch (error) {
        console.error('Error verifying Stripe payment:', error);
        res.json({ success: false, message: error.message });
    }
};

// Stripe Webhook Handler for checkout.session.completed
export const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // req.body must be raw string/buffer for verification to succeed
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            const appointment = await appointmentModel.findOne({ stripeSessionId: session.id });
            if (appointment) {
                appointment.payment = true;
                await appointment.save();
                console.log(`Webhook: Appointment ${appointment._id} marked as paid successfully`);
            } else {
                console.warn(`Webhook: No appointment found matching session ID ${session.id}`);
            }
        } catch (error) {
            console.error('Error updating appointment in webhook:', error);
            return res.status(500).send(`Database error: ${error.message}`);
        }
    }

    res.json({ received: true });
};
