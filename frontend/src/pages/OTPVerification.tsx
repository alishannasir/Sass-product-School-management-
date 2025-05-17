import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";


const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP } = useAuth();
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    // Get email from location state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email found in state, redirect to login
      navigate("/login");
      return;
    }

    // Start countdown
    startCountdown();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [location, navigate]);

  const startCountdown = () => {
    setCountdown(60);
    setIsResendDisabled(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timerRef.current!);
          setIsResendDisabled(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await sendOTP(email);
      startCountdown();
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: OTPFormValues) => {
    setIsLoading(true);
    setSuccess(null);
    try {
      const success = await verifyOTP(email, values.otp);
      if (success) {
        setSuccess("OTP verified successfully!");
        navigate("/login");
      }
    } catch (err: any) {
      form.setError("otp", { message: err?.message || "Verification failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="form-container">
          <h2 className="text-2xl font-semibold text-center mb-6">Verify Your Email</h2>
           {success && <div className="text-green-600 text-center">{success}</div>}
          <p className="text-center text-gray-600 mb-6">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter 6-digit OTP"
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              {isResendDisabled ? (
                <span>
                  Resend in <span className="font-medium">{countdown}s</span>
                </span>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-primary font-medium hover:text-primary-focus"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;