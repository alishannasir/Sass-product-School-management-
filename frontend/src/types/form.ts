export interface OwnerFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  plan: string;
  profileImage?: File; // Add this for the profile image
}

export interface SchoolFormData {
  name: string;
  city: string;
  address: string;
  contactNumber: string;
  type: string;
}
 export interface OtpFormProps {
  email: string;
  onSuccess: () => void;
}
export interface RegisterFormData extends OwnerFormData, SchoolFormData {}