import {useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useRole } from "@/hooks/useRoleContext"; // <-- Import useRole

export default function TeacherRegistrationForm() {
  const navigate = useNavigate();
 
  const { role } = useRole(); 
  

  const [form, setForm] = useState({
    FullName: "",
    EmployeeId: "",
    email: "",
    phone: "",
    subject: "",
    JoiningDate: "",
    LeavingDate: "",
    schoolName: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);



    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/teacher/register", {
        ...form,
        role,
      });
      navigate("/verify", { state: { email: form.email, role } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Teacher Registration</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow">
        <input
          name="FullName"
          value={form.FullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="EmployeeId"
          value={form.EmployeeId}
          onChange={handleChange}
          placeholder="Employee ID"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="JoiningDate"
          type="date"
          value={form.JoiningDate}
          onChange={handleChange}
          placeholder="Joining Date"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="LeavingDate"
          type="date"
          value={form.LeavingDate}
          onChange={handleChange}
          placeholder="Leaving Date"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="schoolName"
          value={form.schoolName}
          onChange={handleChange}
          placeholder="School Name"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register as Teacher"}
        </button>
      </form>
    </div>
  );
}