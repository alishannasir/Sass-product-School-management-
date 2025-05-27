import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for the Teacher document
export interface ITeacher extends Document {
    FullName: string;
    EmployeeId: number;
    email: string;
    phone: string;
    subject: string;
    JoiningDate: Date;
    LeavingDate: Date;
    school: Types.ObjectId; // Reference to the School model
    isVerify: boolean; // <-- Add this line
    profile?: string; // Profile picture URL
    role: string; // Role of the teacher
    password: string; // <-- Add this line

}

// Define the Mongoose schema
const teacherSchema = new Schema<ITeacher>(
    {
        FullName: {
            type: String,
            required: true,
        },
        EmployeeId: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        JoiningDate: {
            type: Date,
            required: true,
        },
        LeavingDate: {
            type: Date,
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: "School", // Reference to the School model
          
        },
          isVerify: {
            type: Boolean,
            default: false, 
        },
        profile: {
            type: String, // URL to profile picture
        },
        role: {
            type: String,
            enum: ['Teacher', 'Owner', 'Student', 'Parent'],
            required: true
        },
           password: { // <-- Add this block
            type: String,
            required: true,
            // select: false // Hide password by default in queries
        }
    },
    { timestamps: true }
);

// Create the Mongoose model
const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);

export default Teacher;