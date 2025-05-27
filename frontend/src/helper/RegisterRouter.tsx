import { useParams } from "react-router-dom";
import OwnerRegistration from "../pages/OwnerRegistration";
import TeacherRegistrationForm from "../pages/TeacherRegistrationForm";
// import StudentRegistrationForm, ParentRegistrationForm if you have them

export default function RegisterRouter() {
  const { role } = useParams();

  if (role === "owner") return <OwnerRegistration />;
  if (role === "teacher") return <TeacherRegistrationForm />;
  // if (role === "student") return <StudentRegistrationForm />;
  // if (role === "parent") return <ParentRegistrationForm />;
  return <div>Invalid role</div>;
}