'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineArrowLeft, HiOutlineDocumentText } from 'react-icons/hi2';
import { Drawer } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CarFront, Minus, Plus, RotateCcw } from 'lucide-react';
import Slider, { type Settings } from 'react-slick';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { AdminDetailsPanel, AdminKeyValueList } from '@/components/admin/AdminDetailsPanel';
import { AdminPageScaffold, AdminSectionCard } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import CvModal from '@/components/ui/CvModal';
import CvInput from '@/components/ui/CvInput';
import ErrorLabel from '@/components/ui/ErrorLabel';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useAddSuperAdminArbitrationNoteMutation,
  useApproveSuperAdminArbitrationInspectionMutation,
  useEscalateSuperAdminArbitrationCaseMutation,
  useGetSuperAdminArbitrationCaseQuery,
  useIssueSuperAdminArbitrationDecisionMutation,
  usePreviewSuperAdminArbitrationDecisionMutation,
  useRemoveSuperAdminArbitrationRestrictionMutation,
  useRequestSuperAdminArbitrationInspectionMutation,
  useReviewSuperAdminArbitrationObligationProofMutation,
  useUploadSuperAdminArbitrationObligationProofMutation,
  useWaiveSuperAdminArbitrationObligationMutation,
} from '@/features/super-admin/superAdminApi';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';
import type {
  ArbitrationAdminDecisionPayload,
  ArbitrationAdminDecisionPreview,
  ArbitrationCaseDetail,
  ArbitrationEvidence,
  ArbitrationInspectionRequest,
  ArbitrationMessage,
  ArbitrationObligation,
  ArbitrationRestriction,
  ArbitrationTimelineEvent,
} from '@/types/arbitration';

const noteSchema = z.object({
  message: z.string().trim().min(1, 'Admin note is required'),
});

const escalateSchema = z.object({
  reason: z.string().trim().min(1, 'Escalation reason is required'),
});

const inspectionRequestSchema = z.object({
  scope: z.string().trim().min(1, 'Inspection scope is required'),
});

const proofUploadSchema = z.object({
  file: z
    .custom<File>((value) => typeof File !== 'undefined' && value instanceof File, {
      message: 'Proof file is required',
    })
    .nullable(),
  note: z.string().trim().optional(),
});

const proofReviewSchema = z.object({
  note: z.string().trim().optional(),
});

const waiveSchema = z.object({
  reason: z.string().trim().optional(),
});

const removeRestrictionSchema = z.object({
  reason: z.string().trim().optional(),
});

const decisionSchema = z.object({
  decision_type: z.string().trim().min(1, 'Decision type is required'),
  fault_party: z.string().trim().min(1, 'Fault party is required'),
  order_outcome: z.string().trim().min(1, 'Order outcome is required'),
  compensation_amount: z
    .string()
    .trim()
    .min(1, 'Compensation amount is required')
    .refine((value) => !Number.isNaN(Number(value)), 'Compensation must be numeric')
    .refine((value) => Number(value) >= 0, 'Compensation cannot be negative'),
  compensation_payer: z.string().optional(),
  create_compensation_obligation: z.boolean(),
  seller_restriction_type: z.string().optional(),
  seller_restriction_reason: z.string().optional(),
  decision_note: z.string().trim().min(1, 'Decision note is required'),
});

type NoteFormValues = z.infer<typeof noteSchema>;
type EscalateFormValues = z.infer<typeof escalateSchema>;
type InspectionRequestFormValues = z.infer<typeof inspectionRequestSchema>;
type ProofUploadFormValues = z.infer<typeof proofUploadSchema>;
type ProofReviewFormValues = z.infer<typeof proofReviewSchema>;
type WaiveFormValues = z.infer<typeof waiveSchema>;
type RemoveRestrictionFormValues = z.infer<typeof removeRestrictionSchema>;
type DecisionFormValues = z.infer<typeof decisionSchema>;

const DECISION_HELP: Record<string, { title: string; description: string }> = {
  claim_rejected: {
    title: 'Claim rejected',
    description: 'Closes the case without compensation. Use when the buyer claim is not supported.',
  },
  full_compensation_ordered: {
    title: 'Full compensation ordered',
    description: 'Orders the payer to compensate the buyer for the full claimed amount.',
  },
  partial_compensation_ordered: {
    title: 'Partial compensation ordered',
    description: 'Orders a lower adjustment amount and creates the payment/proof obligation.',
  },
  mutual_settlement_recorded: {
    title: 'Mutual settlement recorded',
    description:
      'Records a buyer/seller settlement and creates payment work only if money is still owed.',
  },
  closed_insufficient_evidence: {
    title: 'Closed insufficient evidence',
    description: 'Closes the case when admin cannot fairly prove either side.',
  },
  order_cancelled_by_admin: {
    title: 'Order cancelled by admin',
    description:
      'Cancels/reverses the order. Refund, vehicle return, and ownership reversal obligations are generated from the current order state.',
  },
};

const COMPENSATION_DECISIONS = new Set([
  'full_compensation_ordered',
  'partial_compensation_ordered',
  'mutual_settlement_recorded',
]);

const ZERO_COMPENSATION_DECISIONS = new Set([
  'claim_rejected',
  'closed_insufficient_evidence',
  'order_cancelled_by_admin',
]);

function textareaClass(error?: boolean) {
  return [
    'min-h-28 w-full rounded-[12px] border bg-white px-3.5 py-2.5 text-sm text-cv-gray-900 transition-colors focus:outline-none',
    error
      ? 'border-[#EE9E99]'
      : 'border-[#D5D7DA] hover:border-cv-gray-400 focus:border-cv-gray-400',
  ].join(' ');
}

function evidenceForIssue(caseData: ArbitrationCaseDetail, issueId: string) {
  return caseData.evidence.filter((evidence) => evidence.issue_item === issueId);
}

const isImageEvidence = (item: ArbitrationEvidence) => item.content_type?.startsWith('image/');

