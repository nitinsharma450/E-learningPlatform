import mongoose from "mongoose";

const adminProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: "admin" },
    profilePicture: { type: String, default: "" } // URL or base64 string
}, { timestamps: true });

const adminProfile = mongoose.model("AdminProfile", adminProfileSchema);
export default adminProfile;
