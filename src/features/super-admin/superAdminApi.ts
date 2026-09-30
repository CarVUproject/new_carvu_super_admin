import { TAG_TYPES } from '@/constants/api.constants';
import { baseApi } from '@/store/baseApi';
import type {
  ArbitrationAdminEscalatePayload,
  ArbitrationAdminDecisionPayload,
  ArbitrationAdminDecisionPreview,
  ArbitrationAdminNotePayload,
  ArbitrationApproveInspectionPayload,
  ArbitrationCaseDetail,
  ArbitrationCaseSummary,
  ArbitrationInspectionRequest,
  ArbitrationListQueryParams,
  ArbitrationObligationProof,
  ArbitrationObligationProofReviewPayload,
  ArbitrationObligationProofUploadPayload,
  ArbitrationObligationWaivePayload,
  ArbitrationRequestInspectionPayload,
  ArbitrationRestrictionRemovePayload,
} from '@/types/arbitration';
import type {
  ApproveDealerPayload,
  AuditLogItem,
  AuditLogListQueryParams,
  AuctionDetail,
  AuctionListItem,
  AuctionListQueryParams,
  BusinessConfigResponse,
  CreateOrUpdateRolePayload,
  DashboardSummary,
  DealerFunnelReportSummary,
  DealerDetail,
  DealerListItem,
  DealerListQueryParams,
  FinancialReportSummary,
  ModuleItem,
  NegotiationDetail,
  NegotiationListItem,
  NegotiationListQueryParams,
  OrderDetail,
  OrderListItem,
  OrderListQueryParams,
  PaginatedResponse,
  ReferralCommissionDetail,
  ReferralCommissionItem,
  ReferralCommissionListQueryParams,
  RoleItem,
  SubscriptionPlanItem,
  SubscriptionPlanListQueryParams,
  SubscriptionPlanPayload,
  SubscriptionPolicyItem,
  UpdateSubscriptionPolicyPayload,
  UpdateBusinessConfigPayload,
  UpdateUserPayload,
  UserDetail,
  UserListItem,
  UserListQueryParams,
  DealerSubscriptionItem,
  DealerSubscriptionListQueryParams,
  HubListingDetail,
  HubListingListItem,
  HubListingListQueryParams,
  VehicleDetail,
  VehicleListItem,
  VehicleListQueryParams,
} from '@/types/super-admin';
import type { OrderVehicleSnapshot } from '@/types/order-snapshot';

function buildQueryString(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  if (!params) {
    return '';
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return;
    }

    query.set(key, String(value));
  });

  const builtQuery = query.toString();
  return builtQuery ? `?${builtQuery}` : '';
}

export const superAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboard: builder.query<DashboardSummary, void>({
      query: () => 'super-admin/dashboard/',
      providesTags: [TAG_TYPES.SUPER_ADMIN_DASHBOARD],
    }),
    getSuperAdminFinancialReport: builder.query<FinancialReportSummary, void>({
      query: () => 'super-admin/reports/financial/',
      providesTags: [TAG_TYPES.SUPER_ADMIN_FINANCIAL_REPORT],
    }),
    getSuperAdminDealerFunnelReport: builder.query<DealerFunnelReportSummary, void>({
      query: () => 'super-admin/reports/dealer-funnel/',
      providesTags: [TAG_TYPES.SUPER_ADMIN_DEALER_FUNNEL_REPORT],
    }),
    getSuperAdminAuditLogs: builder.query<
      PaginatedResponse<AuditLogItem>,
      AuditLogListQueryParams | undefined
    >({
      query: (params) => `super-admin/audit-logs/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_AUDIT_LOGS],
    }),
    getSuperAdminDealers: builder.query<PaginatedResponse<DealerListItem>, DealerListQueryParams>({
      query: (params) => `super-admin/dealers/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_DEALERS],
    }),
    getSuperAdminDealer: builder.query<DealerDetail, string>({
      query: (id) => `super-admin/dealers/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_DEALER, id }],
    }),
    approveSuperAdminDealer: builder.mutation<DealerDetail, ApproveDealerPayload>({
      query: ({ id, roles }) => ({
        url: `super-admin/dealers/${id}/approve/`,
        method: 'POST',
        body: { roles },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        TAG_TYPES.SUPER_ADMIN_DEALERS,
        TAG_TYPES.SUPER_ADMIN_DASHBOARD,
        { type: TAG_TYPES.SUPER_ADMIN_DEALER, id },
      ],
    }),
    rejectSuperAdminDealer: builder.mutation<DealerDetail, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `super-admin/dealers/${id}/reject/`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        TAG_TYPES.SUPER_ADMIN_DEALERS,
        TAG_TYPES.SUPER_ADMIN_DASHBOARD,
        { type: TAG_TYPES.SUPER_ADMIN_DEALER, id },
      ],
    }),
    getSuperAdminUsers: builder.query<PaginatedResponse<UserListItem>, UserListQueryParams>({
      query: (params) => `super-admin/users/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_USERS],
    }),
    getSuperAdminUser: builder.query<UserDetail, string>({
      query: (id) => `super-admin/users/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_USER, id }],
    }),
    updateSuperAdminUser: builder.mutation<UserDetail, { id: string; body: UpdateUserPayload }>({
      query: ({ id, body }) => ({
        url: `super-admin/users/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        TAG_TYPES.SUPER_ADMIN_USERS,
        { type: TAG_TYPES.SUPER_ADMIN_USER, id },
      ],
    }),
    getSuperAdminVehicles: builder.query<
      PaginatedResponse<VehicleListItem>,
      VehicleListQueryParams | undefined
    >({
      query: (params) => `super-admin/vehicles/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_VEHICLES],
    }),
    getSuperAdminVehicle: builder.query<VehicleDetail, string>({
      query: (id) => `super-admin/vehicles/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_VEHICLE, id }],
    }),
    getSuperAdminHubListings: builder.query<
      PaginatedResponse<HubListingListItem>,
      HubListingListQueryParams | undefined
    >({
      query: (params) => `super-admin/hub-listings/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_HUB_LISTINGS],
    }),
    getSuperAdminHubListing: builder.query<HubListingDetail, string>({
      query: (id) => `super-admin/hub-listings/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_HUB_LISTING, id }],
    }),
    getSuperAdminPublicAuctions: builder.query<
      PaginatedResponse<AuctionListItem>,
      AuctionListQueryParams | undefined
    >({
      query: (params) => `super-admin/public-auctions/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_PUBLIC_AUCTIONS],
    }),
    getSuperAdminPublicAuction: builder.query<AuctionDetail, string>({
      query: (id) => `super-admin/public-auctions/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_PUBLIC_AUCTION, id }],
    }),
    getSuperAdminWholesaleAuctions: builder.query<
      PaginatedResponse<AuctionListItem>,
      AuctionListQueryParams | undefined
    >({
      query: (params) => `super-admin/wholesale-auctions/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_WHOLESALE_AUCTIONS],
    }),
    getSuperAdminWholesaleAuction: builder.query<AuctionDetail, string>({
      query: (id) => `super-admin/wholesale-auctions/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: TAG_TYPES.SUPER_ADMIN_WHOLESALE_AUCTION, id },
      ],
    }),
    getSuperAdminNegotiations: builder.query<
      PaginatedResponse<NegotiationListItem>,
      NegotiationListQueryParams | undefined
    >({
      query: (params) => `super-admin/negotiations/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_NEGOTIATIONS],
    }),
    getSuperAdminNegotiation: builder.query<NegotiationDetail, string>({
      query: (id) => `super-admin/negotiations/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_NEGOTIATION, id }],
    }),
    getSuperAdminRoles: builder.query<PaginatedResponse<RoleItem>, { page?: number } | undefined>({
      query: (params) => `super-admin/roles/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_ROLES],
    }),
    getSuperAdminRole: builder.query<RoleItem, string>({
      query: (name) => `super-admin/roles/${encodeURIComponent(name)}/`,
      providesTags: (_result, _error, name) => [{ type: TAG_TYPES.SUPER_ADMIN_ROLE, id: name }],
    }),
    createSuperAdminRole: builder.mutation<RoleItem, CreateOrUpdateRolePayload>({
      query: (body) => ({
        url: 'super-admin/roles/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [TAG_TYPES.SUPER_ADMIN_ROLES],
    }),
    updateSuperAdminRole: builder.mutation<
      RoleItem,
      { name: string; body: CreateOrUpdateRolePayload }
    >({
      query: ({ name, body }) => ({
        url: `super-admin/roles/${encodeURIComponent(name)}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { name }) => [
        TAG_TYPES.SUPER_ADMIN_ROLES,
        { type: TAG_TYPES.SUPER_ADMIN_ROLE, id: name },
      ],
    }),
    deleteSuperAdminRole: builder.mutation<void, string>({
      query: (name) => ({
        url: `super-admin/roles/${encodeURIComponent(name)}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [TAG_TYPES.SUPER_ADMIN_ROLES],
    }),
    getSuperAdminModules: builder.query<
      PaginatedResponse<ModuleItem>,
      { page?: number } | undefined
    >({
      query: (params) => `super-admin/modules/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_MODULES],
    }),
    getSuperAdminBusinessConfig: builder.query<BusinessConfigResponse, void>({
      query: () => 'super-admin/business-config/',
      providesTags: [TAG_TYPES.SUPER_ADMIN_BUSINESS_CONFIG],
    }),
    updateSuperAdminBusinessConfig: builder.mutation<
      BusinessConfigResponse,
      UpdateBusinessConfigPayload
    >({
      query: (body) => ({
        url: 'super-admin/business-config/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [TAG_TYPES.SUPER_ADMIN_BUSINESS_CONFIG, TAG_TYPES.SUPER_ADMIN_DASHBOARD],
    }),
    getSuperAdminSubscriptionPlans: builder.query<
      PaginatedResponse<SubscriptionPlanItem>,
      SubscriptionPlanListQueryParams | undefined
    >({
      query: (params) => `super-admin/subscription-plans/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_PLANS],
    }),
    getSuperAdminSubscriptionPlan: builder.query<SubscriptionPlanItem, string>({
      query: (id) => `super-admin/subscription-plans/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_PLAN, id },
      ],
    }),
    createSuperAdminSubscriptionPlan: builder.mutation<
      SubscriptionPlanItem,
      SubscriptionPlanPayload
    >({
      query: (body) => ({
        url: 'super-admin/subscription-plans/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_PLANS],
    }),
    updateSuperAdminSubscriptionPlan: builder.mutation<
      SubscriptionPlanItem,
      { id: string; body: SubscriptionPlanPayload }
    >({
      query: ({ id, body }) => ({
        url: `super-admin/subscription-plans/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_PLANS,
        { type: TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_PLAN, id },
      ],
    }),
    getSuperAdminSubscriptionPolicies: builder.query<
      PaginatedResponse<SubscriptionPolicyItem>,
      { page?: number } | undefined
    >({
      query: (params) => `super-admin/subscription-policies/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_POLICIES],
    }),
    getSuperAdminSubscriptionPolicy: builder.query<SubscriptionPolicyItem, string>({
      query: (id) => `super-admin/subscription-policies/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_POLICY, id },
      ],
    }),
    updateSuperAdminSubscriptionPolicy: builder.mutation<
      SubscriptionPolicyItem,
      { id: string; body: UpdateSubscriptionPolicyPayload }
    >({
      query: ({ id, body }) => ({
        url: `super-admin/subscription-policies/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_POLICIES,
        { type: TAG_TYPES.SUPER_ADMIN_SUBSCRIPTION_POLICY, id },
      ],
    }),
    getSuperAdminDealerSubscriptions: builder.query<
      PaginatedResponse<DealerSubscriptionItem>,
      DealerSubscriptionListQueryParams | undefined
    >({
      query: (params) => `super-admin/dealer-subscriptions/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_DEALER_SUBSCRIPTIONS],
    }),
    getSuperAdminDealerSubscription: builder.query<DealerSubscriptionItem, string>({
      query: (id) => `super-admin/dealer-subscriptions/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: TAG_TYPES.SUPER_ADMIN_DEALER_SUBSCRIPTION, id },
      ],
    }),
    refreshSuperAdminDealerSubscriptionSnapshot: builder.mutation<DealerSubscriptionItem, string>({
      query: (id) => ({
        url: `super-admin/dealer-subscriptions/${id}/refresh-snapshot/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        TAG_TYPES.SUPER_ADMIN_DEALER_SUBSCRIPTIONS,
        { type: TAG_TYPES.SUPER_ADMIN_DEALER_SUBSCRIPTION, id },
      ],
    }),
    getSuperAdminReferralCommissions: builder.query<
      PaginatedResponse<ReferralCommissionItem>,
      ReferralCommissionListQueryParams | undefined
    >({
      query: (params) => `super-admin/referral-commissions/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_REFERRAL_COMMISSIONS],
    }),
    getSuperAdminReferralCommission: builder.query<ReferralCommissionDetail, string>({
      query: (id) => `super-admin/referral-commissions/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: TAG_TYPES.SUPER_ADMIN_REFERRAL_COMMISSION, id },
      ],
    }),
    markSuperAdminReferralCommissionPaid: builder.mutation<
      ReferralCommissionDetail,
      { id: string; payout_reference: string }
    >({
      query: ({ id, payout_reference }) => ({
        url: `super-admin/referral-commissions/${id}/mark-paid/`,
        method: 'POST',
        body: { payout_reference },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        TAG_TYPES.SUPER_ADMIN_REFERRAL_COMMISSIONS,
        { type: TAG_TYPES.SUPER_ADMIN_REFERRAL_COMMISSION, id },
      ],
    }),
    getSuperAdminOrders: builder.query<
      PaginatedResponse<OrderListItem>,
      OrderListQueryParams | undefined
    >({
      query: (params) => `super-admin/orders/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_ORDERS],
    }),
    getSuperAdminOrder: builder.query<OrderDetail, string>({
      query: (id) => `super-admin/orders/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_ORDER, id }],
    }),
    getSuperAdminOrderVehicleSnapshot: builder.query<OrderVehicleSnapshot, string>({
      query: (id) => `orders/${id}/vehicle-snapshot/`,
      providesTags: (_result, _error, id) => [
        { type: TAG_TYPES.SUPER_ADMIN_ORDER_VEHICLE_SNAPSHOT, id },
      ],
    }),
    getSuperAdminArbitrationCases: builder.query<
      PaginatedResponse<ArbitrationCaseSummary>,
      ArbitrationListQueryParams | undefined
    >({
      query: (params) => `arbitration/cases/${buildQueryString(params)}`,
      providesTags: [TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES],
    }),
    getSuperAdminArbitrationCase: builder.query<ArbitrationCaseDetail, string>({
      query: (id) => `arbitration/cases/${id}/`,
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id }],
    }),
    addSuperAdminArbitrationNote: builder.mutation<
      ArbitrationCaseDetail,
      ArbitrationAdminNotePayload
    >({
      query: ({ caseId, message }) => ({
        url: `arbitration/cases/${caseId}/admin/note/`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    escalateSuperAdminArbitrationCase: builder.mutation<
      ArbitrationCaseDetail,
      ArbitrationAdminEscalatePayload
    >({
      query: ({ caseId, reason }) => ({
        url: `arbitration/cases/${caseId}/admin/escalate/`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    approveSuperAdminArbitrationInspection: builder.mutation<
      ArbitrationInspectionRequest,
      ArbitrationApproveInspectionPayload
    >({
      query: ({ caseId, inspection_request_id }) => ({
        url: `arbitration/cases/${caseId}/admin/inspection/approve/`,
        method: 'POST',
        body: { inspection_request_id },
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    requestSuperAdminArbitrationInspection: builder.mutation<
      ArbitrationInspectionRequest,
      ArbitrationRequestInspectionPayload
    >({
      query: ({ caseId, scope }) => ({
        url: `arbitration/cases/${caseId}/inspection/request/`,
        method: 'POST',
        body: { scope },
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    issueSuperAdminArbitrationDecision: builder.mutation<
      ArbitrationCaseDetail,
      ArbitrationAdminDecisionPayload
    >({
      query: ({ caseId, ...body }) => ({
        url: `arbitration/cases/${caseId}/admin/decision/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    previewSuperAdminArbitrationDecision: builder.mutation<
      ArbitrationAdminDecisionPreview,
      ArbitrationAdminDecisionPayload
    >({
      query: ({ caseId, ...body }) => ({
        url: `arbitration/cases/${caseId}/admin/decision/preview/`,
        method: 'POST',
        body,
      }),
    }),
    uploadSuperAdminArbitrationObligationProof: builder.mutation<
      ArbitrationObligationProof,
      ArbitrationObligationProofUploadPayload
    >({
      query: ({ caseId, obligation_id, file, note }) => {
        const body = new FormData();
        body.append('obligation_id', obligation_id);
        body.append('file', file);
        if (note) body.append('note', note);
        return {
          url: `arbitration/cases/${caseId}/admin/obligation/proof/upload/`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    reviewSuperAdminArbitrationObligationProof: builder.mutation<
      ArbitrationCaseDetail,
      ArbitrationObligationProofReviewPayload
    >({
      query: ({ caseId, ...body }) => ({
        url: `arbitration/cases/${caseId}/admin/obligation/proof/review/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    waiveSuperAdminArbitrationObligation: builder.mutation<
      ArbitrationCaseDetail,
      ArbitrationObligationWaivePayload
    >({
      query: ({ caseId, ...body }) => ({
        url: `arbitration/cases/${caseId}/admin/obligation/waive/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
    removeSuperAdminArbitrationRestriction: builder.mutation<
      ArbitrationCaseDetail,
      ArbitrationRestrictionRemovePayload
    >({
      query: ({ caseId, ...body }) => ({
        url: `arbitration/cases/${caseId}/admin/restriction/remove/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { caseId }) => [
        TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASES,
        { type: TAG_TYPES.SUPER_ADMIN_ARBITRATION_CASE, id: caseId },
      ],
    }),
  }),
});

export const {
  useAddSuperAdminArbitrationNoteMutation,
  useApproveSuperAdminArbitrationInspectionMutation,
  useApproveSuperAdminDealerMutation,
  useCreateSuperAdminSubscriptionPlanMutation,
  useCreateSuperAdminRoleMutation,
  useDeleteSuperAdminRoleMutation,
  useEscalateSuperAdminArbitrationCaseMutation,
  useGetSuperAdminArbitrationCaseQuery,
  useGetSuperAdminArbitrationCasesQuery,
  useIssueSuperAdminArbitrationDecisionMutation,
  usePreviewSuperAdminArbitrationDecisionMutation,
  useRemoveSuperAdminArbitrationRestrictionMutation,
  useRequestSuperAdminArbitrationInspectionMutation,
  useReviewSuperAdminArbitrationObligationProofMutation,
  useUploadSuperAdminArbitrationObligationProofMutation,
  useWaiveSuperAdminArbitrationObligationMutation,
  useGetSuperAdminAuditLogsQuery,
  useGetSuperAdminBusinessConfigQuery,
  useGetSuperAdminDealerFunnelReportQuery,
  useGetSuperAdminDealerSubscriptionQuery,
  useGetSuperAdminDealerSubscriptionsQuery,
  useGetSuperAdminDashboardQuery,
  useGetSuperAdminDealerQuery,
  useGetSuperAdminDealersQuery,
  useGetSuperAdminFinancialReportQuery,
  useGetSuperAdminHubListingQuery,
  useGetSuperAdminHubListingsQuery,
  useGetSuperAdminModulesQuery,
  useGetSuperAdminNegotiationQuery,
  useGetSuperAdminNegotiationsQuery,
  useGetSuperAdminOrderQuery,
  useGetSuperAdminOrderVehicleSnapshotQuery,
  useGetSuperAdminOrdersQuery,
  useGetSuperAdminPublicAuctionQuery,
  useGetSuperAdminPublicAuctionsQuery,
  useGetSuperAdminReferralCommissionQuery,
  useGetSuperAdminReferralCommissionsQuery,
  useGetSuperAdminRoleQuery,
  useGetSuperAdminRolesQuery,
  useGetSuperAdminSubscriptionPlanQuery,
  useGetSuperAdminSubscriptionPlansQuery,
  useGetSuperAdminSubscriptionPoliciesQuery,
  useGetSuperAdminSubscriptionPolicyQuery,
  useGetSuperAdminUserQuery,
  useGetSuperAdminUsersQuery,
  useGetSuperAdminVehicleQuery,
  useGetSuperAdminVehiclesQuery,
  useGetSuperAdminWholesaleAuctionQuery,
  useGetSuperAdminWholesaleAuctionsQuery,
  useMarkSuperAdminReferralCommissionPaidMutation,
  useRefreshSuperAdminDealerSubscriptionSnapshotMutation,
  useRejectSuperAdminDealerMutation,
  useUpdateSuperAdminBusinessConfigMutation,
  useUpdateSuperAdminRoleMutation,
  useUpdateSuperAdminSubscriptionPlanMutation,
  useUpdateSuperAdminSubscriptionPolicyMutation,
  useUpdateSuperAdminUserMutation,
} = superAdminApi;