function toInlineUrl(url: string) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}inline=1`;
}

function SelectField({
  label,
  value,
  onChange,
  error,
  disabled,
  children,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-semibold text-cv-gray-500">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={[
          'w-full rounded-[12px] border bg-white px-3.5 py-2.5 text-sm text-cv-gray-900 transition-colors focus:outline-none',
          disabled ? 'cursor-not-allowed opacity-70' : '',
          error
            ? 'border-[#EE9E99]'
            : 'border-[#D5D7DA] hover:border-cv-gray-400 focus:border-cv-gray-400',
        ].join(' ')}
      >
        {children}
      </select>
      {error ? <ErrorLabel text={error} /> : null}
    </label>
  );
}

function ZoomableEvidenceImage({ image }: { image: string }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const zoom = (nextScale: number) => {
    const clamped = Math.min(5, Math.max(1, nextScale));
    setScale(clamped);
    if (clamped === 1) setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative h-[60vh] overflow-hidden rounded-2xl bg-cv-gray-10 sm:h-[70vh]"
      onWheel={(event) => {
        event.preventDefault();
        zoom(scale + (event.deltaY < 0 ? 0.25 : -0.25));
      }}
      onMouseDown={(event) => {
        if (scale <= 1) return;
        dragStartRef.current = {
          x: event.clientX,
          y: event.clientY,
          px: position.x,
          py: position.y,
        };
      }}
      onMouseMove={(event) => {
        if (!dragStartRef.current) return;
        setPosition({
          x: dragStartRef.current.px + event.clientX - dragStartRef.current.x,
          y: dragStartRef.current.py + event.clientY - dragStartRef.current.y,
        });
      }}
      onMouseUp={() => {
        dragStartRef.current = null;
      }}
      onMouseLeave={() => {
        dragStartRef.current = null;
      }}
    >
      <div className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-xl border border-cv-gray-50 bg-white/95 shadow">
        <button
          type="button"
          title="Zoom out"
          disabled={scale <= 1}
          onClick={() => zoom(scale - 0.5)}
          className="grid size-10 place-items-center text-cv-gray-600 transition hover:bg-cv-gray-10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          title="Reset zoom"
          onClick={() => zoom(1)}
          className="grid size-10 place-items-center border-x border-cv-gray-50 text-cv-gray-600 transition hover:bg-cv-gray-10"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          title="Zoom in"
          disabled={scale >= 5}
          onClick={() => zoom(scale + 0.5)}
          className="grid size-10 place-items-center text-cv-gray-600 transition hover:bg-cv-gray-10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        draggable={false}
        className="h-full w-full select-none object-contain transition-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          cursor: scale > 1 ? 'grab' : 'zoom-in',
        }}
        onDoubleClick={() => zoom(scale >= 3 ? 1 : scale + 1)}
      />
    </div>
  );
}

function EvidenceViewer({ evidence }: { evidence: ArbitrationEvidence[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const imageEvidence = useMemo(
    () => evidence.filter((item) => item.file_url && isImageEvidence(item)),
    [evidence],
  );

  const sliderSettings: Settings = {
    dots: false,
    arrows: false,
    infinite: imageEvidence.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    initialSlide: selectedImageIndex || 0,
    beforeChange: (_current, next) => setActiveImageIndex(next),
  };

  if (!evidence.length) {
    return <p className="text-sm text-cv-gray-400">No evidence files attached.</p>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="text-sm font-bold text-cv-primary-500 underline underline-offset-4"
      >
        {evidence.length} evidence files
      </button>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 460 } } }}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-cv-gray-50 px-5 py-5">
            <h2 className="text-2xl font-black tracking-tight text-cv-gray-900">Evidence</h2>
            <p className="mt-1 text-sm leading-6 text-cv-gray-400">
              Review uploaded photos and documents.
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="grid grid-cols-2 gap-3">
              {evidence.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (!item.file_url) return;
                    if (isImageEvidence(item)) {
                      const imageIndex = imageEvidence.findIndex((image) => image.id === item.id);
                      setActiveImageIndex(imageIndex >= 0 ? imageIndex : 0);
                      setDrawerOpen(false);
                      setSelectedImageIndex(imageIndex >= 0 ? imageIndex : 0);
                      return;
                    }
                    window.open(toInlineUrl(item.file_url), '_blank', 'noopener,noreferrer');
                  }}
                  className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 p-2 text-left transition hover:bg-white"
                >
                  <div className="grid aspect-video place-content-center overflow-hidden rounded-xl bg-white">
                    {item.file_url && isImageEvidence(item) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={toInlineUrl(item.file_url)}
                        alt={item.original_filename}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <HiOutlineDocumentText className="size-8 text-cv-primary-400" />
                    )}
                  </div>
                  <p className="mt-2 truncate text-xs font-bold text-cv-gray-700">
                    {item.original_filename}
                  </p>
                  <p className="text-xs text-cv-gray-300">
                    {(item.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      <CvModal
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        title="Evidence Preview"
        size="lg"
        wrapperClassNames="w-full"
      >
        {selectedImageIndex !== null ? (
          <div>
            <Slider
              key={`${selectedImageIndex}-${imageEvidence.length}`}
              ref={(slider) => {
                sliderRef.current = slider;
              }}
              {...sliderSettings}
            >
              {imageEvidence.map((item) => (
                <div key={item.id}>
                  {item.file_url ? (
                    <ZoomableEvidenceImage image={toInlineUrl(item.file_url)} />
                  ) : null}
                </div>
              ))}
            </Slider>
            {imageEvidence.length > 1 ? (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {imageEvidence.map((item, index) => {
                  if (!item.file_url) return null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(index);
                        sliderRef.current?.slickGoTo(index);
                      }}
                      className={[
                        'h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition',
                        activeImageIndex === index
                          ? 'border-cv-secondary-600'
                          : 'border-cv-gray-50 hover:border-cv-secondary-500',
                      ].join(' ')}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toInlineUrl(item.file_url)}
                        alt={item.original_filename}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </CvModal>
    </>
  );
}

function actorLabel(
  caseData: Pick<ArbitrationCaseDetail, 'buyer' | 'seller'>,
  actorId?: string | null,
) {
  if (!actorId) return 'System';
  if (actorId === caseData.buyer) return 'Buyer';
  if (actorId === caseData.seller) return 'Seller';
  return 'Super Admin';
}

function getLatestPartyResponse(messages: ArbitrationMessage[], senderId: string) {
  return [...messages]
    .filter((message) => message.sender === senderId && message.response_type)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
}

function getDecisionContext(caseData: ArbitrationCaseDetail) {
  const latestSellerResponse = getLatestPartyResponse(caseData.messages, caseData.seller);
  const latestBuyerResponse = getLatestPartyResponse(caseData.messages, caseData.buyer);

  const sellerAcceptedResponsibility = ['accept', 'counter'].includes(
    latestSellerResponse?.response_type ?? '',
  );
  const isMutualSettlement =
    latestSellerResponse?.response_type === 'counter' &&
    latestBuyerResponse?.response_type === 'accept';
  const sellerAcceptedFullClaim = latestSellerResponse?.response_type === 'accept';
  const settlementAmount = isMutualSettlement
    ? latestSellerResponse?.proposed_amount || caseData.claimed_amount
    : sellerAcceptedFullClaim
      ? caseData.claimed_amount
      : null;

  return {
    sellerAcceptedResponsibility,
    sellerAcceptedFullClaim,
    isMutualSettlement,
    settlementAmount,
  };
}

function buildDecisionDefaults(caseData: ArbitrationCaseDetail): DecisionFormValues {
  const context = getDecisionContext(caseData);
  const decisionType = context.isMutualSettlement
    ? 'mutual_settlement_recorded'
    : context.sellerAcceptedFullClaim
      ? 'full_compensation_ordered'
      : 'partial_compensation_ordered';
  const compensationAmount = context.settlementAmount ?? caseData.claimed_amount;
  const hasAmount = Number(compensationAmount || 0) > 0;

  return {
    decision_type: decisionType,
    fault_party: context.sellerAcceptedResponsibility ? 'seller' : 'seller',
    order_outcome: 'completed_with_adjustment',
    compensation_amount: compensationAmount,
    compensation_payer: hasAmount ? 'seller' : '',
    create_compensation_obligation: hasAmount,
    seller_restriction_type: '',
    seller_restriction_reason: '',
    decision_note: '',
  };
}

function ArbitrationTimeline({
  caseData,
  events,
}: {
  caseData: ArbitrationCaseDetail;
  events: ArbitrationTimelineEvent[];
}) {
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [events],
  );
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleEvents = sortedEvents.slice(0, visibleCount);

  return (
    <div id="superadmin-arbitration-timeline" className="max-h-[460px] overflow-y-auto pr-2">
      <InfiniteScroll
        dataLength={visibleEvents.length}
        next={() => setVisibleCount((count) => Math.min(count + 10, sortedEvents.length))}
        hasMore={visibleCount < sortedEvents.length}
        loader={<p className="py-3 text-sm text-cv-gray-400">Loading more events...</p>}
        scrollableTarget="superadmin-arbitration-timeline"
      >
        <div className="space-y-3">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-cv-gray-900">{titleCase(event.event_type)}</p>
                  <p className="text-xs font-semibold text-cv-gray-300">
                    {actorLabel(caseData, event.actor)}
                  </p>
                </div>
                <p className="text-xs text-cv-gray-300">{formatDate(event.created_at)}</p>
              </div>
              {event.message ? (
                <p className="mt-2 text-sm leading-6 text-cv-gray-500">{event.message}</p>
              ) : null}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

function InspectionCard({
  inspection,
  caseId,
  caseData,
}: {
  inspection: ArbitrationInspectionRequest;
  caseId: string;
  caseData: ArbitrationCaseDetail;
}) {
  const [approveInspection, approveState] = useApproveSuperAdminArbitrationInspectionMutation();
  const canApprove = inspection.status === 'requested';
  const requestedBy = actorLabel(caseData, inspection.requested_by);

  async function handleApprove() {
    try {
      await approveInspection({
        caseId,
        inspection_request_id: inspection.id,
      }).unwrap();
      toast.success('Inspection request approved.');
    } catch {
      toast.error('Failed to approve inspection request.');
    }
  }

  return (
    <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <AdminStatusBadge status={inspection.status} />
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
            Requested by {requestedBy}
          </p>
          <p className="text-sm leading-6 text-cv-gray-500">{inspection.scope}</p>
          {inspection.report_summary || inspection.report_reference ? (
            <div className="rounded-xl border border-cv-gray-50 bg-white px-3 py-3">
              {inspection.report_summary ? (
                <p className="text-sm leading-6 text-cv-gray-600">{inspection.report_summary}</p>
              ) : null}
              {inspection.report_reference ? (
                <p className="mt-1 text-xs font-semibold text-cv-primary-500">
                  Report: {inspection.report_reference}
                </p>
              ) : null}
            </div>
          ) : null}
          <p className="text-xs text-cv-gray-300">
            Requested {formatDate(inspection.created_at)}
            {inspection.due_at ? ` • Due ${formatDate(inspection.due_at)}` : ''}
          </p>
        </div>
        {canApprove ? (
          <SubmitButton
            type="button"
            text="Approve"
            width="auto"
            loading={approveState.isLoading}
            onClick={handleApprove}
          />
        ) : null}
      </div>
    </div>
  );
}

function ObligationCard({
  caseId,
  obligation,
}: {
  caseId: string;
  obligation: ArbitrationObligation;
}) {
  const [uploadProof, uploadState] = useUploadSuperAdminArbitrationObligationProofMutation();
  const [reviewProof, reviewState] = useReviewSuperAdminArbitrationObligationProofMutation();
  const [waiveObligation, waiveState] = useWaiveSuperAdminArbitrationObligationMutation();

  const uploadForm = useForm<ProofUploadFormValues>({
    resolver: zodResolver(proofUploadSchema),
    defaultValues: { file: null, note: '' },
  });
  const reviewForm = useForm<ProofReviewFormValues>({
    resolver: zodResolver(proofReviewSchema),
    defaultValues: { note: '' },
  });
  const waiveForm = useForm<WaiveFormValues>({
    resolver: zodResolver(waiveSchema),
    defaultValues: { reason: '' },
  });

  async function handleUpload(values: ProofUploadFormValues) {
    if (!values.file) return;
    try {
      await uploadProof({
        caseId,
        obligation_id: obligation.id,
        file: values.file,
        note: values.note,
      }).unwrap();
      uploadForm.reset({ file: null, note: '' });
      toast.success('Proof uploaded.');
    } catch {
      toast.error('Failed to upload proof.');
    }
  }

  async function handleReview(status: 'verified' | 'rejected') {
    const values = reviewForm.getValues();
    const latestProof = obligation.proofs[0];
    if (!latestProof) return;
    try {
      await reviewProof({
        caseId,
        obligation_id: obligation.id,
        proof_id: latestProof.id,
        status,
        note: values.note,
      }).unwrap();
      reviewForm.reset({ note: '' });
      toast.success(status === 'verified' ? 'Proof verified.' : 'Proof rejected.');
    } catch {
      toast.error('Failed to review proof.');
    }
  }

  async function handleWaive(values: WaiveFormValues) {
    try {
      await waiveObligation({
        caseId,
        obligation_id: obligation.id,
        reason: values.reason,
      }).unwrap();
      waiveForm.reset({ reason: '' });
      toast.success('Obligation waived.');
    } catch {
      toast.error('Failed to waive obligation.');
    }
  }

  const canManage = !['verified', 'waived'].includes(obligation.status);

  return (
    <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <AdminStatusBadge status={obligation.status} />
        <span className="text-sm font-bold text-cv-gray-900">
          {titleCase(obligation.obligation_type)}
        </span>
      </div>
      {obligation.amount ? (
        <p className="mt-2 text-sm font-bold text-cv-gray-900">
          {formatCurrency(obligation.amount)}
        </p>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-cv-gray-500">{obligation.description}</p>
      <p className="mt-2 text-xs text-cv-gray-300">
        Due {obligation.due_at ? formatDate(obligation.due_at) : 'not set'}
      </p>

      <div className="mt-4 space-y-3 border-t border-cv-gray-50 pt-4">
        <p className="text-sm font-bold text-cv-gray-900">Proofs</p>
        {obligation.proofs.length ? (
          obligation.proofs.map((proof) => (
            <a
              key={proof.id}
              href={proof.file_url ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-cv-gray-50 bg-white px-3 py-2 text-sm font-semibold text-cv-gray-600"
            >
              Proof uploaded {formatDate(proof.created_at)}
              {proof.reviewed_at ? ` • Reviewed ${formatDate(proof.reviewed_at)}` : ''}
            </a>
          ))
        ) : (
          <p className="text-sm text-cv-gray-400">No proof uploaded yet.</p>
        )}

        {canManage ? (
          <form className="space-y-3" onSubmit={uploadForm.handleSubmit(handleUpload)}>
            <Controller
              control={uploadForm.control}
              name="file"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <>
                  <input
                    type="file"
                    onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-cv-gray-500"
                  />
                  {error?.message ? <ErrorLabel text={error.message} /> : null}
                </>
              )}
            />
            <Controller
              control={uploadForm.control}
              name="note"
              render={({ field }) => (
                <CvInput label="Proof Note" placeholder="Optional" {...field} />
              )}
            />
            <SubmitButton text="Upload Proof" loading={uploadState.isLoading} />
          </form>
        ) : null}

        {obligation.proofs.length && canManage ? (
          <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
            <Controller
              control={reviewForm.control}
              name="note"
              render={({ field }) => (
                <CvInput label="Review Note" placeholder="Optional proof review note" {...field} />
              )}
            />
            <div className="flex flex-wrap gap-2">
              <SubmitButton
                type="button"
                text="Verify Proof"
                width="auto"
                loading={reviewState.isLoading}
                onClick={() => handleReview('verified')}
              />
              <SubmitButton
                type="button"
                text="Reject Proof"
                width="auto"
                variant="base"
                loading={reviewState.isLoading}
                onClick={() => handleReview('rejected')}
              />
            </div>
          </form>
        ) : null}

        {canManage ? (
          <form className="space-y-3" onSubmit={waiveForm.handleSubmit(handleWaive)}>
            <Controller
              control={waiveForm.control}
              name="reason"
              render={({ field }) => (
                <CvInput label="Waive Reason" placeholder="Optional" {...field} />
              )}
            />
            <SubmitButton text="Waive Obligation" variant="base" loading={waiveState.isLoading} />
          </form>
        ) : null}
      </div>
    </div>
  );
}

function RestrictionCard({
  caseId,
  restriction,
}: {
  caseId: string;
  restriction: ArbitrationRestriction;
}) {
  const [removeRestriction, removeState] = useRemoveSuperAdminArbitrationRestrictionMutation();
  const form = useForm<RemoveRestrictionFormValues>({
    resolver: zodResolver(removeRestrictionSchema),
    defaultValues: { reason: '' },
  });

  async function handleRemove(values: RemoveRestrictionFormValues) {
    try {
      await removeRestriction({
        caseId,
        restriction_id: restriction.id,
        reason: values.reason,
      }).unwrap();
      form.reset({ reason: '' });
      toast.success('Restriction removed.');
    } catch {
      toast.error('Failed to remove restriction.');
    }
  }

  return (
    <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <AdminStatusBadge status={restriction.status} />
        <span className="text-sm font-bold text-cv-gray-900">
          {titleCase(restriction.restriction_type)}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-cv-gray-500">{restriction.reason}</p>
      {restriction.status === 'active' ? (
        <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(handleRemove)}>
          <Controller
            control={form.control}
            name="reason"
            render={({ field }) => (
              <CvInput label="Removal Reason" placeholder="Optional" {...field} />
            )}
          />
          <SubmitButton text="Remove Restriction" loading={removeState.isLoading} />
        </form>
      ) : null}
    </div>
  );
}

export function ArbitrationCaseDetailView({ id }: { id: string }) {
  const { data, isLoading } = useGetSuperAdminArbitrationCaseQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [inspectionWarningOpen, setInspectionWarningOpen] = useState(false);
  const [decisionReviewOpen, setDecisionReviewOpen] = useState(false);
  const [decisionAgreement, setDecisionAgreement] = useState(false);
  const [decisionPreview, setDecisionPreview] = useState<ArbitrationAdminDecisionPreview | null>(
    null,
  );
  const [pendingDecisionPayload, setPendingDecisionPayload] =
    useState<ArbitrationAdminDecisionPayload | null>(null);
  const initializedDecisionCaseRef = useRef<string | null>(null);
  const [addNote, addNoteState] = useAddSuperAdminArbitrationNoteMutation();
  const [escalateCase, escalateState] = useEscalateSuperAdminArbitrationCaseMutation();
  const [issueDecision, issueDecisionState] = useIssueSuperAdminArbitrationDecisionMutation();
  const [previewDecision, previewDecisionState] = usePreviewSuperAdminArbitrationDecisionMutation();
  const [requestInspection, requestInspectionState] =
    useRequestSuperAdminArbitrationInspectionMutation();

  const noteForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { message: '' },
  });
  const escalateForm = useForm<EscalateFormValues>({
    resolver: zodResolver(escalateSchema),
    defaultValues: { reason: 'manual_admin_review' },
  });
  const inspectionRequestForm = useForm<InspectionRequestFormValues>({
    resolver: zodResolver(inspectionRequestSchema),
    defaultValues: { scope: '' },
  });
  const decisionForm = useForm<DecisionFormValues>({
    resolver: zodResolver(decisionSchema),
    defaultValues: {
      decision_type: 'partial_compensation_ordered',
      fault_party: 'seller',
      order_outcome: 'completed_with_adjustment',
      compensation_amount: data?.claimed_amount ?? '0.00',
      compensation_payer: 'seller',
      create_compensation_obligation: true,
      seller_restriction_type: '',
      seller_restriction_reason: '',
      decision_note: '',
    },
  });
  const decisionType = decisionForm.watch('decision_type');
  const faultParty = decisionForm.watch('fault_party');
  const compensationAmount = decisionForm.watch('compensation_amount');
  const hasCompensationAmount = Number(compensationAmount || 0) > 0;
  const canUseCompensationFields = COMPENSATION_DECISIONS.has(decisionType);
  const decisionContext = useMemo(() => (data ? getDecisionContext(data) : null), [data]);
  const shouldLockSellerResponsibility =
    Boolean(decisionContext?.sellerAcceptedResponsibility) &&
    COMPENSATION_DECISIONS.has(decisionType);
  const shouldLockMutualSettlementAmount =
    decisionType === 'mutual_settlement_recorded' && Boolean(decisionContext?.isMutualSettlement);
  const canRestrictSeller = faultParty === 'seller' || faultParty === 'shared';

  useEffect(() => {
    if (!data || data.decision || initializedDecisionCaseRef.current === data.id) return;

    decisionForm.reset(buildDecisionDefaults(data));
    initializedDecisionCaseRef.current = data.id;
  }, [data, decisionForm]);

  useEffect(() => {
    if (!data) return;

    if (decisionType === 'full_compensation_ordered') {
      decisionForm.setValue('compensation_amount', data.claimed_amount);
      decisionForm.setValue(
        'compensation_payer',
        decisionContext?.sellerAcceptedResponsibility ? 'seller' : 'seller',
      );
      decisionForm.setValue('create_compensation_obligation', true);
      decisionForm.setValue('order_outcome', 'completed_with_adjustment');
      if (shouldLockSellerResponsibility) {
        decisionForm.setValue('fault_party', 'seller');
      }
      return;
    }

    if (decisionType === 'partial_compensation_ordered') {
      if (!hasCompensationAmount) {
        decisionForm.setValue('compensation_amount', data.claimed_amount);
      }
      decisionForm.setValue('compensation_payer', hasCompensationAmount ? 'seller' : '');
      decisionForm.setValue('create_compensation_obligation', true);
      decisionForm.setValue('order_outcome', 'completed_with_adjustment');
      if (shouldLockSellerResponsibility) {
        decisionForm.setValue('fault_party', 'seller');
      }
      return;
    }

    if (decisionType === 'mutual_settlement_recorded') {
      const settlementAmount = decisionContext?.settlementAmount ?? data.claimed_amount;
      decisionForm.setValue('compensation_amount', settlementAmount);
      decisionForm.setValue(
        'compensation_payer',
        Number(settlementAmount || 0) > 0 ? 'seller' : '',
      );
      decisionForm.setValue('create_compensation_obligation', Number(settlementAmount || 0) > 0);
      decisionForm.setValue('order_outcome', 'completed_with_adjustment');
      if (shouldLockSellerResponsibility) {
        decisionForm.setValue('fault_party', 'seller');
      }
      return;
    }

    if (ZERO_COMPENSATION_DECISIONS.has(decisionType)) {
      decisionForm.setValue('compensation_amount', '0.00');
      decisionForm.setValue('compensation_payer', '');
      decisionForm.setValue('create_compensation_obligation', false);
      if (decisionType === 'order_cancelled_by_admin') {
        decisionForm.setValue('order_outcome', 'cancelled_by_admin');
      } else {
        decisionForm.setValue('order_outcome', 'order_unchanged');
      }
    }
  }, [
    data,
    decisionContext,
    decisionForm,
    decisionType,
    hasCompensationAmount,
    shouldLockSellerResponsibility,
  ]);

  useEffect(() => {
    if (!canRestrictSeller) {
      decisionForm.setValue('seller_restriction_type', '');
      decisionForm.setValue('seller_restriction_reason', '');
    }
  }, [canRestrictSeller, decisionForm]);

  async function handleAddNote(values: NoteFormValues) {
    try {
      await addNote({ caseId: id, message: values.message }).unwrap();
      noteForm.reset({ message: '' });
      toast.success('Admin note added.');
    } catch {
      toast.error('Failed to add admin note.');
    }
  }

  async function handleEscalate(values: EscalateFormValues) {
    try {
      await escalateCase({ caseId: id, reason: values.reason }).unwrap();
      toast.success('Case moved to admin review.');
    } catch {
      toast.error('Failed to escalate case.');
    }
  }

  function handleRequestInspectionPrompt() {
    setInspectionWarningOpen(true);
  }

  async function confirmRequestInspection() {
    const isValid = await inspectionRequestForm.trigger();
    if (!isValid) {
      setInspectionWarningOpen(false);
      return;
    }
    const values = inspectionRequestForm.getValues();
    try {
      await requestInspection({ caseId: id, scope: values.scope }).unwrap();
      inspectionRequestForm.reset({ scope: '' });
      setInspectionWarningOpen(false);
      toast.success('Inspection requested.');
    } catch {
      toast.error('Failed to request inspection.');
    }
  }

  function buildDecisionPayload(values: DecisionFormValues): ArbitrationAdminDecisionPayload {
    const numericCompensationAmount = Number(values.compensation_amount || 0);
    const shouldUseCompensationFields =
      COMPENSATION_DECISIONS.has(values.decision_type) && numericCompensationAmount > 0;

    return {
      caseId: id,
      decision_type: values.decision_type,
      fault_party: values.fault_party,
      order_outcome: values.order_outcome,
      compensation_amount: shouldUseCompensationFields ? values.compensation_amount : '0.00',
      decision_note: values.decision_note,
      compensation_payer: shouldUseCompensationFields
        ? (values.compensation_payer as 'buyer' | 'seller' | '')
        : '',
      create_compensation_obligation:
        shouldUseCompensationFields && values.create_compensation_obligation,
      seller_restriction_type: values.seller_restriction_type,
      seller_restriction_reason: values.seller_restriction_reason,
    };
  }

  async function handlePreviewDecision(values: DecisionFormValues) {
    const payload = buildDecisionPayload(values);

    try {
      const preview = await previewDecision(payload).unwrap();
      decisionForm.setValue('order_outcome', preview.order_outcome);
      setPendingDecisionPayload({ ...payload, order_outcome: preview.order_outcome });
      setDecisionPreview(preview);
      setDecisionAgreement(false);
      setDecisionReviewOpen(true);
    } catch {
      toast.error('Failed to prepare decision review.');
    }
  }

  async function confirmIssueDecision() {
    if (!pendingDecisionPayload || !decisionAgreement) {
      return;
    }

    try {
      await issueDecision(pendingDecisionPayload).unwrap();
      setDecisionReviewOpen(false);
      setDecisionAgreement(false);
      setDecisionPreview(null);
      setPendingDecisionPayload(null);
      toast.success('Arbitration decision issued.');
    } catch {
      toast.error('Failed to issue arbitration decision.');
    }
  }

  if (isLoading) {
    return (
      <AdminPageScaffold
        title="Arbitration Case"
        description="Loading case details, evidence, messages, and admin actions."
      >
        <div className="rounded-[22px] border border-cv-gray-50 bg-white px-6 py-10 text-sm text-cv-gray-400">
          Loading arbitration case...
        </div>
      </AdminPageScaffold>
    );
  }

  if (!data) {
    return (
      <AdminPageScaffold
        title="Arbitration Case"
        description="The requested case could not be found."
      >
        <Link href="/arbitration" className="text-sm font-semibold text-cv-primary-500">
          Back to arbitration
        </Link>
      </AdminPageScaffold>
    );
  }

  const adminNotes = data.messages.filter((message) => message.visibility === 'admin_only');
  const responses = data.messages.filter((message) => message.visibility !== 'admin_only');
  const canAdminRequestInspection = [
    'under_admin_review',
    'awaiting_post_inspection_review',
  ].includes(data.status);
  const isAlreadyUnderAdminReview = data.status === 'under_admin_review';
  const canMoveToAdminReview = !['closed', 'resolved', 'under_admin_review'].includes(data.status);
  const vehicleSnapshotUrl = data.vehicle_snapshot?.order
    ? `/orders/${data.vehicle_snapshot.order}/vehicle-snapshot`
    : '';

  return (
    <AdminPageScaffold
      title={data.case_number}
      description="Review the full arbitration record, party messages, evidence, inspection requests, and admin handling."
      actions={
        <div className="flex flex-wrap items-center justify-end gap-3">
          {vehicleSnapshotUrl ? (
            <Link
              href={vehicleSnapshotUrl}
              className="inline-flex items-center gap-2 rounded-xl border border-cv-primary-500 bg-white px-4 py-3 text-sm font-semibold text-cv-primary-500 transition-colors hover:bg-cv-gray-10"
            >
              <CarFront className="size-4" />
              View Vehicle
            </Link>
          ) : null}
          <Link
            href="/arbitration"
            className="inline-flex items-center gap-2 rounded-xl border border-cv-gray-50 bg-white px-4 py-3 text-sm font-semibold text-cv-gray-600 transition-colors hover:bg-cv-gray-10"
          >
            <HiOutlineArrowLeft className="size-4" />
            Back to queue
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <AdminSectionCard
            title="Case Overview"
            description="Core arbitration state and case-level claim information."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AdminKeyValueList
                items={[
                  { label: 'Status', value: <AdminStatusBadge status={data.status} /> },
                  { label: 'Order', value: data.order },
                  { label: 'Claimed Amount', value: formatCurrency(data.claimed_amount) },
                ]}
              />
              <AdminKeyValueList
                items={[
                  { label: 'Reason', value: titleCase(data.reason) },
                  { label: 'Severity', value: titleCase(data.severity) },
                  { label: 'Created', value: formatDate(data.created_at) },
                ]}
              />
              <AdminKeyValueList
                items={[
                  { label: 'Buyer', value: data.buyer },
                  { label: 'Seller', value: data.seller },
                  { label: 'Updated', value: formatDate(data.updated_at) },
                ]}
              />
            </div>
            <div className="mt-5 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                Claim Summary
              </p>
              <p className="mt-2 text-sm leading-6 text-cv-gray-600">{data.summary}</p>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Submitted Issues"
            description="Issue items and the evidence files attached to each item."
          >
            <div className="space-y-4">
              {data.issue_items.map((issue) => (
                <div key={issue.id} className="rounded-2xl border border-cv-gray-50 px-4 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-cv-gray-900">{issue.title}</h3>
                      <p className="text-sm font-semibold text-cv-gray-300">
                        {titleCase(issue.category)}
                      </p>
                    </div>
                    <AdminStatusBadge status={issue.status} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-cv-gray-500">{issue.description}</p>
                  <div className="mt-4">
                    <EvidenceViewer evidence={evidenceForIssue(data, issue.id)} />
                  </div>
                </div>
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Responses"
            description="Party-visible arbitration responses and settlement positions."
          >
            <div className="space-y-3">
              {responses.length ? (
                responses.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-cv-gray-900">
                        {actorLabel(data, message.sender)}
                      </span>
                      {message.response_type ? (
                        <AdminStatusBadge status={message.response_type} />
                      ) : null}
                      {message.proposed_amount ? (
                        <span className="text-sm font-bold text-cv-gray-900">
                          {formatCurrency(message.proposed_amount)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-cv-gray-600">{message.message}</p>
                    <p className="mt-2 text-xs text-cv-gray-300">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-cv-gray-400">No responses yet.</p>
              )}
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Timeline"
            description="Audit-style arbitration events for this case."
          >
            <ArbitrationTimeline caseData={data} events={data.timeline_events} />
          </AdminSectionCard>
        </div>

        <aside className="space-y-6">
          <AdminDetailsPanel
            title="Admin Actions"
            description="Move the case or add private case handling notes."
          >
            <div className="space-y-5">
              {isAlreadyUnderAdminReview ? (
                <p className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4 text-sm text-cv-gray-500">
                  This case is already under admin review.
                </p>
              ) : (
                <form className="space-y-3" onSubmit={escalateForm.handleSubmit(handleEscalate)}>
                  <Controller
                    control={escalateForm.control}
                    name="reason"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <CvInput
                          label="Escalation Reason"
                          error={Boolean(error?.message)}
                          {...field}
                        />
                        {error?.message ? <ErrorLabel text={error.message} /> : null}
                      </>
                    )}
                  />
                  <SubmitButton
                    text="Move to Admin Review"
                    loading={escalateState.isLoading}
                    disabled={!canMoveToAdminReview}
                  />
                </form>
              )}

              <form className="space-y-3" onSubmit={noteForm.handleSubmit(handleAddNote)}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-cv-gray-500">Private Admin Note</span>
                  <button
                    type="button"
                    onClick={() => setNotesDrawerOpen(true)}
                    className="text-sm font-bold text-cv-primary-500 underline underline-offset-4"
                  >
                    {adminNotes.length} notes
                  </button>
                </div>
                <Controller
                  control={noteForm.control}
                  name="message"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <label className="grid gap-2">
                        <textarea className={textareaClass(Boolean(error?.message))} {...field} />
                      </label>
                      {error?.message ? <ErrorLabel text={error.message} /> : null}
                    </>
                  )}
                />
                <SubmitButton text="Add Note" loading={addNoteState.isLoading} />
              </form>
            </div>
          </AdminDetailsPanel>

          <AdminDetailsPanel
            title="Inspection Requests"
            description="Approve party requests or initiate admin-owned inspections when required."
          >
            <div className="space-y-4">
              {canAdminRequestInspection ? (
                <form
                  className="space-y-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                  onSubmit={inspectionRequestForm.handleSubmit(handleRequestInspectionPrompt)}
                >
                  <Controller
                    control={inspectionRequestForm.control}
                    name="scope"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <label className="grid gap-2">
                          <span className="font-semibold text-cv-gray-500">
                            Admin Inspection Scope
                          </span>
                          <textarea
                            className={textareaClass(Boolean(error?.message))}
                            placeholder="Describe what the external inspection service should verify."
                            {...field}
                          />
                        </label>
                        {error?.message ? <ErrorLabel text={error.message} /> : null}
                      </>
                    )}
                  />
                  <SubmitButton
                    text="Request Inspection"
                    loading={requestInspectionState.isLoading}
                  />
                </form>
              ) : (
                <p className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4 text-sm text-cv-gray-400">
                  Admin inspection requests are unavailable in this case state.
                </p>
              )}

              {data.inspection_requests.length ? (
                data.inspection_requests.map((inspection) => (
                  <InspectionCard
                    key={inspection.id}
                    caseId={data.id}
                    caseData={data}
                    inspection={inspection}
                  />
                ))
              ) : (
                <p className="text-sm text-cv-gray-400">No inspection requests yet.</p>
              )}
            </div>
          </AdminDetailsPanel>

          <AdminDetailsPanel
            title="Decision Workspace"
            description="Issue the final platform decision and create the required compliance work."
          >
            {data.decision ? (
              <div className="space-y-4">
                <AdminKeyValueList
                  items={[
                    { label: 'Decision', value: titleCase(data.decision.decision_type) },
                    { label: 'Fault Party', value: titleCase(data.decision.fault_party) },
                    { label: 'Order Outcome', value: titleCase(data.decision.order_outcome) },
                    {
                      label: 'Compensation',
                      value: formatCurrency(data.decision.compensation_amount),
                    },
                    { label: 'Issued', value: formatDate(data.decision.issued_at) },
                  ]}
                />
                <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                    Decision Note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-cv-gray-600">
                    {data.decision.decision_note}
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={decisionForm.handleSubmit(handlePreviewDecision)}
              >
                <Controller
                  control={decisionForm.control}
                  name="decision_type"
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      label="Decision Type"
                      value={field.value}
                      onChange={field.onChange}
                      error={error?.message}
                    >
                      <option value="claim_rejected">Claim Rejected</option>
                      <option value="full_compensation_ordered">Full Compensation Ordered</option>
                      <option value="partial_compensation_ordered">
                        Partial Compensation Ordered
                      </option>
                      <option value="mutual_settlement_recorded">Mutual Settlement Recorded</option>
                      <option value="closed_insufficient_evidence">
                        Closed Insufficient Evidence
                      </option>
                      <option value="order_cancelled_by_admin">Order Cancelled By Admin</option>
                    </SelectField>
                  )}
                />

                <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
                  <p className="text-sm font-semibold text-cv-gray-600">
                    {DECISION_HELP[decisionType]?.title || 'Decision guidance'}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-cv-gray-500">
                    {DECISION_HELP[decisionType]?.description ||
                      'Choose the final ruling. Related fields will adjust automatically.'}
                  </p>
                </div>

                <Controller
                  control={decisionForm.control}
                  name="fault_party"
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      label="Fault Party"
                      value={field.value}
                      onChange={field.onChange}
                      error={error?.message}
                      disabled={shouldLockSellerResponsibility}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="shared">Shared</option>
                      <option value="none">None</option>
                      <option value="undetermined">Undetermined</option>
                    </SelectField>
                  )}
                />

                <Controller
                  control={decisionForm.control}
                  name="order_outcome"
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      label="Order Outcome"
                      value={field.value}
                      onChange={field.onChange}
                      error={error?.message}
                      disabled
                    >
                      <option value="order_unchanged">Order Unchanged</option>
                      <option value="completed_with_adjustment">Completed With Adjustment</option>
                      <option value="cancelled_by_admin">Cancelled By Admin</option>
                      <option value="ownership_reversal_pending">Ownership Reversal Pending</option>
                    </SelectField>
                  )}
                />

                <Controller
                  control={decisionForm.control}
                  name="compensation_amount"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <CvInput
                        label="Compensation Amount"
                        type="number"
                        min="0"
                        disabled={!canUseCompensationFields || shouldLockMutualSettlementAmount}
                        error={Boolean(error?.message)}
                        {...field}
                      />
                      {error?.message ? <ErrorLabel text={error.message} /> : null}
                    </>
                  )}
                />

                <Controller
                  control={decisionForm.control}
                  name="compensation_payer"
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      label="Compensation Payer"
                      value={field.value}
                      onChange={field.onChange}
                      error={error?.message}
                      disabled={
                        !canUseCompensationFields ||
                        !hasCompensationAmount ||
                        shouldLockSellerResponsibility
                      }
                    >
                      <option value="">No payment obligation</option>
                      <option value="seller">Seller</option>
                      <option value="buyer">Buyer</option>
                    </SelectField>
                  )}
                />

                {canUseCompensationFields && hasCompensationAmount ? (
                  <div className="space-y-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
                    <Controller
                      control={decisionForm.control}
                      name="create_compensation_obligation"
                      render={({ field }) => (
                        <label className="flex items-start gap-3 text-sm font-semibold text-cv-gray-600">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(event) => field.onChange(event.target.checked)}
                            className="mt-1"
                          />
                          Create compensation obligation
                        </label>
                      )}
                    />
                  </div>
                ) : null}

                <div className="rounded-2xl border border-cv-gray-50 bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-cv-gray-600">Review before issuing</p>
                  <p className="mt-2 text-sm leading-6 text-cv-gray-500">
                    Use the review step to fetch the backend-calculated order outcome, obligation
                    list, and warnings before the decision is recorded.
                  </p>
                </div>

                <Controller
                  control={decisionForm.control}
                  name="seller_restriction_type"
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      label="Seller Restriction"
                      value={field.value}
                      onChange={field.onChange}
                      error={error?.message}
                      disabled={!canRestrictSeller}
                    >
                      <option value="">No restriction</option>
                      <option value="account_warning_only">Warning Only</option>
                      <option value="seller_block_new_listings">Block Seller New Listings</option>
                      <option value="seller_block_new_order_opportunities">
                        Block Seller New Order Opportunities
                      </option>
                    </SelectField>
                  )}
                />

                <Controller
                  control={decisionForm.control}
                  name="seller_restriction_reason"
                  render={({ field }) => (
                    <CvInput
                      label="Restriction Reason"
                      placeholder={
                        canRestrictSeller ? 'Optional' : 'Requires seller or shared fault'
                      }
                      disabled={!canRestrictSeller}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={decisionForm.control}
                  name="decision_note"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <label className="grid gap-2">
                        <span className="font-semibold text-cv-gray-500">Decision Note</span>
                        <textarea className={textareaClass(Boolean(error?.message))} {...field} />
                      </label>
                      {error?.message ? <ErrorLabel text={error.message} /> : null}
                    </>
                  )}
                />

                <SubmitButton
                  text="Review Decision"
                  loading={previewDecisionState.isLoading}
                  disabled={data.status === 'closed' || data.status === 'resolved'}
                />
              </form>
            )}
          </AdminDetailsPanel>

          <AdminDetailsPanel
            title="Obligations"
            description="Compliance work generated from the final decision."
          >
            <div className="space-y-3">
              {data.obligations.length ? (
                data.obligations.map((obligation) => (
                  <ObligationCard key={obligation.id} caseId={data.id} obligation={obligation} />
                ))
              ) : (
                <p className="text-sm text-cv-gray-400">No obligations yet.</p>
              )}
            </div>
          </AdminDetailsPanel>

          <AdminDetailsPanel
            title="Restrictions"
            description="Account restrictions applied from arbitration decisions."
          >
            <div className="space-y-3">
              {data.restrictions.length ? (
                data.restrictions.map((restriction) => (
                  <RestrictionCard
                    key={restriction.id}
                    caseId={data.id}
                    restriction={restriction}
                  />
                ))
              ) : (
                <p className="text-sm text-cv-gray-400">No restrictions applied.</p>
              )}
            </div>
          </AdminDetailsPanel>
        </aside>
      </div>

      <Drawer
        anchor="right"
        open={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 460 } } }}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-cv-gray-50 px-5 py-5">
            <h2 className="text-2xl font-black tracking-tight text-cv-gray-900">
              Private Admin Notes
            </h2>
            <p className="mt-1 text-sm leading-6 text-cv-gray-400">
              Internal handling notes are visible to superadmin users only.
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-3">
              {adminNotes.length ? (
                adminNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                  >
                    <p className="text-sm leading-6 text-cv-gray-600">{note.message}</p>
                    <p className="mt-2 text-xs text-cv-gray-300">{formatDate(note.created_at)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-cv-gray-400">No private notes yet.</p>
              )}
            </div>
          </div>
        </div>
      </Drawer>

      <CvModal
        isOpen={decisionReviewOpen}
        onClose={() => {
          setDecisionReviewOpen(false);
          setDecisionAgreement(false);
        }}
        title="Review Decision"
        size="lg"
      >
        <div className="space-y-5">
          {decisionPreview ? (
            <>
              {decisionPreview.warnings.length ? (
                <div className="rounded-2xl border border-[#F2D7A1] bg-[#FFF8E8] px-4 py-4">
                  <p className="text-sm font-semibold text-cv-gray-900">
                    Review these consequences before issuing the decision
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-cv-gray-600">
                    {decisionPreview.warnings.map((warning) => (
                      <li key={warning.code}>{warning.message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                    Decision
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-cv-gray-600">
                    <p>
                      <span className="font-semibold text-cv-gray-900">Type:</span>{' '}
                      {decisionPreview.decision_type_label}
                    </p>
                    <p>
                      <span className="font-semibold text-cv-gray-900">Fault Party:</span>{' '}
                      {decisionPreview.fault_party_label}
                    </p>
                    <p>
                      <span className="font-semibold text-cv-gray-900">Order Outcome:</span>{' '}
                      {decisionPreview.order_outcome_label}
                    </p>
                    <p>
                      <span className="font-semibold text-cv-gray-900">Compensation:</span>{' '}
                      {formatCurrency(decisionPreview.compensation_amount)}
                    </p>
                    <p>
                      <span className="font-semibold text-cv-gray-900">Compensation Payer:</span>{' '}
                      {decisionPreview.compensation_payer
                        ? titleCase(decisionPreview.compensation_payer)
                        : 'None'}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                    Decision Note
                  </p>
                  <p className="mt-3 text-sm leading-6 text-cv-gray-600">
                    {decisionPreview.decision_note || 'No additional note provided.'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cv-gray-50 bg-white px-4 py-4">
                <p className="text-sm font-semibold text-cv-gray-900">Generated obligations</p>
                <div className="mt-3 space-y-3">
                  {decisionPreview.generated_obligations.length ? (
                    decisionPreview.generated_obligations.map((obligation, index) => (
                      <div
                        key={`${obligation.obligation_type}-${index}`}
                        className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-cv-gray-900">
                            {obligation.obligation_type_label}
                          </p>
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                            {titleCase(obligation.assigned_role.replaceAll('_', ' '))}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-cv-gray-600">
                          {obligation.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-cv-gray-400">
                          <span>Due: {formatDate(obligation.due_at)}</span>
                          {obligation.amount ? (
                            <span>Amount: {formatCurrency(obligation.amount)}</span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-cv-gray-400">
                      No obligations will be generated for this decision.
                    </p>
                  )}
                </div>
              </div>

              {decisionPreview.generated_restrictions.length ? (
                <div className="rounded-2xl border border-cv-gray-50 bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-cv-gray-900">Generated restrictions</p>
                  <div className="mt-3 space-y-3">
                    {decisionPreview.generated_restrictions.map((restriction, index) => (
                      <div
                        key={`${restriction.restriction_type}-${index}`}
                        className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-cv-gray-900">
                          {restriction.restriction_type_label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-cv-gray-600">
                          {restriction.reason || 'No additional restriction reason provided.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <label className="flex items-start gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
                <input
                  type="checkbox"
                  checked={decisionAgreement}
                  onChange={(event) => setDecisionAgreement(event.target.checked)}
                  className="mt-1 size-4 rounded border-cv-gray-50"
                />
                <span className="text-sm leading-6 text-cv-gray-600">
                  I have reviewed the calculated outcome, obligations, and warnings, and I
                  understand this decision may create financial, compliance, or ownership-related
                  consequences for the parties.
                </span>
              </label>

              <div className="flex justify-end gap-3">
                <SubmitButton
                  type="button"
                  text="Back"
                  variant="base"
                  width="auto"
                  onClick={() => setDecisionReviewOpen(false)}
                />
                <SubmitButton
                  type="button"
                  text="Confirm & Issue Decision"
                  width="auto"
                  loading={issueDecisionState.isLoading}
                  disabled={!decisionAgreement}
                  onClick={confirmIssueDecision}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-cv-gray-400">Preparing decision review...</p>
          )}
        </div>
      </CvModal>

      <CvModal
        isOpen={inspectionWarningOpen}
        onClose={() => setInspectionWarningOpen(false)}
        title="Request Inspection"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-cv-gray-500">
            Inspection may involve fees. CarVu may assign the inspection cost to the party found at
            fault after review. Superadmin-requested inspections are auto-approved and should be
            used only when the decision depends on independent technical findings.
          </p>
          <div className="flex justify-end gap-3">
            <SubmitButton
              type="button"
              text="Cancel"
              variant="base"
              width="auto"
              onClick={() => setInspectionWarningOpen(false)}
            />
            <SubmitButton
              type="button"
              text="Confirm Request"
              width="auto"
              loading={requestInspectionState.isLoading}
              onClick={confirmRequestInspection}
            />
          </div>
        </div>
      </CvModal>
    </AdminPageScaffold>
  );
}
