'use client';

import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { CalendarClock, CarFront, ExternalLink, FileText, Gauge, ShieldCheck } from 'lucide-react';

import { AdminPageScaffold, AdminSectionCard } from '@/components/admin/AdminPageScaffold';
import {
  useGetSuperAdminOrderVehicleSnapshotQuery,
} from '@/features/super-admin/superAdminApi';
import { formatCurrency, titleCase } from '@/lib/format';
import type {
  OrderVehicleSnapshotAiInspection,
  OrderVehicleSnapshotCarfax,
  OrderVehicleSnapshotImage,
  OrderVehicleSnapshotParty,
} from '@/types/order-snapshot';

import { OrderVehicleSnapshotGallery } from './OrderVehicleSnapshotGallery';

type Props = {
  orderId: string;
};

const CONDITION_META = {
  green: {
    title: 'Excellent Condition',
    description:
      'This vehicle shows strong overall condition based on AI analysis of available data and images. No major issues are detected, and the vehicle appears well-maintained.',
    color: 'text-cv-secondary-600',
    dot: 'bg-cv-secondary-600',
  },
  orange: {
    title: 'Attention Needed',
    description:
      'This vehicle is in moderate condition based on AI evaluation. Some wear, cosmetic issues, or minor concerns may be present. Buyers should review details and images carefully.',
    color: 'text-[#FFA500]',
    dot: 'bg-[#FFA500]',
  },
  red: {
    title: 'Higher Risk',
    description:
      'This vehicle shows signs of significant wear or potential issues based on AI analysis. It may require repairs or further inspection before purchase.',
    color: 'text-[#D92D21]',
    dot: 'bg-[#D92D21]',
  },
  none: {
    title: 'Invalid Rating',
    description: 'Please contact support.',
    color: 'text-cv-gray-400',
    dot: 'bg-cv-gray-300',
  },
};

const apiOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || '')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '');

