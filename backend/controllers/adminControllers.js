import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import adminModel from '../models/adminModel.js'
import jwt from 'jsonwebtoken'


// API for admin registration
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.json({
                success: false,
                message: "Admin with this email already exists"
            });
        }

        // Validate input
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter a strong password (min 8 characters)"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create admin
        const newAdmin = new adminModel({
            name,
            email,
            password: hashedPassword
        })

        await newAdmin.save()

        res.json({
            success: true,
            message: "Admin registered successfully"
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// =========================
// API for adding doctors
// =========================
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address
        } = req.body

        const imageFile = req.file

        // ✅ Check required fields
        if (
            !name || !email || !password || !speciality ||
            !degree || !experience || !about || !fees || !address
        ) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // ✅ Check image
        if (!imageFile) {
            return res.json({ success: false, message: "Image is required" })
        }

        // ✅ Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // ✅ Validate password
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        // ✅ Check if doctor already exists
        const existingDoctor = await doctorModel.findOne({ email })
        if (existingDoctor) {
            return res.json({ success: false, message: "Doctor already exists" })
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // ✅ Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        })

        const imageUrl = imageUpload.secure_url

        // ✅ Safe address parsing
        let parsedAddress
        try {
            parsedAddress = typeof address === "string" ? JSON.parse(address) : address
        } catch {
            return res.json({ success: false, message: "Invalid address format" })
        }

        // ✅ Save doctor
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor added successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin login

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find admin by email
        const admin = await adminModel.findOne({ email });
        
        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        
        if (isMatch) {
            const token = jwt.sign(
                { 
                    id: admin._id,
                    email: admin.email,
                    role: admin.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            )

            res.json({
                success: true,
                message: "Admin logged in successfully",
                token
            })
        } else {
            res.json({
                success: false,
                message: "Invalid password"
            })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')

        res.json({
            success: true,
            doctors
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



// Export APIs
export { addDoctor, loginAdmin, allDoctors,registerAdmin }