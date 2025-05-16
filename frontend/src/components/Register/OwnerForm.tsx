import React, { useState } from "react";
import type { RegisterFormData } from "../../types/form";

interface OwnerFormProps {
  handleNext: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
}

const OwnerForm: React.FC<OwnerFormProps> = ({ 
  handleNext, 
  handleChange, 
  formData,
  setFormData 
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the UI
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
      
      // Update the form data with the file
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3 text-white">
      <div className="fullName">
        <label className="input validator">
          <input
            type="text"
            name="fullName"
            onChange={handleChange}
            required
            placeholder="Username"
            value={formData.fullName}
          />
        </label>
      </div>
      <div className="email">
        <label className="input validator">
          <input
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="test@gmail.com"
            required
          />
        </label>
        <div className="validator-hint hidden">Enter valid email address</div>
      </div>
      <div className="phone">
        <label className="input validator">
          <input
            type="tel"
            className="tabular-nums"
            required
            placeholder="Phone"
            name="phone"
            onChange={handleChange}
            value={formData.phone}
          />
        </label>
      </div>
      <div className="password">
        <label className="input validator">
          <input
            type="password"
            required
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />
        </label>
      </div>
      
      {/* Profile Image Upload */}
      <div className="profile-image text-black">
        <label className="block mb-2">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {previewImage && (
          <div className="mt-2">
            <img 
              src={previewImage} 
              alt="Profile Preview" 
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
        )}
      </div>

      <div className="plan">
        <select
          name="plan"
          value={formData.plan || ""}
          onChange={handleChange}
          className="select"
        >
          <option value="" disabled>
            Pick a plan
          </option>
          <option value="free">Free</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
        </select>
      </div>
      <div>
        <button className="btn btn-neutral" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default OwnerForm;