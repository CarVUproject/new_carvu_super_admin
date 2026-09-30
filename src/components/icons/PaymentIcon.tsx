import { SVGIconProps } from '@/types/icons';

export const PaymentIcon = ({ ...props }: SVGIconProps) => {
  return (
    <svg
      width="29"
      height="28"
      viewBox="0 0 29 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.75 7C5.95507 7 4.5 8.45507 4.5 10.25V11.5H24.5V10.25C24.5 8.45507 23.0449 7 21.25 7H7.75ZM24.5 13H4.5V17.75C4.5 19.5449 5.95507 21 7.75 21H21.25C23.0449 21 24.5 19.5449 24.5 17.75V13ZM18.25 16.5H20.75C21.1642 16.5 21.5 16.8358 21.5 17.25C21.5 17.6642 21.1642 18 20.75 18H18.25C17.8358 18 17.5 17.6642 17.5 17.25C17.5 16.8358 17.8358 16.5 18.25 16.5Z"
        fill="currentColor "
      />
    </svg>
  );
};

PaymentIcon.displayName = 'PaymentIcon';
