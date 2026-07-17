import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'admin'
    },
    permissions: {
        type: [String],
        default: ['manage_doctors', 'manage_appointments', 'view_dashboard']
    }
}, { minimize: false });

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema);

export default adminModel;
