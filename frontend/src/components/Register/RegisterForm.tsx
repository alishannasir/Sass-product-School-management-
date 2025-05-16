import React, { useState } from 'react';
import OwnerForm from '../Register/OwnerForm';
import SchoolForm from '../Register/SchoolForm';
import OtpForm from '../Register/OtpForm';
import Dashboard from '../Dashboard/Dashboard'; // <-- Import the dashboard
import type { RegisterFormData } from '../../types/form';
import axios from 'axios';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    plan: 'free',
    name: '',
    city: '',
    address: '',
    contactNumber: '',
    type: '',
  });

  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // <-- Add this state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'profileImage' && value instanceof File) {
          submitData.append(key, value);
        } else if (typeof value === 'string') {
          submitData.append(key, value);
        }
      });

      await axios.post(
        'http://localhost:5000/api/owner/register',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSuccess('Registration successful!');
      setShowOtp(true);
      setIsLoading(false);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Handler after OTP is verified
  const handleOtpSuccess = () => {
    setSuccess("Email verified successfully!");
    setIsVerified(true); // <-- Set verified state
  };

  // Render logic
  if (isVerified) {
    return <Dashboard />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Owner Registration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {showOtp ? (
        <OtpForm email={formData.email} onSuccess={handleOtpSuccess} />
      ) : (
        <>
          {step === 1 && (
            <OwnerForm
              handleNext={handleNext}
              handleChange={handleChange}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 2 && (
            <SchoolForm
              handlePrev={handlePrev}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              formData={formData}
            />
          )}

          {isLoading && (
            <div className="mt-4 text-center">
              <span className="loader" /> Loading...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RegistrationPage;