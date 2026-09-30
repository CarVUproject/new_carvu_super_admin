'use client';
import { Divider } from '@mui/material';
import { SIDEBAR_BOTTOM_ITEMS, SIDEBAR_ITEMS } from '@/constants/DashboardSidebarItems';
import { SidebarBottomLink, SidebarItem, SidebarLink } from './SidebarItem';

export const Sidebar = () => {
  return (
    <aside className="w-[300px] bg-white flex flex-col h-screen overflow-hidden shrink-0 sticky top-0">
      <div className="px-6 pt-6">
        <h1
          style={{ color: '#454545' }}
          className="font-bold text-3xl leading-10 font-lato text-center"
        >
          CarVU
        </h1>
      </div>

      <Divider className="!mt-7 !mb-7 !border !border-[#D7D7D7] !mx-6" />

      {/* Navigation */}
      <nav className="grow flex flex-col gap-2 overflow-y-auto px-6 [scrollbar-gutter:stable]">
        <div className="">
          {SIDEBAR_ITEMS.map((section, idx) => {
            return (
              <SidebarItem key={idx} title={section.title}>
                {section.children.map((item) => (
                  <SidebarLink key={item.href} item={item} />
                ))}
              </SidebarItem>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="mt-auto pt-4 border-t border-gray-200 space-y-1">
          {SIDEBAR_BOTTOM_ITEMS.map((item, idx) => (
            <SidebarBottomLink
              key={idx}
              item={item}
              onClick={() => {
                console.log(item.title);
              }}
              variant={item.title === 'Log out' ? 'logout' : 'default'}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
