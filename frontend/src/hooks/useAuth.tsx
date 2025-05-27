import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


interface User {
  id: string;
  email: string;
  fullName: string;
  profile?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?:string) => Promise<boolean>;
  register: (userData: RegistrationData) => Promise<boolean>;
  logout: () => void;
  sendOTP: (email: string, role?: string) => Promise<boolean>; // <-- updated
  verifyOTP: (email: string, otp: string, role?: string) => Promise<boolean>; // <-- updated
}

export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  profile?: File;
  plan: string;
  name: string;
  city: string;
  address: string;
  contactNumber: string;
  type: string;
}


const getOtpEndpoints = (role?: string) => {
  switch ((role || "").toLowerCase()) {
    case "teacher":
      return {
        resend: "http://localhost:5000/api/teacher/resend-otp",
        verify: "http://localhost:5000/api/teacher/verify-otp",
      };
    case "student":
      return {
        resend: "http://localhost:5000/api/student/resend-otp",
        verify: "http://localhost:5000/api/student/verify-otp",
      };
    case "parent":
      return {
        resend: "http://localhost:5000/api/parent/resend-otp",
        verify: "http://localhost:5000/api/parent/verify-otp",
      };
    default:
      return {
        resend: "http://localhost:5000/api/owner/resend-otp",
        verify: "http://localhost:5000/api/owner/verify-otp",
      };
  }
};

const getLoginEndpoint = (role?: string) => {
  switch ((role || "").toLowerCase()) {
    case "teacher":
      return "http://localhost:5000/api/teacher/login";
    case "student":
      return "http://localhost:5000/api/student/login";
    case "parent":
      return "http://localhost:5000/api/parent/login";
    default:
      return "http://localhost:5000/api/owner/login";
  }
}


 const getUserFromCookie = () => {
  const userCookie = Cookies.get("user");
  return userCookie ? JSON.parse(userCookie) : null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUserFromCookie());
  const navigate = useNavigate();
  console.log("User:", user);



const login = async (
  email: string,
  password: string,
  role?: string // <-- add role param
): Promise<boolean> => {
  try {
    const endpoint = getLoginEndpoint(role);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }), // <-- send role in body
    });

    if (response.status === 403) {
      await sendOTP(email, role);
      toast.info("Your email is not verified. New OTP sent to your email.");
      navigate("/verify", { state: { email, role } });
      return false;
    }
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Login failed");
      return false;
    }

    const data = await response.json();
    Cookies.set("user", JSON.stringify({
      id: data.user.id,
      fullName: data.user.fullName,
      email: data.user.email,
      profile: data.user.profile,
      plan: data.user.plan,
      role: data.user.role, // <-- use returned role, not the selected one
    }), { expires: 7 });
    window.dispatchEvent(new Event("userCookieChanged"));

    setUser({
      id: data.user.id,
      fullName: data.user.fullName,
      email: data.user.email,
      profile: data.user.profile,
    });
    toast.success("Login successful!");

    // Use the returned role for navigation
    if (data.user.role === "Owner") {
      navigate("/dashboard-owner");
    } else if (data.user.role === "Teacher") {
      navigate("/dashboard-teacher");
    } else if (data.user.role === "Student") {
      navigate("/dashboard/student");
    } else if (data.user.role === "Parent") {
      navigate("/dashboard/parent");
    } else {
      navigate("/dashboard");
    }
    return true;
  } catch (error) {
    toast.error("Failed to login. Please try again.");
    return false;
  }
};
  console.log("Is Authenticated:", !!user);


  // register Owner
 const register = async (userData: RegistrationData): Promise<boolean> => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as any);
    });
    const response = await fetch("http://localhost:5000/api/owner/register", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Registration failed");
      return false;
    }
    toast.success("Registration successful! Please verify your email.");
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Registration failed. Please try again.");
    return false;
  }
};



  const logout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    window.dispatchEvent(new Event("userCookieChanged"));
  };

const sendOTP = async (email: string, role?: string): Promise<boolean> => {
  try {
    const { resend } = getOtpEndpoints(role);
    const response = await fetch(resend, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to send OTP");
      return false;
    }
    toast.success("OTP sent to your email");
    return true;
  } catch (error) {
    console.error("OTP sending error:", error);
    toast.error("Failed to send OTP. Please try again.");
    return false;
  }
};

 const verifyOTP = async (email: string, otp: string, role?: string): Promise<boolean> => {
  try {
    const { verify } = getOtpEndpoints(role);
    const response = await fetch(verify, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Invalid OTP");
      return false;
    }
    toast.success("Email verified successfully!");
    return true;
  } catch (error) {
    console.error("OTP verification error:", error);
    toast.error("Failed to verify OTP. Please try again.");
    return false;
  }
};
 
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};