import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import EmployeeDirectoryView from '../employees/EmployeeDirectoryView';
import OverviewView from '../overview/OverviewView';
import SettingsView from '../settings/SettingsView';

export const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView onNavigateToEmployees={() => setActiveTab('employees')} />;
      case 'settings':
        return <SettingsView />;
      case 'employees':
      default:
        return <EmployeeDirectoryView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex text-[#191C1A]">
      {/* Persistent / Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

