export enum LogAction {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  COMMENTED = 'COMMENTED'
}

export enum ProcurementStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  NEEDS_REVISION = 'NEEDS_REVISION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ProcessDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_REVISION = 'REQUEST_REVISION'
}

export interface ProcurementsParams {
  page?: number
  limit?: number
  search?: string
  unitId?: string
}

export interface ProcessDecisionRequest {
  decision: ProcessDecision
  comment?: string
}

// Tipe data untuk satu item pengadaan yang diterima dari API
export interface Procurement {
  id: string
  letterNumber: string
  letterAbout: string
  nominal: string
  status: ProcurementStatus
  incomingLetterDate: string
  letterFile: string
  createdAt: string
  updatedAt: string
  unitId: string
  createdBy: { name: string }
  currentApprover?: { name: string } | null
  unit: { name: string }
}

export type ProcurementLogFormData = {
  logId: string
  action: LogAction
  comment?: string | null
  timestamp: string
  actor: {
    id: string
    name: string
  }
}

export type ProcurementProgress = {
  letter: Procurement
  logs: ProcurementLogFormData[]
}

export interface ProcurementHistoryLog {
  logId: string
  action: LogAction
  comment: string | null
  timestamp: string
  actor: {
    id: string
    name: string
  }
  letter: Procurement
}

// ------ Form Data Types ------ //

interface ProcurementFormData {
  letterNumber: string
  letterAbout: string
  nominal: number
  incomingLetterDate: string
  unitId: string
  letterFile: File
}

export type CreateProcurementRequest = ProcurementFormData
export type UpdateProcurementRequest = Omit<ProcurementFormData, 'letterFile'> & {
  letterFile?: File
}

// Dashboard summary types
export type DashboardSummary = {
  total_in_unit: number
  total_approved: number
  total_rejected: number
}

export type GetDashboardProcurementsResponse = {
  summary: DashboardSummary
  letters: Procurement[]
  pagination: {
    total_data: number
    page: number
    limit: number
    total_page: number
  }
}
