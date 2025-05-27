import { Request, Response, NextFunction } from 'express';
import Owner from '../../models/owner/owner.model.js';
import upload from '../../config/Multer.config.js';
import School from '../../models/school/school.model.js';
import CustomError from '../../utils/CustomError.js';
import emailHtmlTemplate from "../../utils/EmailHTMLTemplate.js";
import GenerateOTP from "../../utils/GenerateOtp.js";
import Otp from "../../models/otp/otp.model.js";
import SendEmail from "../../utils/SendEmail.js";
import cleanOtp from "../../helper/CleanOtp.js";
import AsyncHandler from "../../utils/AsyncHandler.js";
import {uploadBufferToCloudinary} from '../../helper/BufferCloudinary.js';

export const registerOwner = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      plan,
      name,
      city,
      address,
      contactNumber,
      type,
      role
    } = req.body;

    // Check if owner already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return next(new CustomError("Email already registered", 400, { attemptedEmail: email }));
    }

    // Handle profile image
   let profileUrl = undefined;
    if (req.file) {
      profileUrl = await uploadBufferToCloudinary(req.file.buffer, 'owners');
    }
    if (!profileUrl) {
      return next(new CustomError("Profile image upload failed", 422, { attemptedEmail: email }));
    }
    // Create the new owner
    const owner = await Owner.create({
      fullName,
      email,
      phone,
      password,
      profile: profileUrl,
      plan: plan || 'free',
      role
    });

    if (!owner) {
      return next(new CustomError("Owner not created", 400, { attemptedEmail: email }));
    }

    // Create the school
    const school = await School.create({
      name,
      city,
      address,
      contactNumber,
      type,
      owner: owner._id,
    });

    if (!school) {
      return next(new CustomError("School not created", 400, { attemptedEmail: email }));
    }

    // Clean old OTPs for this owner
await cleanOtp(owner._id, owner.role);
    // Generate OTP
    const ownerOtp = GenerateOTP();

    // Send email and store OTP
    try {
      const info = await SendEmail(
        owner.email,
        "OTP verification",
        emailHtmlTemplate(owner.fullName, ownerOtp)
      );
      if (info) {
        const otp = await Otp.create({
          email: owner._id,
          otp: ownerOtp,
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
          lastOtpSentAt: new Date(),
        });
        if (!otp) {
          return next(new CustomError("Otp not created", 422, { attemptedEmail: email }));
        }
      }
    } catch (error) {
      return next(new CustomError("Email send failed", 423, { attemptedEmail: email }));
    }

    res.status(201).json({
      message: 'Owner registered successfully',
      owner: {
        _id: owner._id,
        fullName: owner.fullName,
        email: owner.email,
        phone: owner.phone,
        profile: owner.profile,
        plan: owner.plan,
        role: owner.role,
      },
      school: {
        _id: school._id,
        name: school.name,
        city: school.city,
        address: school.address,
        contactNumber: school.contactNumber,
        type: school.type,
        owner: owner._id
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});