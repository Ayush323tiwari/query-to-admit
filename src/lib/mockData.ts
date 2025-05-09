
import { User, Enquiry, Enrollment, Payment, Course, Notification, Stats } from "./types";

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "student@example.com",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "counselor@example.com",
    role: "counselor",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=0D8ABC&color=fff"
  },
  {
    id: "user3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
  }
];

export const mockCourses: Course[] = [
  {
    id: "course1",
    name: "Bachelor of Computer Science",
    shortDescription: "Learn programming and computer science fundamentals",
    duration: "4 years",
    fee: 9500
  },
  {
    id: "course2",
    name: "Bachelor of Business Administration",
    shortDescription: "Study business management and administration",
    duration: "3 years",
    fee: 8500
  },
  {
    id: "course3",
    name: "Master of Data Science",
    shortDescription: "Advanced study in data analysis and machine learning",
    duration: "2 years",
    fee: 12000
  },
  {
    id: "course4",
    name: "Diploma in Digital Marketing",
    shortDescription: "Learn modern marketing techniques for digital platforms",
    duration: "1 year",
    fee: 4500
  }
];

export const mockEnquiries: Enquiry[] = [
  {
    id: "enq1",
    studentId: "user1",
    studentName: "John Doe",
    email: "student@example.com",
    contact: "123-456-7890",
    course: "Bachelor of Computer Science",
    message: "I want to know more about the course structure and job opportunities after graduation.",
    status: "pending",
    createdAt: "2023-05-10T10:30:00Z",
    responses: []
  },
  {
    id: "enq2",
    studentId: "user4",
    studentName: "Alice Johnson",
    email: "alice@example.com",
    contact: "987-654-3210",
    course: "Master of Data Science",
    message: "What are the prerequisites for this course? Do I need prior programming knowledge?",
    status: "responded",
    createdAt: "2023-05-08T14:20:00Z",
    responses: [
      {
        id: "resp1",
        enquiryId: "enq2",
        staffId: "user2",
        staffName: "Jane Smith",
        message: "Hello Alice, basic programming knowledge is preferred but not mandatory. We have introductory modules to help beginners.",
        createdAt: "2023-05-09T09:15:00Z"
      }
    ]
  },
  {
    id: "enq3",
    studentId: "user5",
    studentName: "Bob Wilson",
    email: "bob@example.com",
    contact: "555-123-4567",
    course: "Bachelor of Business Administration",
    message: "Are there any scholarships available for this program?",
    status: "closed",
    createdAt: "2023-05-05T11:45:00Z",
    responses: [
      {
        id: "resp2",
        enquiryId: "enq3",
        staffId: "user2",
        staffName: "Jane Smith",
        message: "Yes, we offer merit-based scholarships that cover up to 50% of the tuition. You can apply after your application is approved.",
        createdAt: "2023-05-06T10:30:00Z"
      }
    ]
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: "enroll1",
    studentId: "user1",
    studentName: "John Doe",
    course: "Bachelor of Computer Science",
    personalInfo: {
      dateOfBirth: "1998-03-15",
      gender: "Male",
      address: "123 Main St",
      city: "Techville",
      state: "California",
      zipCode: "90210",
      country: "USA",
      phone: "123-456-7890"
    },
    documents: [
      {
        id: "doc1",
        name: "High School Transcript",
        type: "PDF",
        url: "/documents/transcript.pdf",
        uploadedAt: "2023-05-12T10:30:00Z"
      },
      {
        id: "doc2",
        name: "ID Proof",
        type: "JPG",
        url: "/documents/id.jpg",
        uploadedAt: "2023-05-12T10:35:00Z"
      }
    ],
    status: "under_review",
    createdAt: "2023-05-12T10:40:00Z",
    updatedAt: "2023-05-12T10:40:00Z"
  }
];

export const mockPayments: Payment[] = [
  {
    id: "pay1",
    studentId: "user1",
    studentName: "John Doe",
    enrollmentId: "enroll1",
    amount: 9500,
    method: "offline",
    receiptUrl: "/receipts/payment1.jpg",
    status: "pending",
    createdAt: "2023-05-15T14:30:00Z",
    updatedAt: "2023-05-15T14:30:00Z"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    userId: "user1",
    title: "Enrollment Update",
    message: "Your enrollment is under review.",
    isRead: false,
    createdAt: "2023-05-12T11:00:00Z"
  },
  {
    id: "notif2",
    userId: "user1",
    title: "Payment Reminder",
    message: "Please complete your payment to confirm admission.",
    isRead: true,
    createdAt: "2023-05-14T09:30:00Z"
  }
];

export const mockStats: Stats = {
  totalStudents: 150,
  totalEnquiries: 75,
  totalEnrollments: 45,
  totalPayments: 40,
  pendingEnquiries: 20,
  pendingEnrollments: 15,
  pendingPayments: 5
};
