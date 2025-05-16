import React, { useState } from "react";
import axios from "axios";
import type {OtpFormProps } from "../../types/form";



const OtpForm: React.FC<OtpFormProps> = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function verifyOtp(email: string, otp: string) {
    const response = await axios.post("http://localhost:5000/api/owner/verify-otp", {
      email,
      otp,
    });
    return response.data;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await verifyOtp(email, otp);
      setSuccess("OTP verified successfully!");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
      <label className="font-semibold">Enter OTP sent to your email:</label>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        required
        className="input input-bordered"
        placeholder="Enter 6-digit OTP"
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button
  onClick={async () => {
    await axios.post("http://localhost:5000/api/owner/verify-otp/resend", { email });
    // Show message to user
  }}
>
  Resend OTP
</button>
    </form>
  );
};

export default OtpForm;