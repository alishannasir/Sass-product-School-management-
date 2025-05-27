import Otp from "../models/otp/otp.model.js"

async function cleanOtp(ownerId: any, role: string) {
    // Find OTP by user and role
    const isOtpExist = await Otp.findOne({ email: ownerId, role });

    if (isOtpExist) {
        const timeDiff = (Date.now() - new Date(isOtpExist.lastOtpSentAt).getTime()) / 1000; // seconds
        if (timeDiff < 60) {
            throw new Error("please wait 60 seconds to send otp again");
        }
        await Otp.deleteOne({ _id: isOtpExist._id });
        return true;
    }
    return false;
}

export default cleanOtp;