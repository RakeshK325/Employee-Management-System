import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      badge: 'Core',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#202421] text-[#E5E8E5] flex flex-col justify-between border-r border-[#2D332E] transition-all duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-18' : 'w-64'}`}
      >
        {/* Top: Branding & Toggle */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#2C322D]">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Monogram Logo Mark */}
              <div className="w-8 h-8 rounded bg-[#54745D] flex items-center justify-center shrink-0 text-white font-semibold tracking-wider text-sm shadow-xs">
                <Layers className="w-4 h-4 text-[#F7F7F5]" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-base tracking-tight text-[#F7F7F5]">
                      PeopleDesk
                    </span>
                    <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.2 bg-[#2D342F] text-[#9EA6A0] rounded border border-[#374039]">
                      HRMS
                    </span>
                  </div>
                  <span className="text-[11px] text-[#858E87] truncate">
                    Enterprise Workspace
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-[#9EA6A0] hover:text-[#F7F7F5] p-1 rounded hover:bg-[#2C322D]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4">
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-[#737C75]">
                Platform
              </p>
            )}

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative ${
                      isActive
                        ? 'bg-[#29302B] text-[#F7F7F5] shadow-xs'
                        : 'text-[#9DA59F] hover:bg-[#262C28] hover:text-[#E2E6E3]'
                    }`}
                  >
                    {/* Active Accent Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#54745D] rounded-r-full" />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#7CA286]'
                          : 'text-[#828B84] group-hover:text-[#B4BCB6]'
                      }`}
                    />

                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2D352F] text-[#909A92] font-normal border border-[#39423B]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Workspace Status & Collapse Toggle */}
        <div className="p-3 border-t border-[#2C322D] space-y-2">
          {/* Organization Pill */}
          {!isCollapsed ? (
            <div className="p-2.5 rounded-md bg-[#252B27] border border-[#2F3630]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#54745D] shrink-0" />
                <span className="text-xs font-medium text-[#DDE1DD] truncate">
                  PeopleDesk Workspace
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#7E8880]">
                <span>System Status</span>
                <span className="text-[#8FA895] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Operational
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <span className="w-2 h-2 rounded-full bg-[#54745D]" title="Workspace - Operational" />
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center gap-2 py-1.5 text-xs text-[#828B84] hover:text-[#E2E6E3] hover:bg-[#262C28] rounded transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse View</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

