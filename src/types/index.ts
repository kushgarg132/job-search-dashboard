// MongoDB Schema Types
export interface User {
  _id: string;
  name: string;
  email: string;
  location: string;
  expectedCTC: string;
  skills: string[];
  resumeUrl: string;
  resumeDriveId?: string;
  resumeDrivePath?: string;
  resumeFileName?: string;
  resumeOriginalName?: string;
  resumeUploadedAt?: Date;
  createdAt: Date;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  url: string;
  postedAt: Date;
  createdAt: Date;
}

export interface Application {
  _id: string;
  userId: string;
  jobId: string;
  resumeUrl: string;
  status: "Applied" | "Shortlisted" | "Rejected";
  appliedAt: Date;
}

// UI State Types
export interface JobFilters {
  role: string;
  location: string;
  salary: string;
  search: string;
}

export interface ApplicationFilters {
  status: "All" | "Applied" | "Shortlisted" | "Rejected";
}

// Form Types
export interface ProfileFormData {
  name: string;
  email: string;
  location: string;
  expectedCTC: string;
  skills: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
