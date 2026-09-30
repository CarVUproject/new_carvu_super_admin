export type OrderVehicleSnapshotFile = {
  original_path: string;
  snapshot_path: string;
  url: string | null;
};

export type OrderVehicleSnapshotImage = {
  id: string | null;
  category: string;
  title: string;
  description: string;
  serial: number;
  file: OrderVehicleSnapshotFile | null;
};

export type OrderVehicleSnapshotCarfax = {
  id: string;
  summary: {
    accident_history: boolean;
    service_record: number;
    declared_stolen: boolean;
    open_recalls: number;
    import_export: boolean;
    last_registration: {
      province: string | null;
      status: string | null;
      plate_type: string | null;
    } | null;
    report_link: string | null;
  };
  report_link: string | null;
  raw_payload: Record<string, unknown>;
  pdf: OrderVehicleSnapshotFile | null;
  created_at: string;
  updated_at: string;
};

export type OrderVehicleSnapshotAiInspection = {
  id: string;
  adjusted_condition_score: number;
  estimated_wholesale_price: number;
  estimated_retail_price: number;
  condition_bucket: 'green' | 'orange' | 'red' | null;
  condition_label: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderVehicleSnapshotParty = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  dealer: {
    id: string | null;
    dealership_name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
};

export type OrderVehicleSnapshotVehicle = Record<string, unknown> & {
  title?: string;
  short_description?: string | null;
  model?: string;
  make_year?: string;
  mileage?: number;
  odometer?: number;
  fuel_type?: string;
  transmission?: string;
  price?: number;
  condition?: string;
  vin?: string;
  carfax?: OrderVehicleSnapshotCarfax | null;
  ai_inspection?: OrderVehicleSnapshotAiInspection | null;
};

export type OrderVehicleSnapshot = {
  id: string;
  order: string;
  source_type: 'hub_listing' | 'public_auction' | 'wholesale_auction' | 'manual';
  source_id: string | null;
  snapshot_data: {
    order?: Record<string, unknown>;
    parties?: {
      buyer?: OrderVehicleSnapshotParty | null;
      seller?: OrderVehicleSnapshotParty | null;
    };
    vehicle?: OrderVehicleSnapshotVehicle;
    source?: {
      type?: string;
      id?: string | null;
      data?: Record<string, unknown> | null;
    };
  };
  media: {
    cover_image?: OrderVehicleSnapshotFile | null;
    images?: OrderVehicleSnapshotImage[];
  };
  created_at: string;
  updated_at: string;
};
