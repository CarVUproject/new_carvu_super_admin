import { Skeleton } from '@mui/material';

export const DealerDetailsSkeleton = () => {
  return (
    <div className="w-full py-4 rounded-3xl">
      <Skeleton className="w-full! py-4!" />

      <div>
        <Skeleton className="w-full! py-20! rounded-2xl!" />
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-full! py-20! rounded-xl!" />
        ))}
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="w-full! py-40! rounded-xl!" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-full! py-10! rounded-xl!" />
        ))}
      </div>

      <div>
        <Skeleton className="w-full! py-20! rounded-2xl!">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="w-full! py-20! rounded-2xl!" />
            <Skeleton className="w-full! py-20! rounded-2xl!" />
            <Skeleton className="w-full! py-20! rounded-2xl!" />
            <Skeleton className="w-full! py-20! rounded-2xl!" />
          </div>
          <Skeleton className="w-full! py-20! rounded-2xl!" />
        </Skeleton>
      </div>
      <div>
        <Skeleton className="w-full! py-20! rounded-2xl!" />
      </div>
    </div>
  );
};

DealerDetailsSkeleton.displayName = 'DealerDetailsSkeleton';
