'use client';

import { StatCard } from '@/app/(protected)/dashboard/_components/StatsCard';
import { HandshakeIcon } from '@/components/icons/HandshakeIcon';

export const StatsSection = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue "
        value="N/A"
        Icon={HandshakeIcon}
        className="border border-[#EAEBEC]"
      />
      <StatCard
        title="Listed Cars"
        value="N/A"
        Icon={HandshakeIcon}
        className="border border-[#EAEBEC]"
      />
      <StatCard
        title="Sold Car"
        value="N/A"
        Icon={HandshakeIcon}
        className="border border-[#EAEBEC]"
      />
      <StatCard
        title="Sold Car Revenue"
        value="N/A"
        Icon={HandshakeIcon}
        className="border border-[#EAEBEC]"
      />
    </div>
  );
};

StatsSection.displayName = 'StatsSection';
