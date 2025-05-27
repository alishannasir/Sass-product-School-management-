import { Request, Response, NextFunction } from 'express';
import Teacher from '../../models/teacher/teacher.model.js';
import School from '../../models/school/school.model.js';
import CustomError from '../../utils/CustomError.js';
import AsyncHandler from "../../utils/AsyncHandler.js";
import { uploadBufferToCloudinary } from '../../helper/BufferCloudinary.js';
import GenerateOTP from "../../utils/GenerateOtp.js";
import Otp from "../../models/otp/otp.model.js";
import SendEmail from "../../utils/SendEmail.js";
import emailHtmlTemplate from "../../utils/EmailHTMLTemplate.js";
import bcrypt from 'bcryptjs';

export const registerTeacher = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
     const {
      FullName,
      EmployeeId,
      email,
      phone,
      subject,
      JoiningDate,
      LeavingDate,
      schoolName,
      role,
      password
    } = req.body;
   

        // Convert types as needed
    const employeeIdNum = Number(EmployeeId);
    const joiningDateObj = JoiningDate ? new Date(JoiningDate) : undefined;
    const leavingDateObj = LeavingDate ? new Date(LeavingDate) : undefined;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return next(new CustomError("Email already registered", 400, { attemptedEmail: email }));
    }

    // Find school by name (case-insensitive)
    const school = await School.findOne({ name: { $regex: new RegExp(`^${schoolName}$`, 'i') } });
    if (!school) {
      // Suggest similar school names if spelling error
      const similarSchools = await School.find({ name: { $regex: schoolName, $options: 'i' } });
      let suggestion = '';
      if (similarSchools.length > 0) {
        suggestion = `Did you mean: ${similarSchools.map(s => s.name).join(', ')}?`;
      }
      return next(new CustomError(`School "${schoolName}" not found. ${suggestion}`, 404, { schoolName }));
    }

    // Handle profile image
    let profileUrl = undefined;
    if (req.file) {
      profileUrl = await uploadBufferToCloudinary(req.file.buffer, 'teachers');
    }
    if (req.file && !profileUrl) {
      return next(new CustomError("Profile image upload failed", 422, { attemptedEmail: email }));
    }
     

 // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create the new teacher
   
    const teacher = await Teacher.create({
      FullName,
      EmployeeId: employeeIdNum,
      email,
      phone,
      subject,
      JoiningDate: joiningDateObj,
      LeavingDate: leavingDateObj,
      schoolName: school._id,
      profile: profileUrl,
      role,
      password: hashedPassword // Store hashed password
    });

    if (!teacher) {
      return next(new CustomError("Teacher not created", 400, { attemptedEmail: email }));
    }
    console.log("TEACHER email", teacher.email)
        const teacherOtp = GenerateOTP();
          await SendEmail(
            teacher.email,
            "Teacher OTP verification",
            emailHtmlTemplate(teacher.FullName, teacherOtp)
            );

         await Otp.create({
            email: teacher._id,
            otp: teacherOtp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
            lastOtpSentAt: new Date(),
            });

    res.status(201).json({
      message: 'Teacher registered successfully',
      teacher: {
        _id: teacher._id,
        FullName: teacher.FullName,
        EmployeeId: teacher.EmployeeId,
        email: teacher.email,
        phone: teacher.phone,
        subject: teacher.subject,
        JoiningDate: teacher.JoiningDate,
        LeavingDate: teacher.LeavingDate,
        profile: teacher.profile,
        school: {
          _id: school._id,
          name: school.name
        },
        role: teacher.role,
        password: hashedPassword // Store hashed password

      }
    });

  } catch (error) {
    console.error('Teacher registration error:', error);
    next(error);
  }
});