function toAssetUrl(url?: string | null) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiOrigin}${url.startsWith('/') ? url : `/${url}`}`;
}

function formatText(value?: unknown) {
  if (value === null || value === undefined || value === '') return 'N/A';
  return titleCase(String(value));
}

function SnapshotKeyValue({ label, value }: { label: string; value?: unknown }) {
  return (
    <div className="rounded-xl border border-cv-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
        {label}
      </p>
      <p className="mt-1 font-semibold text-cv-gray-900">{formatText(value)}</p>
    </div>
  );
}

function BoolValue({ value }: { value: boolean }) {
  return (
    <span className={`font-semibold ${value ? 'text-[#D92D21]' : 'text-cv-secondary-600'}`}>
      {value ? 'Yes' : 'No'}
    </span>
  );
}

function PartySnapshotCard({
  title,
  party,
}: {
  title: string;
  party?: OrderVehicleSnapshotParty | null;
}) {
  return (
    <AdminSectionCard title={title} description={`${title} details captured at order creation.`}>
      {party ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <SnapshotKeyValue label="Name" value={party.full_name} />
          <SnapshotKeyValue label="Email" value={party.email} />
          <SnapshotKeyValue label="Phone" value={party.phone} />
          {party.dealer ? (
            <SnapshotKeyValue label="Dealership" value={party.dealer.dealership_name} />
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-cv-gray-400">{title} details unavailable.</p>
      )}
    </AdminSectionCard>
  );
}

function AiInspectionSection({
  aiInspection,
}: {
  aiInspection: OrderVehicleSnapshotAiInspection;
}) {
  const condition = aiInspection.condition_bucket || 'none';
  const meta = CONDITION_META[condition];

  return (
    <AdminSectionCard
      title="AI-Assessed Vehicle Condition"
      description="Purchase-time AI condition rating and estimate data."
    >
      <div className="space-y-5">
        <section className="flex gap-4 rounded-xl border border-cv-gray-50 bg-cv-gray-10 p-4">
          <div className="grid size-[78px] shrink-0 place-items-center rounded-full border-[6px] border-current bg-white">
            <p className={`text-sm font-bold ${meta.color}`}>
              {aiInspection.adjusted_condition_score}/10
            </p>
          </div>
          <section className="grid gap-2.5">
            <div className="flex items-center gap-2">
              <div className="size-[18px] shrink-0 rounded-full bg-cv-secondary-600" />
              <p className="text-sm font-medium text-cv-gray-500">
                Green (8.5 - 10.0) = Excellent
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-[18px] shrink-0 rounded-full bg-[#FFA500]" />
              <p className="text-sm font-medium text-cv-gray-500">
                Orange (6.0 - 8.4) = Fair to Good
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-[18px] shrink-0 rounded-full bg-[#D92D21]" />
              <p className="text-sm font-medium text-cv-gray-500">Red (3.0 - 5.9) = Poor</p>
            </div>
          </section>
        </section>

        <section className="space-y-4 rounded-xl border border-cv-gray-50 p-4">
          <h4 className="text-xl font-semibold text-cv-gray-900">{meta.title}</h4>
          <p className="text-base leading-7 text-cv-gray-400">{meta.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <SnapshotKeyValue
              label="Wholesale Estimate"
              value={formatCurrency(aiInspection.estimated_wholesale_price)}
            />
            <SnapshotKeyValue
              label="Retail Estimate"
              value={formatCurrency(aiInspection.estimated_retail_price)}
            />
          </div>
        </section>
      </div>
    </AdminSectionCard>
  );
}

function CarfaxSection({
  carfax,
  reportUrl,
}: {
  carfax: OrderVehicleSnapshotCarfax;
  reportUrl?: string | null;
}) {
  const summary = carfax.summary;

  return (
    <AdminSectionCard
      title="Carfax / Vehicle History"
      description="Vehicle history report data captured with the order snapshot."
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <SnapshotKeyValue label="Service Records" value={summary.service_record} />
          <SnapshotKeyValue label="Open Recalls" value={summary.open_recalls} />
          <div className="rounded-xl border border-cv-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
              Accident History
            </p>
            <p className="mt-1">
              <BoolValue value={summary.accident_history} />
            </p>
          </div>
          <div className="rounded-xl border border-cv-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
              Declared Stolen
            </p>
            <p className="mt-1">
              <BoolValue value={summary.declared_stolen} />
            </p>
          </div>
          <div className="rounded-xl border border-cv-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
              Import / Export
            </p>
            <p className="mt-1">
              <BoolValue value={summary.import_export} />
            </p>
          </div>
          <SnapshotKeyValue
            label="Last Registration"
            value={
              summary.last_registration
                ? [
                    summary.last_registration.province,
                    summary.last_registration.status,
                    summary.last_registration.plate_type,
                  ]
                    .filter(Boolean)
                    .join(' / ')
                : 'N/A'
            }
          />
        </div>

        {reportUrl ? (
          <a
            href={reportUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-cv-primary-500 px-4 py-3 text-sm font-semibold text-cv-primary-500 transition-colors hover:bg-cv-gray-10"
          >
            {carfax.pdf?.url ? <FileText className="size-4" /> : <ExternalLink className="size-4" />}
            Open Captured Report
          </a>
        ) : null}
      </div>
    </AdminSectionCard>
  );
}

export function OrderVehicleSnapshotView({ orderId }: Props) {
  const { data, isLoading, isError } = useGetSuperAdminOrderVehicleSnapshotQuery(orderId, {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <AdminPageScaffold
        title="Vehicle Snapshot"
        description="Loading immutable order vehicle snapshot."
      >
        <div className="rounded-3xl border border-cv-gray-50 bg-white px-6 py-10 text-sm text-cv-gray-400">
          Loading vehicle snapshot...
        </div>
      </AdminPageScaffold>
    );
  }

  if (isError || !data) {
    return (
      <AdminPageScaffold
        title="Vehicle Snapshot"
        description="The requested order vehicle snapshot could not be found."
      >
        <Link href="/orders" className="text-sm font-semibold text-cv-primary-500">
          Back to orders
        </Link>
      </AdminPageScaffold>
    );
  }

  const vehicle = data.snapshot_data.vehicle || {};
  const order = data.snapshot_data.order || {};
  const parties = data.snapshot_data.parties || {};
  const source = data.snapshot_data.source || {};
  const details =
    vehicle.vehicle_details && typeof vehicle.vehicle_details === 'object'
      ? (vehicle.vehicle_details as Record<string, unknown>)
      : {};
  const fallbackSeller =
    vehicle.seller && typeof vehicle.seller === 'object'
      ? (vehicle.seller as OrderVehicleSnapshotParty)
      : null;
  const buyer = parties.buyer || null;
  const seller = parties.seller || fallbackSeller;
  const features = Array.isArray(vehicle.features)
    ? (vehicle.features as Record<string, unknown>[])
    : [];
  const modifications = Array.isArray(vehicle.modifications)
    ? (vehicle.modifications as unknown[])
    : [];
  const gallery: OrderVehicleSnapshotImage[] = (data.media.images || []).map((image) => ({
    ...image,
    file: image.file
      ? {
          ...image.file,
          url: toAssetUrl(image.file.url),
        }
      : null,
  }));
  const coverUrl = toAssetUrl(data.media.cover_image?.url);
  const carfax = vehicle.carfax || null;
  const aiInspection = vehicle.ai_inspection || null;
  const carfaxReportUrl = carfax ? toAssetUrl(carfax.pdf?.url) || carfax.report_link : null;

  return (
    <AdminPageScaffold
      title={formatText(vehicle.title)}
      description="Immutable vehicle and order context captured when the order was created."
      actions={
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-cv-gray-50 bg-white px-4 py-3 text-sm font-semibold text-cv-gray-600 transition-colors hover:bg-cv-gray-10"
        >
          <HiOutlineArrowLeft className="size-4" />
          Back to orders
        </Link>
      }
    >
      <div className="space-y-6">
        <OrderVehicleSnapshotGallery
          coverUrl={coverUrl}
          images={gallery}
          title={formatText(vehicle.title)}
        />

        <AdminSectionCard title="Snapshot Summary" description="Core purchase-time vehicle and order context.">
          <div className="space-y-4">
            <p className="max-w-5xl text-sm leading-6 text-cv-gray-400">
              {formatText(vehicle.short_description)}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SnapshotKeyValue label="Final Price" value={formatCurrency(order.final_price as string)} />
              <SnapshotKeyValue label="Source" value={source.type || data.source_type} />
              <SnapshotKeyValue label="Order Status" value={order.status} />
              <SnapshotKeyValue label="VIN" value={vehicle.vin} />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Vehicle Overview" description="Vehicle details shown at order creation.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SnapshotKeyValue label="Year" value={vehicle.make_year} />
            <SnapshotKeyValue label="Model" value={vehicle.model} />
            <SnapshotKeyValue label="Mileage" value={vehicle.mileage} />
            <SnapshotKeyValue label="Odometer" value={vehicle.odometer} />
            <SnapshotKeyValue label="Fuel" value={vehicle.fuel_type} />
            <SnapshotKeyValue label="Transmission" value={vehicle.transmission} />
            <SnapshotKeyValue label="Condition" value={vehicle.condition} />
            <SnapshotKeyValue label="Listed Price" value={formatCurrency(vehicle.price)} />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Specifications" description="Captured body and mechanical specifications.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SnapshotKeyValue label="Body" value={details.body} />
            <SnapshotKeyValue label="Drive Type" value={details.drive_type} />
            <SnapshotKeyValue label="Engine Size" value={details.engine_size} />
            <SnapshotKeyValue label="Doors" value={details.doors} />
            <SnapshotKeyValue label="Cylinder" value={details.cylinder} />
            <SnapshotKeyValue label="Manufacturer" value={details.manufacturer} />
            <SnapshotKeyValue label="Color" value={details.color} />
          </div>
        </AdminSectionCard>

        {(aiInspection || carfax) ? (
          <section className="grid gap-6 lg:grid-cols-2">
            {aiInspection ? <AiInspectionSection aiInspection={aiInspection} /> : null}
            {carfax ? <CarfaxSection carfax={carfax} reportUrl={carfaxReportUrl} /> : null}
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <AdminSectionCard title="Captured Features" description="Feature set captured with the order snapshot.">
            {features.length ? (
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <span
                    key={`${String(feature.name)}-${index}`}
                    className="rounded-full bg-cv-gray-10 px-3 py-1 text-sm font-semibold text-cv-gray-600"
                  >
                    {formatText(feature.name)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-cv-gray-400">No features captured.</p>
            )}
          </AdminSectionCard>

          <AdminSectionCard title="Modifications" description="Modifications captured with the order snapshot.">
            {modifications.length ? (
              <div className="flex flex-wrap gap-2">
                {modifications.map((item, index) => (
                  <span
                    key={`${String(item)}-${index}`}
                    className="rounded-full bg-cv-gray-10 px-3 py-1 text-sm font-semibold text-cv-gray-600"
                  >
                    {formatText(item)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-cv-gray-400">No modifications captured.</p>
            )}
          </AdminSectionCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <PartySnapshotCard title="Buyer" party={buyer} />
          <PartySnapshotCard title="Seller" party={seller} />
        </section>

        <AdminSectionCard title="Order Context" description="Financial and lifecycle context for this order.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SnapshotKeyValue label="Order ID" value={order.id || data.order} />
            <SnapshotKeyValue label="Source ID" value={source.id || data.source_id} />
            <SnapshotKeyValue label="Retainer" value={formatCurrency(order.retainer_amount as string)} />
            <SnapshotKeyValue label="Platform Fee" value={formatCurrency(order.platform_fee_amount as string)} />
            <SnapshotKeyValue label="Completion Deadline" value={order.completion_deadline_at} />
            <SnapshotKeyValue label="Snapshot Created" value={data.created_at} />
          </div>
        </AdminSectionCard>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Captured at order creation', icon: ShieldCheck },
            { label: 'Vehicle details are read-only', icon: CarFront },
            { label: 'Order data stays tied to the case', icon: CalendarClock },
            { label: 'Odometer and condition preserved', icon: Gauge },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-white p-4 text-sm font-semibold text-cv-gray-600 shadow-sm"
              >
                <Icon className="size-5 text-cv-primary-500" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </AdminPageScaffold>
  );
}
