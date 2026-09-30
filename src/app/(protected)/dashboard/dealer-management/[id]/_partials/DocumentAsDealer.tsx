'use client';
import { cn } from '@/lib/twMerge';
import { BoxCard, BoxCardSeparator, BoxCardTitle } from '../../_components/BoxCard';
import { DocumentCard } from '../../_components/DocumentCard';

const DOCUMENTS = [
  {
    name: 'Dealer License Document.pdf',
    icon: '/assets/images/icon-pdf.png',
    fileType: 'pdf',
    size: 94,
    title: 'OMVIC Dealer License',
  },
  {
    name: 'Dealer License Document.pdf',
    icon: '/assets/images/icon-pdf.png',
    fileType: 'pdf',
    size: 93,
    title: 'Business Ownership Document',
  },
  {
    name: 'Dealer License Document.pdf',
    icon: '/assets/images/icon-pdf.png',
    fileType: 'pdf',
    size: 92,
    title: 'VOID Cheque',
  },
  {
    name: 'Dealer License Document.jpg',
    icon: '/assets/images/jpg-icon.png',
    fileType: 'jpg',
    size: 90,
    title: 'PAD and PAW Authorization Form',
  },
  {
    name: 'Dealer License Document.jpg',
    icon: '/assets/images/jpg-icon.png',
    fileType: 'pdf',
    size: 94,
    title: 'Driver’s license',
  },
];

export const DocumentAsDealer = () => {
  return (
    <BoxCard>
      <BoxCardTitle>Documents as a Dealer</BoxCardTitle>
      <BoxCardSeparator />

      <div className="grid grid-cols-12 gap-4 ">
        {DOCUMENTS.map((document, index, arr) => (
          <BoxCard
            key={index}
            className={cn(
              `col-span-6 col-start-${index - 1} col-end-${index + 6}`,
              arr.length % 2 !== 0 && index === arr.length - 1 && `col-span-12`,
            )}
          >
            <BoxCardTitle className="text-[#555D6A]">
              {document.title} <span className="text-[#099D01]">*</span>
            </BoxCardTitle>
            <div className="mt-4">
              <DocumentCard
                name={document.name}
                icon={document.icon}
                fileType={document.fileType}
                size={document.size}
                onDownload={() => alert(`Downloading... ${document.title}`)}
              />
            </div>
          </BoxCard>
        ))}
      </div>
    </BoxCard>
  );
};

DocumentAsDealer.displayName = 'DocumentAsDealer';
