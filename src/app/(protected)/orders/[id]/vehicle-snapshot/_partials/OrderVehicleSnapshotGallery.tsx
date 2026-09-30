'use client';

import CvModal from '@/components/ui/CvModal';
import { TabsList, TabsTrigger } from '@/components/ui/CvTabs';
import { cn } from '@/lib/utils';
import type { OrderVehicleSnapshotImage } from '@/types/order-snapshot';
import { Images } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Slider, { type Settings } from 'react-slick';

import { ZoomableSnapshotImage } from './ZoomableSnapshotImage';

type SnapshotGalleryImage = {
  image: string;
  category: string;
  title: string;
  description?: string;
  serial: number;
};

type Props = {
  coverUrl?: string;
  images: OrderVehicleSnapshotImage[];
  title: string;
};

const PLACEHOLDER_IMAGE = '/assets/images/vehicle_placeholder.jpg';

const normalizeCategory = (value?: string) => (value || 'Vehicle').trim().toLowerCase();

const formatCategory = (value?: string) =>
  (value || 'Vehicle')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const buildImageList = (
  coverUrl: string | undefined,
  images: OrderVehicleSnapshotImage[],
): SnapshotGalleryImage[] => {
  const coverImage = coverUrl
    ? [
        {
          image: coverUrl,
          category: 'cover',
          title: 'Cover image',
          description: '',
          serial: 0,
        },
      ]
    : [];

  const capturedImages = images
    .map((item) => ({
      image: item.file?.url || '',
      category: normalizeCategory(item.category),
      title: item.title || 'Vehicle image',
      description: item.description,
      serial: item.serial,
    }))
    .filter((item) => item.image);

  const uniqueImages = [...coverImage, ...capturedImages].filter(
    (item, index, allItems) =>
      allItems.findIndex((candidate) => candidate.image === item.image) === index,
  );

  return uniqueImages.length
    ? uniqueImages
    : [
        {
          image: PLACEHOLDER_IMAGE,
          category: 'vehicle',
          title: 'Vehicle image',
          description: '',
          serial: 1,
        },
      ];
};

export function OrderVehicleSnapshotGallery({ coverUrl, images, title }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<Slider | null>(null);

  const galleryImages = useMemo(() => buildImageList(coverUrl, images), [coverUrl, images]);

  const filters = useMemo(() => {
    const categoryMap = galleryImages.reduce<Record<string, number>>((acc, image) => {
      acc[image.category] = (acc[image.category] || 0) + 1;
      return acc;
    }, {});

    return [
      { value: 'all', label: 'All', count: galleryImages.length },
      ...Object.entries(categoryMap).map(([value, count]) => ({
        value,
        label: formatCategory(value),
        count,
      })),
    ];
  }, [galleryImages]);

  const filteredImages = useMemo(
    () =>
      activeFilter === 'all'
        ? galleryImages
        : galleryImages.filter((image) => image.category === activeFilter),
    [activeFilter, galleryImages],
  );

  const mainImage = galleryImages[0];
  const previewImages = galleryImages.slice(1, 3);

  useEffect(() => {
    setActiveIndex(0);
    sliderRef.current?.slickGoTo(0, true);
  }, [activeFilter]);

  const sliderSettings: Settings = {
    dots: false,
    arrows: false,
    infinite: filteredImages.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    fade: true,
    draggable: false,
    beforeChange: (_current, next) => setActiveIndex(next),
  };

  return (
    <>
      <section className="rounded-3xl border border-cv-gray-50 bg-white p-4 shadow-sm">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)]">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="relative block aspect-[16/10] overflow-hidden rounded-2xl border border-cv-gray-50 bg-cv-gray-10 text-left lg:aspect-auto lg:h-[464px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mainImage.image} alt={mainImage.title || title} className="h-full w-full object-cover" />
            <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-bold text-cv-gray-900 shadow-sm">
              <Images className="size-4" />
              View Full Gallery
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {(previewImages.length ? previewImages : [mainImage]).map((image, index) => (
              <GalleryPreviewTile
                key={`${image.image}-${index}`}
                image={image}
                onClick={() => setModalOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      <CvModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title="Vehicle Gallery"
        wrapperClassNames="w-full !my-4"
      >
        <div className="space-y-5">
          <div className="overflow-x-auto">
            <TabsList
              value={activeFilter}
              onChange={setActiveFilter}
              layoutId="superadmin-snapshot-gallery-tabs"
              className="w-max"
            >
              {filters.map((filter) => (
                <TabsTrigger
                  key={filter.value}
                  value={filter.value}
                  text={`${filter.label} ${filter.count}`}
                />
              ))}
            </TabsList>
          </div>

          <div className="slider-container overflow-hidden rounded-xl bg-white">
            <Slider
              key={activeFilter}
              {...sliderSettings}
              ref={(slider) => {
                sliderRef.current = slider;
              }}
            >
              {filteredImages.map((image) => (
                <div key={image.image} className="bg-white">
                  <ZoomableSnapshotImage image={image.image} />
                </div>
              ))}
            </Slider>
          </div>

          {filteredImages.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filteredImages.map((image, index) => (
                <button
                  key={`${image.image}-${index}`}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    sliderRef.current?.slickGoTo(index);
                  }}
                  className={cn(
                    'relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-32',
                    activeIndex === index
                      ? 'border-cv-secondary-600'
                      : 'border-cv-gray-50 hover:border-cv-secondary-500',
                  )}
                  title={image.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.image} alt={image.title} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </CvModal>
    </>
  );
}

const GalleryPreviewTile = ({
  image,
  onClick,
}: {
  image: SnapshotGalleryImage;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-cv-gray-50 bg-cv-gray-10 lg:aspect-auto lg:h-[224px]"
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image.image} alt={image.title || 'Vehicle preview'} className="h-full w-full object-cover" />
  </button>
);
