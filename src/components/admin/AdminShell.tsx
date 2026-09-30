import type { ReactNode } from 'react';

import type { UserType } from '@/types/user.types';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

type AdminShellProps = {
  user: UserType;
  children: ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-cv-gray-25 font-lato text-cv-gray-900">
      <AdminSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="px-4 py-4 sm:px-6">
          <AdminTopbar user={user} />
        </div>
        <main className="flex-1 px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-[1600px] space-y-4">
            <AdminMobileNav />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
