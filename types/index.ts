export type Role = "ngo_admin" | "volunteer" | "field_worker";

export type NeedCategory =
  | "healthcare"
  | "education"
  | "infrastructure"
  | "food"
  | "mental_health"
  | "disaster_relief"
  | "other";

export type NeedStatus = "open" | "assigned" | "resolved";
export type AssignmentStatus = "pending" | "accepted" | "declined" | "completed";

export type GeoLocation = {
  area: string;
  city?: string;
  district?: string;
  state?: string;
  pincode: string;
  lat: number;
  lng: number;
};

export type Organization = {
  id: string;
  name: string;
  location: GeoLocation;
  contactEmail: string;
  createdAt: string;
};

export type Need = {
  id: string;
  orgId: string;
  title: string;
  description: string;
  category: NeedCategory;
  location: GeoLocation;
  urgency_score: number;
  estimated_affected: number;
  skills_needed: string[];
  status: NeedStatus;
  source: "survey_upload" | "manual" | "field_report";
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
};

export type Volunteer = {
  id: string;
  orgId: string;
  userId: string;
  name: string;
  skills: string[];
  availability: {
    days: string[];
    hours_per_week: number;
  };
  location: GeoLocation;
  performance_score: number;
  tasks_completed: number;
  total_hours: number;
  createdAt: string;
  isActive: boolean;
};

export type Assignment = {
  id: string;
  orgId: string;
  needId: string;
  volunteerId: string;
  volunteerUserId: string;
  matchScore: number;
  matchExplanation: string;
  status: AssignmentStatus;
  assignedAt: string;
  completedAt?: string;
  completionNotes?: string;
  hoursLogged?: number;
};

export type SurveyUpload = {
  id: string;
  orgId: string;
  fileName: string;
  fileUrl?: string;
  rawText: string;
  processedAt?: string;
  extractedNeeds: string[];
  geminiSummary: string;
};

export type FieldReport = {
  id: string;
  submittedBy: string;
  orgId: string;
  description: string;
  location: GeoLocation;
  estimated_affected: number;
  photoUrls: string[];
  urgency: number;
  createdAt: string;
};

export type MatchRecommendation = {
  volunteer_id: string;
  match_score: number;
  explanation: string;
};

export type ExtractedNeed = {
  location: string;
  category: NeedCategory;
  description: string;
  estimated_people_affected: number;
  urgency_score: number;
  skills_needed: string[];
};

export type SurveyProcessingResult = {
  needs: ExtractedNeed[];
  dedupedNeeds: ExtractedNeed[];
  summary: string;
  source: "gemini" | "fallback";
};

export type ImpactReportPayload = {
  organization: Organization;
  needs: Need[];
  assignments: Assignment[];
  volunteers: Volunteer[];
};

export type ImpactMetrics = {
  needsResolved: number;
  volunteerHours: number;
  activeVolunteers: number;
  communitiesServed: number;
  averageResponseHours: number;
};
