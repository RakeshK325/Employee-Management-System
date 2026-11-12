import React from 'react';
import { Shield, Database } from 'lucide-react';
import Badge from '../common/Badge';

export const SettingsView = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Settings Header */}
      <div className="pb-1">
        <h2 className="text-xl font-semibold text-[#191C1A] tracking-tight">
          System Settings
        </h2>
        <p className="text-xs text-[#636B65] mt-0.5">
          Workspace parameters, integration endpoints, and organizational preferences.
        </p>
      </div>

      {/* Organization Information Form */}
      <div className="bg-white border border-[#E2E4DE] rounded-md shadow-2xs divide-y divide-[#ECEEE9]">
        <div className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-[#191C1A]">Organization Profile</h3>
          <p className="text-xs text-[#636B65] mt-0.5">
            Core legal entity metadata used across payroll and employment records.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-[#2C322E] mb-1">
                Organization Name
              </label>
              <input
                type="text"
                defaultValue="PeopleDesk Enterprise"
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBF9] border border-[#D8DBD5] rounded-md text-[#191C1A] focus:outline-none focus:border-[#54745D] focus:ring-1 focus:ring-[#54745D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2C322E] mb-1">
                Administrator Email
              </label>
              <input
                type="email"
                defaultValue="admin@peopledesk.internal"
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBF9] border border-[#D8DBD5] rounded-md text-[#191C1A] focus:outline-none focus:border-[#54745D] focus:ring-1 focus:ring-[#54745D]"
              />
            </div>
          </div>
        </div>

        {/* Technical Architecture Status */}
        <div className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-[#191C1A]">Backend & Data Connectivity</h3>
          <p className="text-xs text-[#636B65] mt-0.5">
            Current system stack configuration and environment targets.
          </p>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-md bg-[#FAFBF9] border border-[#E4E6E1] text-xs">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-[#54745D]" />
                <div>
                  <div className="font-medium text-[#191C1A]">MongoDB Atlas Database</div>
                  <div className="text-[11px] text-[#717973]">Configured via server/.env (MONGO_URI)</div>
                </div>
              </div>
              <Badge variant="warning" size="xs">Awaiting URI Config</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-[#FAFBF9] border border-[#E4E6E1] text-xs">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#54745D]" />
                <div>
                  <div className="font-medium text-[#191C1A]">Express API Server</div>
                  <div className="text-[11px] text-[#717973]">Local target: http://localhost:5000/api</div>
                </div>
              </div>
              <Badge variant="success" size="xs">Ready for Next Phase</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
