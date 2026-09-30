'use client';

import { MoreVertical } from '@/components/icons/MoreVerticalIcon';
import { cn } from '@/lib/twMerge';
import { Card, CardContent, IconButton } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { ElementType, FC } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  Icon: ElementType;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export const StatCard: FC<StatCardProps> = ({ title, value, subtitle, Icon, trend, className }) => {
  return (
    <Card className={cn('!rounded-lg !shadow-none !p-4', className)}>
      <CardContent className="flex flex-col !p-0">
        {/* Title & menu */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#374151]">{title}</p>

          <IconButton>
            <MoreVertical className="text-[#2B3545]" />
          </IconButton>
        </div>

        {/* Value */}
        <div className="flex items-center gap-2 mt-4 mb-2">
          <div className="w-8 h-8 bg-[#F3F4F5] rounded-md flex items-center justify-center">
            <Icon className="text-[#2B3545]" />
          </div>
          <p className="text-[#2B3545] text-2xl font-bold">{value}</p>
        </div>

        {/* Subtitle & trend */}
        <div className="flex justify-between items-end">
          <p className="text-xs text-[#6B7280]">{subtitle}</p>
          {trend && (
            <span
              className={cn(
                'text-sm  border-[0.5px] border-primary p-1 rounded-sm flex items-center gap-1',
                trend.positive ? 'text-[#088F01] bg-[#EEF5EE]' : 'text-red-600 bg-red-50',
              )}
            >
              <TrendingUp className="h-4 w-4 text-[#088F01]" />
              {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

StatCard.displayName = 'StatCard';
