import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/useRoleContext"; // Import the context

type Role = { id: number; name: string };

export default function RoleSelection() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setRole } = useRole(); // Use the context

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, []);

const handleNext = async () => {
  if (selectedRole) {
    setRole(selectedRole); // Store in context

    // Prompt for email (replace with your own UI as needed)
    const email = window.prompt("Enter your email to check registration:");
    if (email) {
      try {
        const res = await axios.post("http://localhost:5000/api/check-user", {
          email,
          role: selectedRole,
        });
        if (res.data.exists && res.data.verified) {
          navigate("/login");
        } else {
          navigate(`/register/${selectedRole.toLowerCase()}`, { state: { role: selectedRole, email } });
        }
      } catch (err) {
        // fallback to registration if error
        navigate(`/register/${selectedRole.toLowerCase()}`, { state: { role: selectedRole, email } });
      }
    } else {
      // If no email entered, just go to registration
      navigate(`/register/${selectedRole.toLowerCase()}`, { state: { role: selectedRole } });
    }
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="form-container">
        <h2 className="text-2xl font-semibold text-center mb-6">Select Your Role</h2>
        {loading ? (
          <div>Loading roles...</div>
        ) : (
          <>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="mt-6 w-full" onClick={handleNext} disabled={!selectedRole}>
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
}