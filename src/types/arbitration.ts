export type ArbitrationStatus =
  | 'open'
  | 'awaiting_seller_response'
  | 'awaiting_buyer_response'
  | 'under_admin_review'
  | 'inspection_requested'
  | 'inspection_pending_external'
  | 'awaiting_post_inspection_review'
  | 'awaiting_compliance'
  | 'resolved'
  | 'closed';

export type ArbitrationSellerResponseType =
  | 'accept'
  | 'deny'
  | 'counter'
  | 'request_inspection'
  | '';

export type ArbitrationListQueryParams = {
  page?: number;
  search?: string;
  status?: string;
  status_group?: string;
  severity?: string;
  order?: string;
  overdue?: string;
};

export type ArbitrationCaseSummary = {
  id: string;
  case_number: string;
  order: string;
  buyer: string;
  seller: string;
  reason: string;
  severity: string;
  summary: string;
  claimed_amount: string;
  status: ArbitrationStatus;
  claim_deadline_at: string | null;
  seller_response_due_at: string | null;
  buyer_response_due_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArbitrationIssueItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  claimed_amount: string;
  approved_amount: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ArbitrationEvidence = {
  id: string;
  issue_item: string | null;
  uploaded_by: string;
  original_filename: string;
  content_type: string;
  size: number;
  description: string;
  visibility: string;
  is_locked: boolean;
  file_url: string | null;
  created_at: string;
};

export type ArbitrationMessage = {
  id: string;
  sender: string;
  message: string;
  visibility: string;
  response_type: ArbitrationSellerResponseType;
  proposed_amount: string | null;
  created_at: string;
};

export type ArbitrationTimelineEvent = {
  id: string;
  actor: string | null;
  event_type: string;
  message: string;
  metadata: Record<string, unknown>;
  visibility: string;
  created_at: string;
};

export type ArbitrationInspectionRequest = {
  id: string;
  requested_by: string;
  approved_by: string | null;
  status: string;
  scope: string;
  external_request_id: string;
  external_report_id: string;
  report_summary: string;
  report_reference: string;
  requested_at: string | null;
  approved_at: string | null;
  due_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type ArbitrationDecision = {
  id: string;
  decided_by: string;
  decision_type: string;
  fault_party: string;
  order_outcome: string;
  compensation_amount: string;
  decision_note: string;
  issued_at: string;
  created_at: string;
  updated_at: string;
};

export type ArbitrationObligation = {
  id: string;
  assigned_to: string;
  obligation_type: string;
  status: string;
  amount: string | null;
  description: string;
  due_at: string | null;
  fulfilled_at: string | null;
  proofs: ArbitrationObligationProof[];
  created_at: string;
  updated_at: string;
};

export type ArbitrationObligationProof = {
  id: string;
  obligation: string;
  uploaded_by: string;
  file: string;
  file_url: string | null;
  note: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArbitrationRestriction = {
  id: string;
  user: string;
  restriction_type: string;
  status: string;
  reason: string;
  applied_by: string;
  removed_by: string | null;
  removed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArbitrationVehicleSnapshotLink = {
  id: string;
  order: string;
  api_url: string;
  frontend_path: string;
};

export type ArbitrationCaseDetail = ArbitrationCaseSummary & {
  issue_items: ArbitrationIssueItem[];
  evidence: ArbitrationEvidence[];
  messages: ArbitrationMessage[];
  timeline_events: ArbitrationTimelineEvent[];
  vehicle_snapshot: ArbitrationVehicleSnapshotLink | null;
  inspection_requests: ArbitrationInspectionRequest[];
  decision: ArbitrationDecision | null;
  obligations: ArbitrationObligation[];
  restrictions: ArbitrationRestriction[];
};

export type ArbitrationAdminNotePayload = {
  caseId: string;
  message: string;
};

export type ArbitrationAdminEscalatePayload = {
  caseId: string;
  reason?: string;
};

export type ArbitrationApproveInspectionPayload = {
  caseId: string;
  inspection_request_id: string;
};

export type ArbitrationAdminDecisionPayload = {
  caseId: string;
  decision_type: string;
  fault_party: string;
  order_outcome: string;
  compensation_amount: string;
  decision_note: string;
  compensation_payer?: 'buyer' | 'seller' | '';
  create_compensation_obligation: boolean;
  seller_restriction_type?: string;
  seller_restriction_reason?: string;
};

export type ArbitrationDecisionPreviewWarning = {
  code: string;
  message: string;
};

export type ArbitrationDecisionPreviewObligation = {
  obligation_type: string;
  obligation_type_label: string;
  assigned_role: 'buyer' | 'seller' | 'super_admin' | string;
  amount: string | null;
  description: string;
  due_at: string | null;
};

export type ArbitrationDecisionPreviewRestriction = {
  restriction_type: string;
  restriction_type_label: string;
  applied_to: string;
  reason: string;
};

export type ArbitrationAdminDecisionPreview = {
  decision_type: string;
  decision_type_label: string;
  fault_party: string;
  fault_party_label: string;
  order_outcome: string;
  order_outcome_label: string;
  compensation_amount: string;
  compensation_payer?: 'buyer' | 'seller' | '' | null;
  decision_note: string;
  create_compensation_obligation: boolean;
  seller_restriction_type?: string;
  seller_restriction_reason?: string;
  requires_confirmation: boolean;
  warnings: ArbitrationDecisionPreviewWarning[];
  generated_obligations: ArbitrationDecisionPreviewObligation[];
  generated_restrictions: ArbitrationDecisionPreviewRestriction[];
};

export type ArbitrationRequestInspectionPayload = {
  caseId: string;
  scope: string;
};

export type ArbitrationObligationProofUploadPayload = {
  caseId: string;
  obligation_id: string;
  file: File;
  note?: string;
};

export type ArbitrationObligationProofReviewPayload = {
  caseId: string;
  obligation_id: string;
  proof_id: string;
  status: 'verified' | 'rejected';
  note?: string;
};

export type ArbitrationObligationWaivePayload = {
  caseId: string;
  obligation_id: string;
  reason?: string;
};

export type ArbitrationRestrictionRemovePayload = {
  caseId: string;
  restriction_id: string;
  reason?: string;
};
