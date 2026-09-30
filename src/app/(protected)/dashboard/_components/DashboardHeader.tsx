import { BellIcon } from '@/components/icons/BellIcon';
import { ChatIcon } from '@/components/icons/ChatIcon';
import { DynamicDashboardTitle } from '../_partials/DynamicDashboardTitle';
import { SearchInputBox } from '../../../../components/ui/SearchInputBox';
import { UserProfile } from './UserProfile';

export const DashboardHeader = () => {
  return (
    <header className="bg-white border border-[#EAEBEC] rounded-xl px-4 py-5.5 flex items-center justify-between relative">
      <DynamicDashboardTitle />
      <div className="flex items-center space-x-4 w-[719px]">
        <SearchInputBox />
        <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <ChatIcon className="text-[#74787A]" />
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <BellIcon className="text-[#74787A]" />
        </div>
        <UserProfile />
      </div>
    </header>
  );
};

DashboardHeader.displayName = 'DashboardHeader';
