export interface OwnerFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  plan: string;
}

export interface SchoolFormData {
  name: string;
  city: string;
  address: string;
  contactNumber: string;
  type: string;
}

export interface RegisterFormData extends OwnerFormData, SchoolFormData {}