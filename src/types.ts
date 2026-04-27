// ── Profile ──────────────────────────────────────────────
export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: { city: string; state: string; country: string }
  linkedin: string
  github: string
}

export interface Skills {
  frontend: string[]
  backend: string[]
  databases: string[]
  realTime: string[]
  toolsAndDevops: string[]
  other: string[]
}

export interface Experience {
  role: string
  company: string
  employmentType: string   // 'Full-Time' | 'Freelance' | 'Part-Time'
  startDate: string
  endDate: string          // 'Present' or date string
  location: string
  responsibilities: string[]
}

export interface Project {
  name: string
  techStack: string[]
  highlights: string[]
}

export interface Education {
  degree: string
  fieldOfStudy: string
  institution: string
  startYear: number
  endYear: number
}

export interface Certification {
  title: string
  issuer: string
  description: string
}

export interface Profile {
  _id: string
  personalInfo: PersonalInfo
  summary: string
  skills: Skills
  experience: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  seniority: string        // 'junior' | 'mid' | 'senior' | 'lead'
  yearsExp: number
  workType: string         // 'fulltime' | 'freelance' | 'both'
  remote: string           // 'remote' | 'hybrid' | 'onsite'
  salaryMin: number        // INR per annum
  salaryMax: number
  targetRoles: string[]
  contextString: string
  contextBuiltAt: string | null
  createdAt: string
  updatedAt: string
}

// ── Job ──────────────────────────────────────────────────
export interface Job {
  _id: string
  externalId: string
  source: 'remotive' | 'arbeitnow'
  title: string
  company: string
  companyLogo: string      // URL or empty string
  description: string
  tags: string[]
  salary: string           // raw string e.g. "$80k-$120k" or empty
  isRemote: boolean
  location: string
  url: string              // apply link
  postedAt: string
  matchScore: number | null  // 0-100, null = not scored yet
  matchReason: string | null // 1-line AI reason
  missingSkills: string[]
  verdict: 'strong_match' | 'partial_match' | 'weak_match' | null
  fetchedAt: string
  createdAt: string
  updatedAt: string
}

// ── Bookmark ─────────────────────────────────────────────
export interface Bookmark {
  _id: string
  jobRef: string | null    // Job._id, nullable (manually added bookmarks have null)
  externalUrl: string      // always stored — jobs expire after 6h
  title: string
  company: string
  matchScore: number
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected'
  notes: string
  appliedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: { code: string; message: string }
}
