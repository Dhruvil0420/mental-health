import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';
import { stripeWebhookHandler } from './controllers/paymentControllers.js';
import paymentRouter from './routes/paymentRoute.js';



// app config 
const app = express()
const port = process.env.PORT || 4000

// Rate limiting middleware configuration (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB()
connectCloudinary()

// Stripe Webhook Endpoint (requires raw request body for signature verification)
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

//middlewares
app.use(helmet());
app.use(limiter);
app.use(express.json()) 
app.use(cors())


//api end Point

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/appointment',appointmentRouter)
app.use('/api/payment',paymentRouter)
//localhost:4000/api/admin

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port, () => console.log("server Started",port))
