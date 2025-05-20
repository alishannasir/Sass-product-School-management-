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
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegistrationData) => Promise<boolean>;
  logout: () => void;
  sendOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
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
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:5000/api/owner/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 403) {
      await sendOTP(email);
      toast.info("Your email is not verified.New OTP sent to your email.");
      navigate("/verify", { state: { email } });
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
    }), { expires: 7 });
    window.dispatchEvent(new Event("userCookieChanged"));
    
      
     setUser({
      id: data.user.id,
      fullName: data.user.fullName,
      email: data.user.email,
      profile: data.user.profile,
    });
    toast.success("Login successful!");

    navigate("/dashboard");
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

const sendOTP = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:5000/api/owner/resend-otp", {
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

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:5000/api/owner/verify-otp", {
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