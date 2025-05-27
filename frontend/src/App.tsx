import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import RoleBasedSelection from "./pages/RoleBasedSelection";
import RegisterRouter from "./helper/RegisterRouter";
import { RoleProvider } from "./hooks/useRoleContext";
import DashboardOwner from "./pages/DashboardOwner";
import DashboardTeacher from "./pages/DashboardTeacher";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RoleProvider> {/* <-- Wrap with RoleProvider */}
          <AuthProvider>
            <TooltipProvider>
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register/:role" element={<RegisterRouter />} />
                <Route path="/verify" element={<OTPVerification />} />
                <Route path="/dashboard-owner" element={<DashboardOwner />} />
                <Route path="/dashboard-teacher" element={<DashboardTeacher />} />
                <Route path="/role-select" element={<RoleBasedSelection />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </RoleProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;