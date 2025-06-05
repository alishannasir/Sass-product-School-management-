import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-10 max-w-xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome{user?.fullName ? `, ${user.fullName}` : ""}!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            This is the School Management System, your all-in-one platform for managing students, teachers, classes, attendance, and more. 
            <br /><br />
            Use the navigation above to access your personalized dashboard and explore the features designed for your role.
          </p>
          <p className="text-gray-500">
            If you need help, please contact your administrator or visit the help section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;