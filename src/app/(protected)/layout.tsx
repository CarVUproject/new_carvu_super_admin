'use client';

import { useEffect } from 'react';
import { useGetMeQuery } from '@/features/user/userSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

import { AdminShell } from '@/components/admin/AdminShell';

type ProtectProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout: React.FC<ProtectProtectedLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { data: loggedInUserData, isLoading, isError, error } = useGetMeQuery();

  useEffect(() => {
    if (!isError) return;

    if ('status' in error && error?.status) {
      toast('Unauthenticated!', { type: 'warning', position: 'top-right' });
      router.replace('/login');
      return;
    }

    toast('Something went wrong. Please try again later.', {
      type: 'warning',
      position: 'top-right',
    });
  }, [error, isError, router]);

  useEffect(() => {
    if (isLoading) return;

    if (!loggedInUserData?.is_superuser) {
      router.replace('/login');
    }
  }, [isLoading, loggedInUserData, router]);

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center bg-cv-gray-25">
        <div className="animate-pulse">
          <Image
            src="/assets/images/carvu-logo-green.png"
            height={100}
            width={250}
            alt="carvu logo"
          />
        </div>
      </div>
    );
  }

  if (isError || !loggedInUserData?.is_superuser) {
    return null;
  }

  return <AdminShell user={loggedInUserData}>{children}</AdminShell>;
};

export default ProtectedLayout;
