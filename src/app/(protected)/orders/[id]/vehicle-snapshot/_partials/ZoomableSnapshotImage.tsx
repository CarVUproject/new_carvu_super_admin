'use client';

import { Minus, Plus, RotateCcw } from 'lucide-react';
import { PointerEvent, WheelEvent, useState } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  image: string;
  className?: string;
};

export function ZoomableSnapshotImage({ image, className }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const updateScale = (nextScale: number) => {
    const boundedScale = Math.min(5, Math.max(1, nextScale));
    setScale(boundedScale);
    if (boundedScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateScale(scale + (event.deltaY < 0 ? 0.25 : -0.25));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart || scale <= 1) return;
    setPosition({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  };

  return (
    <div
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragStart(null)}
      onPointerCancel={() => setDragStart(null)}
      className={cn(
        'relative h-[58vh] min-h-[360px] max-h-[650px] overflow-hidden rounded-xl bg-cv-gray-10',
        scale > 1 ? 'cursor-grab' : 'cursor-zoom-in',
        className,
      )}
    >
      <div className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-xl border border-cv-gray-50 bg-white/95 shadow-sm">
        <button
          type="button"
          title="Zoom out"
          disabled={scale <= 1}
          onClick={() => updateScale(scale - 0.5)}
          className="grid size-10 place-items-center text-cv-gray-600 transition hover:bg-cv-gray-10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          title="Reset zoom"
          onClick={reset}
          className="grid size-10 place-items-center border-x border-cv-gray-50 text-cv-gray-600 transition hover:bg-cv-gray-10"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          title="Zoom in"
          disabled={scale >= 5}
          onClick={() => updateScale(scale + 0.5)}
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
        className="h-full w-full select-none object-contain"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center',
        }}
      />
    </div>
  );
}
