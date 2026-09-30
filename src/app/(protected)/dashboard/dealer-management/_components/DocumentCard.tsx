import { IconButton } from '@mui/material';
import { ArrowDownToLine } from 'lucide-react';
import Image from 'next/image';
import { BoxCard } from './BoxCard';

interface DocumentCardProps {
  name: string;
  icon: string;
  size: number;
  fileType: string;
  onDownload?: () => void;
}
export const DocumentCard = ({ name, icon, size, fileType, onDownload }: DocumentCardProps) => {
  return (
    <BoxCard className="p-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <Image src={fileType ? icon : icon} width={37.26} height={36} alt="icon" />
        </div>
        <div className="space-y-2">
          <h4 className="text-base/5.5 text-[#2B3545] font-semibold">{name}</h4>
          <p className="text-[#717882] text-sm/4.5">{size}KB</p>
        </div>
      </div>

      {onDownload && (
        <IconButton onClick={onDownload}>
          <ArrowDownToLine color="#2B3545" size={24} />
        </IconButton>
      )}
    </BoxCard>
  );
};

DocumentCard.displayName = 'DocumentCard';
