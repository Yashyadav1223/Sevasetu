import type { Assignment, FieldReport, Need, Organization, SurveyUpload, Volunteer } from "@/types";
import { deterministicMatchScore, explainFallbackMatch } from "@/lib/utils";

export const organizations: Organization[] = [
  {
    id: "org-mumbai",
    name: "Asha Mumbai Collective",
    contactEmail: "coordination@ashamumbai.org",
    createdAt: "2025-11-18T10:00:00.000Z",
    location: {
      area: "Kurla West",
      city: "Mumbai",
      district: "Mumbai Suburban",
      state: "Maharashtra",
      pincode: "400070",
      lat: 19.0726,
      lng: 72.8845
    }
  },
  {
    id: "org-bihar",
    name: "Gram Setu Bihar",
    contactEmail: "field@gramsetu.in",
    createdAt: "2025-12-02T09:30:00.000Z",
    location: {
      area: "Bairia",
      city: "Muzaffarpur",
      district: "Muzaffarpur",
      state: "Bihar",
      pincode: "843108",
      lat: 26.1209,
      lng: 85.3647
    }
  },
  {
    id: "org-chennai",
    name: "Chennai Care Network",
    contactEmail: "hello@chennaicare.net",
    createdAt: "2025-10-29T08:45:00.000Z",
    location: {
      area: "Velachery",
      city: "Chennai",
      district: "Chennai",
      state: "Tamil Nadu",
      pincode: "600042",
      lat: 12.9755,
      lng: 80.2207
    }
  }
];

