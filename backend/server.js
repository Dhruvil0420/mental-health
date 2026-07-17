import express from 'express';
import cors from 'cors';
import 'dotenv/config'
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

connectDB()
connectCloudinary()

// Stripe Webhook Endpoint (requires raw request body for signature verification)
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

//middlewares

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
