
export type UserRole = "student" | "counselor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
}

export type EnquiryStatus = "pending" | "responded" | "closed";

export interface Enquiry {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  contact: string;
  course: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  responses?: EnquiryResponse[];
}

export interface EnquiryResponse {
  id: string;
  enquiryId: string;
  staffId: string;
  staffName: string;
  message: string;
  createdAt: string;
}

export type EnrollmentStatus = "submitted" | "under_review" | "approved" | "rejected";

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  personalInfo: {
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  documents: Document[];
  status: EnrollmentStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export type PaymentStatus = "pending" | "approved" | "rejected";

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  amount: number;
  method: "online" | "offline";
  receiptUrl?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  shortDescription: string;
  duration: string;
  fee: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Stats {
  totalStudents: number;
  totalEnquiries: number;
  totalEnrollments: number;
  totalPayments: number;
  pendingEnquiries: number;
  pendingEnrollments: number;
  pendingPayments: number;
}
