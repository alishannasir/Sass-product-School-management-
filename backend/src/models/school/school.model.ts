import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for the School document
export interface ISchool extends Document {
    name: string;
    city: string;
    address: string;
    contactNumber: string;
    type: string;
    owner: Types.ObjectId; // Reference to the Owner model
}

// Define the Mongoose schema
const schoolSchema = new Schema<ISchool>(
    {
        name: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Owner", // Reference to the Owner model
        },
    },
    { timestamps: true }
);

// Create the Mongoose model
const School = mongoose.model<ISchool>("School", schoolSchema);

export default School;