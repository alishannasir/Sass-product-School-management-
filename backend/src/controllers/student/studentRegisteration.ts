import { Request, Response, NextFunction } from 'express';
import Student from '../../models/student/student.model.js';
import School from '../../models/school/school.model.js';
import CustomError from '../../utils/CustomError.js';
import AsyncHandler from "../../utils/AsyncHandler.js";
import { uploadBufferToCloudinary } from '../../helper/BufferCloudinary.js';
import GenerateOTP from "../../utils/GenerateOtp.js";
import Otp from "../../models/otp/otp.model.js";
import SendEmail from "../../utils/SendEmail.js";
import emailHtmlTemplate from "../../utils/EmailHTMLTemplate.js";
import bcrypt from 'bcryptjs';

export const registerStudent = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      FullName,
      AdmissionNumber,
      email,
      phone,
      class: studentClass,
      JoiningDate,
      LeavingDate,
      schoolName,
      role,
      password
    } = req.body;

    const admissionNumberNum = Number(AdmissionNumber);
    const joiningDateObj = JoiningDate ? new Date(JoiningDate) : undefined;
    const leavingDateObj = LeavingDate ? new Date(LeavingDate) : undefined;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return next(new CustomError("Email already registered", 400, { attemptedEmail: email }));
    }

    const school = await School.findOne({ name: { $regex: new RegExp(`^${schoolName}$`, 'i') } });
    if (!school) {
      const similarSchools = await School.find({ name: { $regex: schoolName, $options: 'i' } });
      let suggestion = '';
      if (similarSchools.length > 0) {
        suggestion = `Did you mean: ${similarSchools.map(s => s.name).join(', ')}?`;
      }
      return next(new CustomError(`School "${schoolName}" not found. ${suggestion}`, 404, { schoolName }));
    }

    let profileUrl = undefined;
    if (req.file) {
      profileUrl = await uploadBufferToCloudinary(req.file.buffer, 'students');
    }
    if (req.file && !profileUrl) {
      return next(new CustomError("Profile image upload failed", 422, { attemptedEmail: email }));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      FullName,
      AdmissionNumber: admissionNumberNum,
      email,
      phone,
      class: studentClass,
      JoiningDate: joiningDateObj,
      LeavingDate: leavingDateObj,
      school: school._id,
      profile: profileUrl,
      role,
      password: hashedPassword
    });

    if (!student) {
      return next(new CustomError("Student not created", 400, { attemptedEmail: email }));
    }

    const studentOtp = GenerateOTP();
    await SendEmail(
      student.email,
      "Student OTP verification",
      emailHtmlTemplate(student.FullName, studentOtp)
    );

    await Otp.create({
      email: student._id,
      otp: studentOtp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      lastOtpSentAt: new Date(),
    });

    res.status(201).json({
      message: 'Student registered successfully',
      student: {
        _id: student._id,
        FullName: student.FullName,
        AdmissionNumber: student.AdmissionNumber,
        email: student.email,
        phone: student.phone,
        class: student.class,
        JoiningDate: student.JoiningDate,
        LeavingDate: student.LeavingDate,
        profile: student.profile,
        school: {
          _id: school._id,
          name: school.name
        },
        role: student.role
      }
    });

  } catch (error) {
    console.error('Student registration error:', error);
    next(error);
  }
});