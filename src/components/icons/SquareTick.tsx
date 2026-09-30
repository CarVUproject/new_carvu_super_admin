import { SVGIconProps } from '@/types/icons';

export const SquareTick = ({ ...props }: SVGIconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#3AB134"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke="#3AB134"
        stroke-width="1"
      />
      <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="white" stroke-width="1.5" />
    </svg>
  );
};

SquareTick.displayName = 'SquareTick';
