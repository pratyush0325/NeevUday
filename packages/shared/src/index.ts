// ─── User Roles ─────────────────────────────────────────────────────────────
export type UserRole = "donor" | "platform" | "ngo" | "worker" | "village";

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  location?: string;
  verified: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// ─── Donations ───────────────────────────────────────────────────────────────
export type DonationStatus = "queued" | "matched" | "in_transit" | "delivered";
export type DonationCategory = "food" | "clothing" | "medical" | "infrastructure" | "other";

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  category: DonationCategory;
  itemName: string;
  quantity: number;
  unit: string;
  status: DonationStatus;
  matchedNgoId?: string;
  matchedNgoName?: string;
  matchedVillageId?: string;
  matchedVillageName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationRequest {
  category: DonationCategory;
  itemName: string;
  quantity: number;
  unit: string;
}

// ─── Village Requests ────────────────────────────────────────────────────────
export type RequestStatus = "pending" | "matched" | "in_transit" | "fulfilled";
export type RequestUrgency = "critical" | "high" | "medium" | "low";
export type RequestType = "food" | "clothing" | "medical" | "volunteers" | "infrastructure" | "education";

export interface VillageRequest {
  id: string;
  villageRepId: string;
  villageRepName: string;
  villageName: string;
  state: string;
  requestType: RequestType;
  urgency: RequestUrgency;
  quantity: number;
  familiesAffected: number;
  requiredBy: string;
  details: string;
  status: RequestStatus;
  matchedDonationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVillageRequestRequest {
  requestType: RequestType;
  urgency: RequestUrgency;
  quantity: number;
  familiesAffected: number;
  requiredBy: string;
  details: string;
}

// ─── NGOs ────────────────────────────────────────────────────────────────────
export type NgoVerificationStatus = "pending" | "under_review" | "approved" | "rejected";

export interface Ngo {
  id: string;
  name: string;
  adminId: string;
  location: string;
  state: string;
  focusAreas: RequestType[];
  verificationStatus: NgoVerificationStatus;
  activeProjects: number;
  workersAssigned: number;
  suppliesReceived: number;
  familiesServed: number;
  createdAt: string;
}

export interface NgoProject {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  location: string;
  progressPercent: number;
  workersNeeded: number;
  workersAssigned: number;
  status: "active" | "completed" | "paused";
  createdAt: string;
}

// ─── Workers ─────────────────────────────────────────────────────────────────
export type WorkerStatus = "available" | "assigned" | "on_leave";

export interface Worker {
  id: string;
  userId: string;
  name: string;
  location: string;
  skills: string[];
  preferredWorkType: string;
  status: WorkerStatus;
  availableFrom: string;
  rating: number;
  daysWorked: number;
  resourcesEarned: number;
  assignedNgoId?: string;
  assignedNgoName?: string;
  createdAt: string;
}

export interface WorkAssignment {
  id: string;
  workerId: string;
  ngoId: string;
  ngoName: string;
  projectId: string;
  projectTitle: string;
  taskDescription: string;
  location: string;
  progressPercent: number;
  startDate: string;
  endDate?: string;
  status: "active" | "completed";
}

// ─── Platform / Admin ────────────────────────────────────────────────────────
export interface PlatformStats {
  pendingMatches: number;
  activeNgos: number;
  openVillageRequests: number;
  workersAssigned: number;
  totalDonationsValue: number;
  villagesServed: number;
}

export interface MatchSuggestion {
  donationId: string;
  donationItem: string;
  donationQuantity: number;
  villageRequestId: string;
  villageName: string;
  villageState: string;
  urgency: RequestUrgency;
  compatibilityScore: number;
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
