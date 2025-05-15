import React, { useState } from "react";
import logo from "/logo.png";
import OwnerForm from "./OwnerForm";
import SchoolForm from "./SchoolForm";
import toast, { Toaster } from "react-hot-toast";
import type { RegisterFormData } from "../../types/form";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    plan: "",
    name: "",
    city: "",
    address: "",
    contactNumber: "",
    type: "",
  });
  const [step, setStep] = useState<number>(1);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleNext(): void {
    setStep((prev) => prev + 1);
  }

  function handlePrev(): void {
    setStep((prev) => prev - 1);
  }

  function handleSubmit(): void {
    fetch("http://localhost:5000/api/owner/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status === 409) {
          toast.error("Email already exists");
          return;
        }
        if (!res.ok) {
          toast.error("Something went wrong");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.status === 1) {
          toast.success("OTP send to your email please verify");
        }
      })
      .catch(() => {
        toast.error("Registration failed try again ");
      });
  }

  return (
    <div className="flex h-[105vh]">
      <div className="flex-1 bg-green-400 pl-6">
        <div className="flex flex-col gap-4">
          <img src={logo} className="w-[200px]" alt="" />
          <div className="flex  pl-4 flex-col gap-2">
            <h3 className="text-3xl font-semibold">
              Welcome to <br />
              Schoolify lms 👋
            </h3>
            <p className="text-sm text-slate-700">
              Kindly fill in your details below to sign in.
            </p>
          </div>
        </div>
        <div>
          {step === 1 && (
            <OwnerForm
              handleNext={handleNext}
              formData={formData}
              handleChange={handleChange}
            />
          )}
          {step === 2 && (
            <SchoolForm
              handlePrev={handlePrev}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
      <div className="flex-1 bg-red-400">
        <img
          className="w-full h-full object-cover"
          src="https://img.freepik.com/free-photo/kids-classroom-taking-english-class_23-2149402667.jpg?uid=R81763851&ga=GA1.1.1431774858.1747201417&semt=ais_hybrid&w=740"
          alt=""
        />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default RegisterForm;