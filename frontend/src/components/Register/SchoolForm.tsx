import React from "react";
import type { RegisterFormData } from "../../types/form";

interface SchoolFormProps {
  handlePrev: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: () => void;
  formData: RegisterFormData;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  handlePrev,
  handleChange,
  formData,
  handleSubmit,
}) => {
  return (
    <div>
      <div className=" p-4 flex flex-col gap-3 text-white">
        <div className="name">
          <label className="input validator">
            {/* ...SVG... */}
            <input
              type="text"
              required
              placeholder="School name"
              name="name"
              onChange={handleChange}
              value={formData.name}
            />
          </label>
        </div>
        <div className="city">
          <label className="input validator">
            {/* ...SVG... */}
            <input
              type="text"
              required
              placeholder="city"
              name="city"
              onChange={handleChange}
              value={formData.city}
            />
          </label>
        </div>
        <div className="contact">
          <label className="input validator">
            {/* ...SVG... */}
            <input
              type="tel"
              className="tabular-nums"
              required
              placeholder="Contact number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="address">
          <label className="input validator">
            {/* ...SVG... */}
            <input
              type="text"
              required
              placeholder="Address"
              name="address"
              onChange={handleChange}
              value={formData.address}
            />
          </label>
        </div>
        <div className="type">
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            className="select"
          >
            <option value="" disabled>
              Pick a type
            </option>
            <option value="private">Private</option>
            <option value="governmant">Government</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-neutral" onClick={handlePrev}>
            Previous
          </button>
          <button className="btn btn-neutral" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolForm;