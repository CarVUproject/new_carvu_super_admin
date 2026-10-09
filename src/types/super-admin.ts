import { Pagination } from '@/types/common';

export type PaginatedResponse<T> = Pagination & {
  results: T[];
};

export type DashboardSummary = {
  users: {
    total: number;
    active: number;
    dealers: number;
  };
  dealers: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  subscriptions: {
    active: number;
    incomplete: number;
    past_due: number;
  };
  orders: {
    total: number;
    retainer_captured: number;
    payment_failed: number;
    completed: number;
    cancelled: number;
  };
  retainers: {
    captured: number;
    pending: number;
    failed: number;
  };
  escrow: {
    held: number;
    released: number;
    forfeited: number;
    refunded: number;
  };
  referrals: {
    earned_count: number;
    paid_count: number;
    earned_amount: string;
    paid_amount: string;
  };
  business_config: {
    is_configured: boolean;
  };
};

export type FinancialReportSummary = {
  generated_at: string;
  orders: {
    total_count: number;
    completed_count: number;
    total_final_price: string;
    total_platform_fee: string;
  };
  retainers: {
    captured_count: number;
    pending_count: number;
    failed_count: number;
    captured_amount: string;
    pending_amount: string;
    failed_amount: string;
    total_amount: string;
  };
  escrow: {
    held_count: number;
    released_count: number;
    forfeited_count: number;
    refunded_count: number;
    held_amount: string;
    released_amount: string;
    forfeited_amount: string;
    refunded_amount: string;
    total_amount: string;
  };
  penalties: {
    count: number;
    total_amount: string;
  };
  referrals: {
    earned_count: number;
    paid_count: number;
    earned_amount: string;
    paid_amount: string;
    total_amount: string;
  };
};

export type DealerFunnelReportSummary = {
  generated_at: string;
  totals: {
    registered: number;
    pending: number;
    approved: number;
    rejected: number;
    with_active_subscription: number;
    with_vehicle: number;
    with_hub_listing: number;
    with_completed_order: number;
  };
  rates: {
    approval_rate: number;
    active_subscription_rate: number;
    vehicle_listing_rate: number;
    hub_listing_rate: number;
    completed_order_rate: number;
  };
};

export type AuditLogItem = {
  id: string;
  actor: {
    id: string;
    email: string;
    full_name: string | null;
  };
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AuditLogListQueryParams = {
  page?: number;
  action?: string;
};

export type DealerListItem = {
  id: string;
  operating_name: string;
  status: 'pending' | 'approved' | 'rejected';
  dealership_email: string;
  dealership_phone: string;
  user_email: string;
  user_full_name: string;
  roles: string[];
  has_payment_method: boolean;
  created_at: string;
  updated_at: string;
};

export type DealerAddress = {
  country: string;
  state: string;
  city: string;
  street: string;
  postal_code: string;
};

export type DealerDocument = {
  id: string;
  file_type: string;
  file: string;
  created_at: string;
  updated_at: string;
};

export type DealerPaymentMethod = {
  account_holder: string;
  bank_name: string;
  transit_number: string;
  institution_number: string;
  account_number: string;
  email_for_confirmation: string;
};

export type DealerDetail = {
  id: string;
  operating_name: string;
  dealer_class: string | null;
  dealership_email: string;
  dealership_phone: string;
  business_type: string | null;
  business_number: string | null;
  omvic_number: string | null;
  tax_id: string | null;
  business_website: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    is_active: boolean;
    is_staff: boolean;
    is_dealer: boolean;
  };
  primary_address: DealerAddress | null;
  shipping_address: DealerAddress[];
  mailing_address: DealerAddress[];
  dealer_documents: DealerDocument[];
  payment_method: DealerPaymentMethod | null;
};

export type RolePermission = {
  module: string;
  code: string;
  name: string;
};

export type RoleItem = {
  name: string;
  is_active: boolean;
  permissions: RolePermission[];
};

export type ModuleItem = {
  code: string;
  name: string;
  permissions: RolePermission[];
};

export type BusinessConfig = {
  id: number;
  retainer_amount: string;
  penalty_amount: string;
  platform_fee_amount: string;
  affiliate_commission_amount: string;
  affiliate_max_qualified_purchases_per_referred_user: number;
  affiliate_attribution_window_days: number;
  pickup_confirmation_hours: number;
  updated_by: string | null;
  updated_by_email: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessConfigResponse = {
  config: BusinessConfig | null;
};

export type UserListItem = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  referral_code: string | null;
  is_active: boolean;
  is_dealer: boolean;
  roles: string[];
  dealer_status: string | null;
  payment_method_count: number;
  created_at: string;
  last_login: string | null;
};

export type UserPaymentMethod = {
  id: string;
  provider: string;
  brand: string | null;
  last4: string | null;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type UserDetail = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  is_active: boolean;
  is_dealer: boolean;
  avatar: string | null;
  roles: string[];
  created_at: string;
  last_login: string | null;
  referral_code: string | null;
  dealer_status: string | null;
  payment_methods: UserPaymentMethod[];
};

export type ListQueryParams = {
  page?: number;
  search?: string;
};

export type DealerListQueryParams = ListQueryParams & {
  status?: string;
};

export type UserListQueryParams = ListQueryParams & {
  is_active?: string;
  is_dealer?: string;
  role?: string;
};

export type VehicleOwner = {
  id: string;
  full_name: string | null;
  email: string;
  is_active: boolean;
  is_dealer: boolean;
  dealer_id: string | null;
  dealer_status: string | null;
  dealer_operating_name: string | null;
} | null;

export type VehicleReadiness = {
  has_details: boolean;
  has_cover_image: boolean;
  image_count: number;
  feature_count: number;
  has_hub_listing: boolean;
  has_public_auction: boolean;
  has_wholesale_auction: boolean;
  has_negotiation: boolean;
  has_order: boolean;
};

export type VehicleListItem = {
  id: string;
  title: string;
  model: string;
  make_year: string;
  mileage: number;
  odometer: number;
  fuel_type: string;
  transmission: string;
  price: number;
  condition: string;
  vin: string;
  status: string[];
  cover_image: string | null;
  owner: VehicleOwner;
  readiness: VehicleReadiness;
  hub_listing_count: number;
  public_auction_count: number;
  wholesale_auction_count: number;
  negotiation_count: number;
  order_count: number;
  created_at: string;
  updated_at: string;
};

export type VehicleHubSummary = {
  id: string;
  available_for_sale: boolean;
  price: number;
  created_at: string;
  updated_at: string;
};

export type VehicleAuctionSummary = {
  id: string;
  auction_type: 'public' | 'wholesale';
  starting_value: number;
  reserve_value: number;
  starting_at: string;
  ending_at: string;
  winner_id: string | null;
  bid_count: number;
  created_at: string;
};

export type VehicleNegotiationSummary = {
  id: string;
  source_type: string;
  source_id: string | null;
  status: string;
  starting_price: string;
  buyer: OrderUser;
  seller: OrderUser;
  offer_count: number;
  started_at: string;
  expires_at: string;
  settled_at: string | null;
  created_at: string;
};

export type VehicleOrderSummary = {
  id: string;
  source_type: string;
  source_id: string | null;
  status: string;
  final_price: string | null;
  buyer: OrderUser;
  seller: OrderUser;
  completion_deadline_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VehicleImageItem = {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string | null;
  serial: number;
};

export type VehicleDetail = VehicleListItem & {
  short_description: string | null;
  images: VehicleImageItem[];
  hub_listings: VehicleHubSummary[];
  public_auctions: VehicleAuctionSummary[];
  wholesale_auctions: VehicleAuctionSummary[];
  negotiations: VehicleNegotiationSummary[];
  orders: VehicleOrderSummary[];
};

export type VehicleListQueryParams = ListQueryParams & {
  status?: string;
  seller?: string;
  is_dealer?: string;
  has_hub_listing?: string;
  has_auction?: string;
  has_order?: string;
  has_details?: string;
  make_year?: string;
  condition?: string;
  fuel_type?: string;
  transmission?: string;
};

export type HubListingVehicle = {
  id: string;
  title: string;
  model: string;
  make_year: string;
  vin: string;
  price: number;
  condition: string;
  fuel_type: string;
  transmission: string;
  status: string[];
  cover_image: string | null;
  owner: VehicleOwner;
};

export type HubListingListItem = {
  id: string;
  available_for_sale: boolean;
  price: number;
  vehicle: HubListingVehicle;
  public_auction_count: number;
  wholesale_auction_count: number;
  negotiation_count: number;
  order_count: number;
  created_at: string;
  updated_at: string;
};

export type HubListingDetail = HubListingListItem & {
  public_auctions: VehicleAuctionSummary[];
  wholesale_auctions: VehicleAuctionSummary[];
  negotiations: VehicleNegotiationSummary[];
  orders: VehicleOrderSummary[];
};

export type HubListingListQueryParams = ListQueryParams & {
  seller?: string;
  available_for_sale?: string;
  vehicle_status?: string;
  min_price?: string;
  max_price?: string;
  has_auction?: string;
  has_negotiation?: string;
  has_order?: string;
};

export type AuctionUser = {
  id: string;
  full_name: string | null;
  email: string;
  is_dealer: boolean;
  dealer_id: string | null;
  dealer_operating_name: string | null;
  dealer_status: string | null;
} | null;

export type AuctionVehicle = {
  id: string;
  title: string;
  model: string;
  make_year: string;
  vin: string;
  price: number;
  status: string[];
  cover_image: string | null;
  owner: AuctionUser;
};

export type AuctionListItem = {
  id: string;
  auction_type: 'public' | 'wholesale';
  status: string;
  vehicle: AuctionVehicle;
  created_by: AuctionUser;
  winner: AuctionUser;
  starting_value: number;
  reserve_value: number;
  starting_at: string;
  ending_at: string;
  trade_in_vehicle: boolean;
  bid_count: number;
  participant_count: number;
  highest_bid_amount: number | null;
  created_at: string;
  updated_at: string;
};

export type AuctionBid = {
  id: string;
  amount: number;
  user: NonNullable<AuctionUser>;
  created_at: string;
  updated_at: string;
};

export type AuctionWarranty = {
  id: string;
  year: number;
  amount: number;
  created_at: string;
  updated_at: string;
};

export type AuctionAddress = {
  id: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postal_code: string;
  map_link: string | null;
  created_at: string;
  updated_at: string;
};

export type AuctionDetail = AuctionListItem & {
  auction_warranties: AuctionWarranty[];
  auction_address: AuctionAddress | null;
  auction_bids: AuctionBid[];
  outcomes: {
    negotiations: VehicleNegotiationSummary[];
    orders: VehicleOrderSummary[];
  };
};

export type AuctionListQueryParams = ListQueryParams & {
  seller?: string;
  status?: string;
  vehicle_status?: string;
  has_winner?: string;
  trade_in_vehicle?: string;
  min_starting_value?: string;
  max_starting_value?: string;
  min_reserve_value?: string;
  max_reserve_value?: string;
};

export type NegotiationVehicle = {
  id: string;
  title: string;
  model: string;
  make_year: string;
  vin: string;
  price: number;
  status: string[];
  owner: AuctionUser;
};

export type NegotiationListItem = {
  id: string;
  source_type: string;
  source_id: string | null;
  vehicle: NegotiationVehicle;
  seller: NonNullable<AuctionUser>;
  buyer: NonNullable<AuctionUser>;
  starting_price: string;
  status: string;
  expires_at: string;
  started_at: string;
  settled_at: string | null;
  offer_count: number;
  order_count: number;
  latest_offer_amount: string | null;
  created_at: string;
  updated_at: string;
};

export type NegotiationOffer = {
  id: string;
  offered_by: NonNullable<AuctionUser>;
  amount: string;
  comment: string;
  created_at: string;
  updated_at: string;
};

export type NegotiationAgreement = {
  id: string;
  accepted_by: NonNullable<AuctionUser>;
  accepted_offer: NegotiationOffer;
  final_price: string;
  accepted_at: string;
  created_at: string;
  updated_at: string;
} | null;

export type NegotiationDetail = NegotiationListItem & {
  offers: NegotiationOffer[];
  agreement: NegotiationAgreement;
  orders: VehicleOrderSummary[];
};

export type NegotiationListQueryParams = ListQueryParams & {
  status?: string;
  source_type?: string;
  seller?: string;
  buyer?: string;
  vehicle_status?: string;
  has_order?: string;
  min_starting_price?: string;
  max_starting_price?: string;
};

export type CreateOrUpdateRolePayload = {
  name: string;
  is_active: boolean;
  permissions: string[];
};

export type ApproveDealerPayload = {
  id: string;
  roles: string[];
};

export type UpdateBusinessConfigPayload = {
  retainer_amount: string;
  penalty_amount: string;
  platform_fee_amount: string;
  affiliate_commission_amount: string;
  affiliate_max_qualified_purchases_per_referred_user: number;
  affiliate_attribution_window_days: number;
  pickup_confirmation_hours: number;
};

export type UpdateUserPayload = Partial<{
  full_name: string;
  phone: string;
  is_active: boolean;
  is_dealer: boolean;
  roles: string[];
}>;

export type SubscriptionPlanEntitlement = {
  id?: string;
  operation_code: string;
  operation_name: string;
  operation_description: string;
  usage_strategy: string;
  is_counted: boolean;
  is_enabled: boolean;
  limit_value: number | null;
  is_unlimited: boolean;
};

export type SubscriptionPlanItem = {
  id: string;
  code: string;
  name: string;
  description: string;
  monthly_price: string;
  currency: string;
  stripe_price_id: string;
  required_permission_codes: string[];
  features: string[];
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  entitlements: SubscriptionPlanEntitlement[];
  created_at: string;
  updated_at: string;
};

export type SubscriptionPlanPayload = {
  code: string;
  name: string;
  description: string;
  monthly_price: string;
  currency: string;
  stripe_price_id: string;
  required_permission_codes: string[];
  features: string[];
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  entitlements: Array<{
    operation: string;
    is_enabled: boolean;
    limit_value: number | null;
    is_unlimited: boolean;
  }>;
};

export type SubscriptionPolicyItem = {
  id: string;
  operation_code: string;
  operation_name: string;
  operation_description: string;
  usage_strategy: string;
  is_counted: boolean;
  subscription_required: boolean;
  is_active: boolean;
};

export type UpdateSubscriptionPolicyPayload = {
  subscription_required: boolean;
  is_active: boolean;
};

export type DealerSubscriptionItem = {
  id: string;
  dealer_name: string;
  dealer_status: string;
  user_email: string;
  user_full_name: string | null;
  plan_code: string;
  plan_name: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  snapshot_monthly_price: string | null;
  snapshot_currency: string;
  snapshot_required_permission_codes: string[];
  snapshot_features: string[];
  snapshot_captured_at: string | null;
  snapshot_entitlements: Array<{
    operation_code: string;
    operation_name: string;
    operation_description: string;
    usage_strategy: string;
    is_counted: boolean;
    is_enabled: boolean;
    limit_value: number | null;
    is_unlimited: boolean;
  }>;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_checkout_session_id: string;
  created_at: string;
  updated_at: string;
};

export type ReferralCommissionUser = {
  id: string;
  full_name: string | null;
  email: string;
};

export type ReferralCommissionItem = {
  id: string;
  referrer: ReferralCommissionUser;
  referred_user: ReferralCommissionUser;
  order_id: string;
  purchase_sequence: number;
  amount: string;
  status: 'earned' | 'paid';
  earned_at: string;
  paid_at: string | null;
  payout_reference: string | null;
};

export type ReferralCommissionDetail = ReferralCommissionItem & {
  paid_by: {
    id: string;
    email: string;
    full_name: string | null;
  } | null;
};

export type OrderUser = {
  id: string;
  full_name: string | null;
  email: string;
};

export type OrderVehicle = {
  id: string;
  title: string;
  vin: string;
};

export type OrderReleaseFormSummary = {
  id: string;
  verification_id: string;
  status: string;
  used_at: string | null;
  invalidated_at: string | null;
  viewed_at: string | null;
  pdf_url: string | null;
} | null;

export type OrderRetainerPayment = {
  status: string;
  amount: string;
  currency: string;
  method: string;
  payment_intent_id: string | null;
  failure_reason: string | null;
  paid_at: string | null;
} | null;

export type OrderPenalty = {
  amount: string;
  reason: string;
  applied_at: string;
  user: OrderUser;
};

export type OrderListItem = {
  id: string;
  source_type: string;
  final_price: string | null;
  retainer_amount: string;
  platform_fee_amount: string;
  status: string;
  completion_deadline_at: string | null;
  buyer: OrderUser;
  seller: OrderUser;
  vehicle: OrderVehicle;
  release_form: OrderReleaseFormSummary;
  has_retainer_payment: boolean;
  penalty_count: number;
  created_at: string;
  updated_at: string;
};

export type OrderDetail = OrderListItem & {
  source_id: string | null;
  negotiation: string | null;
  retainer_payment: OrderRetainerPayment;
  penalties: OrderPenalty[];
};

export type SubscriptionPlanListQueryParams = ListQueryParams;

export type DealerSubscriptionListQueryParams = ListQueryParams & {
  status?: string;
  plan?: string;
};

export type ReferralCommissionListQueryParams = ListQueryParams & {
  status?: string;
};

export type OrderListQueryParams = ListQueryParams & {
  status?: string;
  source_type?: string;
};
