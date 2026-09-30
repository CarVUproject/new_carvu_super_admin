import ReduxProvider from '@/components/providers/ReduxProvider';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import LoaderWrapper from '@/components/ui/LoaderWrapper';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Carvu Super Admin',
  description: 'Internal operations dashboard for the Carvu super admin platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed="true">
      <body className={`${lato.className} ${lato.variable} bg-[#F3F4F5] font-lato`}>
        <ReduxProvider>
          <LoaderWrapper>{children}</LoaderWrapper>
        </ReduxProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