export const needs: Need[] = [
  {
    id: "need-001",
    orgId: "org-mumbai",
    title: "Dengue fever medical camp",
    description: "Three chawl clusters report fever, body pain, and mosquito breeding after blocked drains overflowed.",
    category: "healthcare",
    location: { area: "Saki Naka", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400072", lat: 19.1012, lng: 72.8878 },
    urgency_score: 9,
    estimated_affected: 340,
    skills_needed: ["medical", "public_health", "logistics"],
    status: "open",
    source: "survey_upload",
    createdAt: "2026-04-20T05:30:00.000Z",
    updatedAt: "2026-04-27T04:00:00.000Z"
  },
  {
    id: "need-002",
    orgId: "org-mumbai",
    title: "School kit drive for migrant children",
    description: "Parents report 86 children without notebooks, bags, and Marathi bridge-learning support.",
    category: "education",
    location: { area: "Dharavi Sector 5", city: "Mumbai", district: "Mumbai", state: "Maharashtra", pincode: "400017", lat: 19.038, lng: 72.8538 },
    urgency_score: 6,
    estimated_affected: 86,
    skills_needed: ["teaching", "fundraising", "logistics"],
    status: "assigned",
    source: "manual",
    createdAt: "2026-04-18T08:20:00.000Z",
    updatedAt: "2026-04-25T06:15:00.000Z"
  },
  {
    id: "need-003",
    orgId: "org-mumbai",
    title: "Food packets for construction workers",
    description: "Daily wage workers near a stalled site have irregular meals because wages are delayed.",
    category: "food",
    location: { area: "Bhandup West", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400078", lat: 19.1435, lng: 72.9384 },
    urgency_score: 8,
    estimated_affected: 120,
    skills_needed: ["food_distribution", "logistics"],
    status: "open",
    source: "field_report",
    createdAt: "2026-04-24T10:10:00.000Z",
    updatedAt: "2026-04-26T09:00:00.000Z"
  },
  {
    id: "need-004",
    orgId: "org-mumbai",
    title: "Women safety counselling circle",
    description: "Community leaders requested confidential counselling after multiple reports of domestic stress and unsafe commutes.",
    category: "mental_health",
    location: { area: "Govandi", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400043", lat: 19.0556, lng: 72.9157 },
    urgency_score: 7,
    estimated_affected: 52,
    skills_needed: ["counselling", "legal_aid", "community_mobilization"],
    status: "open",
    source: "manual",
    createdAt: "2026-04-16T11:40:00.000Z",
    updatedAt: "2026-04-26T11:40:00.000Z"
  },
  {
    id: "need-005",
    orgId: "org-bihar",
    title: "Flood preparation kit distribution",
    description: "Villages close to the Gandak lowlands need tarpaulins, ORS, chlorine tablets, and dry ration before monsoon onset.",
    category: "disaster_relief",
    location: { area: "Kanti Block", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843109", lat: 26.2042, lng: 85.2498 },
    urgency_score: 9,
    estimated_affected: 620,
    skills_needed: ["disaster_relief", "logistics", "medical"],
    status: "open",
    source: "survey_upload",
    createdAt: "2026-04-15T04:30:00.000Z",
    updatedAt: "2026-04-27T03:30:00.000Z"
  },
  {
    id: "need-006",
    orgId: "org-bihar",
    title: "Handpump repair near primary school",
    description: "The only handpump near the school has been broken for eight days, forcing children to bring unsafe water.",
    category: "infrastructure",
    location: { area: "Minapur", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843128", lat: 26.2694, lng: 85.3908 },
    urgency_score: 8,
    estimated_affected: 210,
    skills_needed: ["plumbing", "construction", "community_mobilization"],
    status: "open",
    source: "field_report",
    createdAt: "2026-04-21T06:30:00.000Z",
    updatedAt: "2026-04-26T07:20:00.000Z"
  },
  {
    id: "need-007",
    orgId: "org-bihar",
    title: "Adolescent girls health workshop",
    description: "ASHA workers requested menstrual health education and anaemia screening for girls in classes 7 to 10.",
    category: "healthcare",
    location: { area: "Motipur", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843111", lat: 26.2528, lng: 85.1703 },
    urgency_score: 6,
    estimated_affected: 145,
    skills_needed: ["medical", "teaching", "counselling"],
    status: "assigned",
    source: "manual",
    createdAt: "2026-04-17T07:45:00.000Z",
    updatedAt: "2026-04-26T08:30:00.000Z"
  },
  {
    id: "need-008",
    orgId: "org-bihar",
    title: "Bridge learning volunteers",
    description: "Students who missed school during migration season need weekend math and Hindi support.",
    category: "education",
    location: { area: "Bairia", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843108", lat: 26.1209, lng: 85.3647 },
    urgency_score: 5,
    estimated_affected: 78,
    skills_needed: ["teaching", "mentoring"],
    status: "open",
    source: "survey_upload",
    createdAt: "2026-04-11T12:10:00.000Z",
    updatedAt: "2026-04-24T05:00:00.000Z"
  },
  {
    id: "need-009",
    orgId: "org-chennai",
    title: "Heatwave hydration points",
    description: "Street vendors and sanitation workers in exposed stretches need water stations and first-aid checks during peak heat.",
    category: "healthcare",
    location: { area: "T Nagar", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600017", lat: 13.0418, lng: 80.2341 },
    urgency_score: 8,
    estimated_affected: 260,
    skills_needed: ["medical", "logistics", "public_health"],
    status: "open",
    source: "field_report",
    createdAt: "2026-04-22T06:50:00.000Z",
    updatedAt: "2026-04-27T06:50:00.000Z"
  },
  {
    id: "need-010",
    orgId: "org-chennai",
    title: "Cyclone drain clearance drive",
    description: "Residents flagged clogged stormwater drains near low-lying streets before forecasted heavy rainfall.",
    category: "infrastructure",
    location: { area: "Velachery", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600042", lat: 12.9755, lng: 80.2207 },
    urgency_score: 9,
    estimated_affected: 480,
    skills_needed: ["construction", "logistics", "disaster_relief"],
    status: "open",
    source: "survey_upload",
    createdAt: "2026-04-19T05:30:00.000Z",
    updatedAt: "2026-04-27T05:30:00.000Z"
  },
  {
    id: "need-011",
    orgId: "org-chennai",
    title: "Elderly medicine delivery",
    description: "Senior citizens in two streets need weekly medicine pickup and check-ins because caregivers live away.",
    category: "healthcare",
    location: { area: "Mylapore", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600004", lat: 13.0339, lng: 80.2693 },
    urgency_score: 7,
    estimated_affected: 38,
    skills_needed: ["medical", "logistics", "elder_care"],
    status: "assigned",
    source: "manual",
    createdAt: "2026-04-12T08:30:00.000Z",
    updatedAt: "2026-04-24T04:20:00.000Z"
  },
  {
    id: "need-012",
    orgId: "org-chennai",
    title: "After-school digital literacy",
    description: "Government school teachers requested basic computer and internet safety sessions for first-generation learners.",
    category: "education",
    location: { area: "Perungudi", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600096", lat: 12.9654, lng: 80.2461 },
    urgency_score: 5,
    estimated_affected: 112,
    skills_needed: ["teaching", "digital_literacy", "mentoring"],
    status: "open",
    source: "field_report",
    createdAt: "2026-04-13T09:00:00.000Z",
    updatedAt: "2026-04-25T08:00:00.000Z"
  },
  {
    id: "need-013",
    orgId: "org-mumbai",
    title: "Railway footpath repair request",
    description: "A damaged approach path near the station creates a fall risk for elderly commuters and school children.",
    category: "infrastructure",
    location: { area: "Kurla West", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400070", lat: 19.0726, lng: 72.8845 },
    urgency_score: 6,
    estimated_affected: 450,
    skills_needed: ["construction", "civic_coordination"],
    status: "resolved",
    source: "manual",
    createdAt: "2026-04-02T06:10:00.000Z",
    updatedAt: "2026-04-22T06:10:00.000Z",
    resolvedAt: "2026-04-22T06:10:00.000Z"
  },
  {
    id: "need-014",
    orgId: "org-bihar",
    title: "Nutrition camp for pregnant women",
    description: "Anganwadi survey found low haemoglobin risk and inconsistent ration pickup among pregnant women.",
    category: "food",
    location: { area: "Saraiya", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843126", lat: 26.0844, lng: 85.1059 },
    urgency_score: 7,
    estimated_affected: 64,
    skills_needed: ["medical", "food_distribution", "counselling"],
    status: "resolved",
    source: "survey_upload",
    createdAt: "2026-03-29T07:00:00.000Z",
    updatedAt: "2026-04-23T07:00:00.000Z",
    resolvedAt: "2026-04-23T07:00:00.000Z"
  },
  {
    id: "need-015",
    orgId: "org-chennai",
    title: "Community grief counselling",
    description: "A fishing hamlet asked for group counselling after a recent accident affected several families.",
    category: "mental_health",
    location: { area: "Nochikuppam", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600004", lat: 13.0278, lng: 80.2817 },
    urgency_score: 8,
    estimated_affected: 90,
    skills_needed: ["counselling", "community_mobilization"],
    status: "open",
    source: "field_report",
    createdAt: "2026-04-23T11:10:00.000Z",
    updatedAt: "2026-04-27T11:10:00.000Z"
  },
  {
    id: "need-016",
    orgId: "org-mumbai",
    title: "Immunisation follow-up calls",
    description: "Survey volunteers found missed measles vaccine appointments among children in rented rooms.",
    category: "healthcare",
    location: { area: "Malad East", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400097", lat: 19.1864, lng: 72.8647 },
    urgency_score: 7,
    estimated_affected: 72,
    skills_needed: ["public_health", "data_entry", "community_mobilization"],
    status: "open",
    source: "survey_upload",
    createdAt: "2026-04-25T06:00:00.000Z",
    updatedAt: "2026-04-27T06:00:00.000Z"
  },
  {
    id: "need-017",
    orgId: "org-bihar",
    title: "Temporary learning tent repair",
    description: "The village learning tent roof tore in a storm and classes are stopping during afternoon heat.",
    category: "infrastructure",
    location: { area: "Bochaha", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843103", lat: 26.1509, lng: 85.509 },
    urgency_score: 6,
    estimated_affected: 96,
    skills_needed: ["construction", "teaching", "logistics"],
    status: "open",
    source: "field_report",
    createdAt: "2026-04-21T12:30:00.000Z",
    updatedAt: "2026-04-26T12:30:00.000Z"
  },
  {
    id: "need-018",
    orgId: "org-chennai",
    title: "Dry ration for migrant families",
    description: "Tamil and Hindi-speaking field workers identified families who lost income during short-term work shutdowns.",
    category: "food",
    location: { area: "Ambattur", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600053", lat: 13.1143, lng: 80.1548 },
    urgency_score: 7,
    estimated_affected: 135,
    skills_needed: ["food_distribution", "translation", "logistics"],
    status: "resolved",
    source: "manual",
    createdAt: "2026-04-03T04:30:00.000Z",
    updatedAt: "2026-04-21T04:30:00.000Z",
    resolvedAt: "2026-04-21T04:30:00.000Z"
  }
];

export const volunteers: Volunteer[] = [
  {
    id: "vol-001",
    orgId: "org-mumbai",
    userId: "user-ravi",
    name: "Ravi Menon",
    skills: ["medical", "public_health", "data_entry"],
    availability: { days: ["Saturday", "Sunday"], hours_per_week: 8 },
    location: { area: "Andheri East", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400069", lat: 19.1155, lng: 72.8727 },
    performance_score: 9.1,
    tasks_completed: 18,
    total_hours: 142,
    createdAt: "2025-12-14T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-002",
    orgId: "org-mumbai",
    userId: "user-meera",
    name: "Meera Shaikh",
    skills: ["teaching", "mentoring", "fundraising"],
    availability: { days: ["Tuesday", "Thursday", "Sunday"], hours_per_week: 6 },
    location: { area: "Mahim", city: "Mumbai", district: "Mumbai", state: "Maharashtra", pincode: "400016", lat: 19.0428, lng: 72.8397 },
    performance_score: 8.7,
    tasks_completed: 11,
    total_hours: 78,
    createdAt: "2025-12-28T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-003",
    orgId: "org-mumbai",
    userId: "user-nikhil",
    name: "Nikhil Rao",
    skills: ["construction", "civic_coordination", "logistics"],
    availability: { days: ["Saturday"], hours_per_week: 5 },
    location: { area: "Ghatkopar", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400086", lat: 19.0865, lng: 72.9081 },
    performance_score: 8.2,
    tasks_completed: 9,
    total_hours: 61,
    createdAt: "2026-01-04T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-004",
    orgId: "org-bihar",
    userId: "user-anita",
    name: "Anita Kumari",
    skills: ["medical", "counselling", "community_mobilization"],
    availability: { days: ["Monday", "Wednesday", "Friday"], hours_per_week: 10 },
    location: { area: "Motipur", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843111", lat: 26.2528, lng: 85.1703 },
    performance_score: 9.4,
    tasks_completed: 24,
    total_hours: 188,
    createdAt: "2025-10-16T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-005",
    orgId: "org-bihar",
    userId: "user-imran",
    name: "Imran Alam",
    skills: ["plumbing", "construction", "disaster_relief"],
    availability: { days: ["Saturday", "Sunday"], hours_per_week: 12 },
    location: { area: "Kanti Block", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843109", lat: 26.2042, lng: 85.2498 },
    performance_score: 8.9,
    tasks_completed: 15,
    total_hours: 130,
    createdAt: "2025-11-10T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-006",
    orgId: "org-bihar",
    userId: "user-puja",
    name: "Puja Singh",
    skills: ["teaching", "mentoring", "data_entry"],
    availability: { days: ["Sunday"], hours_per_week: 4 },
    location: { area: "Bairia", city: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", pincode: "843108", lat: 26.1209, lng: 85.3647 },
    performance_score: 8.1,
    tasks_completed: 7,
    total_hours: 42,
    createdAt: "2026-01-18T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-007",
    orgId: "org-chennai",
    userId: "user-lakshmi",
    name: "Lakshmi Narayanan",
    skills: ["medical", "elder_care", "public_health"],
    availability: { days: ["Tuesday", "Saturday"], hours_per_week: 7 },
    location: { area: "Mylapore", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600004", lat: 13.0339, lng: 80.2693 },
    performance_score: 9.3,
    tasks_completed: 20,
    total_hours: 156,
    createdAt: "2025-09-22T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-008",
    orgId: "org-chennai",
    userId: "user-arjun",
    name: "Arjun Prakash",
    skills: ["construction", "logistics", "disaster_relief"],
    availability: { days: ["Saturday", "Sunday"], hours_per_week: 9 },
    location: { area: "Velachery", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600042", lat: 12.9755, lng: 80.2207 },
    performance_score: 8.6,
    tasks_completed: 13,
    total_hours: 91,
    createdAt: "2025-12-03T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-009",
    orgId: "org-chennai",
    userId: "user-fathima",
    name: "Fathima Begum",
    skills: ["counselling", "translation", "community_mobilization"],
    availability: { days: ["Wednesday", "Friday"], hours_per_week: 5 },
    location: { area: "Triplicane", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600005", lat: 13.0588, lng: 80.2756 },
    performance_score: 8.8,
    tasks_completed: 10,
    total_hours: 69,
    createdAt: "2026-01-08T08:30:00.000Z",
    isActive: true
  },
  {
    id: "vol-010",
    orgId: "org-chennai",
    userId: "user-karthik",
    name: "Karthik Subramaniam",
    skills: ["teaching", "digital_literacy", "mentoring"],
    availability: { days: ["Monday", "Thursday"], hours_per_week: 6 },
    location: { area: "Perungudi", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600096", lat: 12.9654, lng: 80.2461 },
    performance_score: 8.5,
    tasks_completed: 12,
    total_hours: 74,
    createdAt: "2025-11-21T08:30:00.000Z",
    isActive: true
  }
];

export const assignments: Assignment[] = [
  {
    id: "assign-001",
    orgId: "org-mumbai",
    needId: "need-002",
    volunteerId: "vol-002",
    volunteerUserId: "user-meera",
    matchScore: 91,
    matchExplanation: "Meera matched because she teaches bridge-learning classes, is close to Dharavi, and can coordinate weekend supply drives.",
    status: "accepted",
    assignedAt: "2026-04-25T06:20:00.000Z"
  },
  {
    id: "assign-002",
    orgId: "org-bihar",
    needId: "need-007",
    volunteerId: "vol-004",
    volunteerUserId: "user-anita",
    matchScore: 96,
    matchExplanation: "Anita matched because she has medical and counselling experience, speaks locally, and is based in Motipur.",
    status: "accepted",
    assignedAt: "2026-04-26T08:40:00.000Z"
  },
  {
    id: "assign-003",
    orgId: "org-chennai",
    needId: "need-011",
    volunteerId: "vol-007",
    volunteerUserId: "user-lakshmi",
    matchScore: 94,
    matchExplanation: "Lakshmi matched because she has elder-care and public-health experience and lives in Mylapore.",
    status: "accepted",
    assignedAt: "2026-04-24T04:30:00.000Z"
  },
  {
    id: "assign-004",
    orgId: "org-mumbai",
    needId: "need-013",
    volunteerId: "vol-003",
    volunteerUserId: "user-nikhil",
    matchScore: 88,
    matchExplanation: "Nikhil matched because he handles construction follow-ups and civic coordination near Kurla.",
    status: "completed",
    assignedAt: "2026-04-10T04:30:00.000Z",
    completedAt: "2026-04-22T06:10:00.000Z",
    completionNotes: "Filed ward request, organized temporary barricade, and coordinated repair visit.",
    hoursLogged: 12
  },
  {
    id: "assign-005",
    orgId: "org-bihar",
    needId: "need-014",
    volunteerId: "vol-004",
    volunteerUserId: "user-anita",
    matchScore: 93,
    matchExplanation: "Anita matched because she combines medical screening skills with counselling for maternal health.",
    status: "completed",
    assignedAt: "2026-04-02T07:00:00.000Z",
    completedAt: "2026-04-23T07:00:00.000Z",
    completionNotes: "Screened 51 women, coordinated ration cards, and escalated high-risk cases to PHC staff.",
    hoursLogged: 18
  },
  {
    id: "assign-006",
    orgId: "org-chennai",
    needId: "need-018",
    volunteerId: "vol-009",
    volunteerUserId: "user-fathima",
    matchScore: 89,
    matchExplanation: "Fathima matched because she can translate between Tamil and Hindi and mobilize migrant families quickly.",
    status: "completed",
    assignedAt: "2026-04-05T04:30:00.000Z",
    completedAt: "2026-04-21T04:30:00.000Z",
    completionNotes: "Mapped 43 households and supported two dry-ration distribution rounds.",
    hoursLogged: 14
  }
];

export const surveyUploads: SurveyUpload[] = [
  {
    id: "upload-mumbai-001",
    orgId: "org-mumbai",
    fileName: "mumbai-health-education-survey.csv",
    rawText:
      "area,pincode,issue,people,frequency\nSaki Naka,400072,fever and mosquito breeding near blocked drains,340,high\nMalad East,400097,missed child immunisation appointments,72,medium\nDharavi Sector 5,400017,children need notebooks and bridge learning,86,medium",
    processedAt: "2026-04-25T06:00:00.000Z",
    extractedNeeds: ["need-001", "need-002", "need-016"],
    geminiSummary:
      "The strongest pattern is preventable healthcare risk in dense settlements, followed by education support for migrant children. Drainage, immunisation tracking, and school-kit mobilization should be prioritized this week."
  },
  {
    id: "upload-bihar-001",
    orgId: "org-bihar",
    fileName: "muzaffarpur-monsoon-prep.csv",
    rawText:
      "village,pincode,need,people,urgency\nKanti Block,843109,flood prep kits before monsoon,620,critical\nBairia,843108,weekend bridge learning for migration-affected students,78,moderate\nSaraiya,843126,nutrition support for pregnant women,64,high",
    processedAt: "2026-04-21T08:00:00.000Z",
    extractedNeeds: ["need-005", "need-008", "need-014"],
    geminiSummary:
      "Monsoon readiness is the highest-risk theme in Muzaffarpur, with food and health support needed for vulnerable households. Education continuity remains a medium urgency gap."
  }
];

export const fieldReports: FieldReport[] = [
  {
    id: "report-001",
    orgId: "org-chennai",
    submittedBy: "field-worker-velachery",
    description: "Water has started pooling near the drain mouth after two evenings of rain.",
    location: { area: "Velachery", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600042", lat: 12.9755, lng: 80.2207 },
    estimated_affected: 140,
    photoUrls: [],
    urgency: 8,
    createdAt: "2026-04-27T05:10:00.000Z"
  }
];

export function getOpenNeeds(orgId?: string) {
  return needs
    .filter((need) => need.status !== "resolved" && (!orgId || need.orgId === orgId))
    .sort((a, b) => b.urgency_score - a.urgency_score);
}

export function getOrgById(orgId: string) {
  return organizations.find((org) => org.id === orgId) ?? organizations[0];
}

export function getMatchesForNeed(need: Need) {
  return volunteers
    .filter((volunteer) => volunteer.orgId === need.orgId && volunteer.isActive)
    .map((volunteer) => ({
      volunteer,
      score: deterministicMatchScore(need, volunteer),
      explanation: explainFallbackMatch(need, volunteer)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function getVolunteerTasks(volunteerId: string) {
  const volunteer = volunteers.find((item) => item.id === volunteerId) ?? volunteers[0];
  return getOpenNeeds(volunteer.orgId)
    .map((need) => ({
      need,
      score: deterministicMatchScore(need, volunteer),
      explanation: explainFallbackMatch(need, volunteer)
    }))
    .sort((a, b) => b.score - a.score);
}

export const dashboardOrgId = "org-mumbai";
