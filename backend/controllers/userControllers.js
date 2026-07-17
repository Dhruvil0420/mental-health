import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary'; 


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: 'Please enter all fields'
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please enter a valid email'
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Password must be at least 8 characters'
            });

        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists'
            });
        }

        const userData = {
            name,
            email,
            password: hashedPassword
        };

        const newUser = new userModel(userData)
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            success: true,
            message: 'User registered successfully',
            token
        });



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Please enter all fields'
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({
                success: true,
                message: 'User logged in successfully',
                token
            });
        } else {
            return res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API for getting user profile data

const getProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        if (!userId) {
            return res.json({ success: false, message: 'Missing userId' });
        }
        const userData = await userModel.findById(userId).select("-password");

        res.json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}
//API for updating user profile data

const updateProfile = async (req, res) => {
    try {
        const bodyUserId = req.body?.userId;
        const userId = req.userId || bodyUserId;
        const { name,phone,address,dob,gender } = req.body;
        const imageFile = req.file || null;
        

        if(!name || !phone || !dob || !gender){
            return res.json({
                success: false,
                message: 'Data is missing'
            });
        }
        if (!userId) {
            return res.json({ success: false, message: 'Missing userId' });
        }
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: typeof address === 'string' ? JSON.parse(address) : address,
            dob,   
            gender
        });
        if(imageFile){
            // upload image to cloudinary and get the url
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'});
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, {
                image: imageURL
            });
            
        }

        const updatedUser = await userModel.findById(userId).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { registerUser, loginUser , getProfile, updateProfile  }