import mongoose, { Schema, Document, Types } from "mongoose";

// Use ObjectId for references
export interface IOtp extends Document {
  email: Types.ObjectId; // Reference to Owner
  otp: string;
  otpExpiry: Date;
  lastOtpSentAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    lastOtpSentAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model<IOtp>("Otp", otpSchema);
export default Otp;