import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

 const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Invalid email or password");
      return false;
    }
    const data = await response.json();
    setUser({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      profile: data.profile,
    });
    toast.success("Login successful!");
    return true;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Failed to login. Please try again.");
    return false;
    }
  };

 const register = async (userData: RegistrationData): Promise<boolean> => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as any);
    });
    const response = await fetch("/api/auth/register", {
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
    setUser(null);
    toast.info("You have been logged out.");
  };

  const sendOTP = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/send-otp", {
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
    const response = await fetch("/api/auth/verify-otp", {
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
