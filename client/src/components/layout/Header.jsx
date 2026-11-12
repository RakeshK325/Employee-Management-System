import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const Header = ({ activeTab, onOpenMobileSidebar }) => {
  const getTabMetadata = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'System Overview',
          breadcrumb: 'Dashboard / Overview',
        };
      case 'settings':
        return {
          title: 'Organization Settings',
          breadcrumb: 'System / Configuration',
        };
      case 'employees':
      default:
        return {
          title: 'Employee Directory',
          breadcrumb: 'Human Resources / Directory',
        };
    }
  };

  const { title, breadcrumb } = getTabMetadata();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-[#E8E8E3] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 -ml-2 text-[#5C625E] hover:text-[#191C1A] hover:bg-[#F2F3F0] rounded-md transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-[#79807B] tracking-wide uppercase">
            {breadcrumb}
          </span>
          <h1 className="text-base font-semibold text-[#191C1A] tracking-tight truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8C938D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records, personnel, departments..."
            className="w-full pl-9 pr-12 py-1.5 bg-[#F9FAF8] border border-[#E0E2DE] rounded-md text-xs text-[#191C1A] placeholder-[#8C938D] focus:outline-none focus:border-[#54745D] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#54745D] transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-[#8C938D] bg-[#EEEEEC] px-1.5 py-0.5 rounded border border-[#DFE1DC]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          className="p-2 text-[#5C625E] hover:text-[#191C1A] hover:bg-[#F2F3F0] rounded-md transition-colors relative"
          title="System notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#54745D] rounded-full" />
        </button>

        <button 
          className="hidden sm:flex p-2 text-[#5C625E] hover:text-[#191C1A] hover:bg-[#F2F3F0] rounded-md transition-colors"
          title="Documentation and help"
          aria-label="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#E8E8E3] mx-1 hidden sm:block" />

        {/* Administrator Capsule */}
        <div className="flex items-center gap-2.5 pl-1 py-1 rounded-md cursor-pointer hover:bg-[#F7F7F5] transition-colors">
          <div className="w-8 h-8 rounded-md bg-[#202421] text-[#F7F7F5] flex items-center justify-center font-medium text-xs tracking-wider border border-[#2D332E]">
            AD
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-medium text-[#191C1A] leading-tight">
              Administrator
            </span>
            <span className="text-[11px] text-[#79807B] leading-tight">
              HR Operations
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#8C938D] hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;

