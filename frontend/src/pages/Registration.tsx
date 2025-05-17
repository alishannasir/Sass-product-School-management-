import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { OwnerRegistrationForm, type OwnerFormValues } from "@/components/OwnerRegistrationForm";
import { SchoolDetailsForm, type SchoolFormValues } from "@/components/SchoolDetailsForm";
import { useAuth, type RegistrationData } from "@/hooks/useAuth";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const { sendOTP } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistrationData>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOwnerFormSubmit = (data: OwnerFormValues & { profileImage?: File | null }) => {
    setFormData({ ...formData, ...data });
    setProfileImage(data.profileImage || null);
    setStep(2);
  };

  const handleSchoolFormSubmit = async (data: SchoolFormValues) => {
    const completeData: RegistrationData = {
      ...formData,
      fullName: formData.fullName!,
      email: formData.email!,
      phone: formData.phone!,
      password: formData.password!,
      plan: formData.plan!,
      name: data.name,
      city: data.city,
      address: data.address,
      contactNumber: data.contactNumber,
      type: data.type,
    };

    setIsLoading(true);
    setError(null);

    try {
      // Prepare FormData for backend
      const submitData = new FormData();
      Object.entries(completeData).forEach(([key, value]) => {
        if (key === "profileImage" && profileImage) {
          submitData.append("profileImage", profileImage);
        } else if (typeof value === "string") {
          submitData.append(key, value);
        }
      });

      // Replace with your backend endpoint
      await axios.post(
        "http://localhost:5000/api/owner/register",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await sendOTP(completeData.email);
      navigate("/verify", { state: { email: completeData.email } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="form-container">
          <div className="step-indicator">
            <div className={`step ${step === 1 ? "active" : "completed"}`}></div>
            <div className={`step ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}></div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {step === 1 && (
            <OwnerRegistrationForm
              onNext={handleOwnerFormSubmit}
              defaultValues={formData}
            />
          )}
          {step === 2 && (
            <SchoolDetailsForm
              onBack={() => setStep(1)}
              onSubmit={handleSchoolFormSubmit}
              defaultValues={formData}
            />
          )}
          {isLoading && (
            <div className="mt-4 text-center">
              <span className="loader" /> Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;