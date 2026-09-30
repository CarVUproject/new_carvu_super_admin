'use client';
import { HandshakeIcon } from '@/components/icons/HandshakeIcon';
import { StatCard } from '../../_components/StatsCard';

export const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <StatCard
        title="Total Dealer"
        value="320"
        subtitle="Increase from last month"
        Icon={HandshakeIcon}
        trend={{ value: '+7%', positive: true }}
      />
      <StatCard
        title="Active Dealer"
        value="2,000"
        subtitle="Increase from last month"
        Icon={HandshakeIcon}
        trend={{ value: '+1%', positive: true }}
      />
      <StatCard
        title="Paid Dealer"
        value="500"
        subtitle="Increase form last month"
        Icon={HandshakeIcon}
        trend={{ value: '+7%', positive: true }}
      />
    </div>
  );
};

StatsSection.displayName = 'StatsSection';
