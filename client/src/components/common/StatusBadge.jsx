import React, { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

/**
 * Interactive / Read-only enterprise status badge.
 * Supports status toggle (Active <-> Inactive) with in-flight pending protection.
 */
export const StatusBadge = ({ 
  status, 
  employeeId, 
  onStatusChange, 
  interactive = false 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isActive = status === 'Active';

  const handleToggle = async (newStatus) => {
    if (newStatus === status || isUpdating || !onStatusChange) return;

    setIsUpdating(true);
    setIsOpen(false);
    try {
      await onStatusChange(employeeId, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!interactive) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-normal border ${
          isActive
            ? 'bg-[#EEF3EF] text-[#344E3B] border-[#D5E2D8]'
            : 'bg-[#F2F3F0] text-[#636B65] border-[#DFE2DE]'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? 'bg-[#54745D]' : 'bg-[#9DA49F]'
          }`}
        />
        {status}
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-normal border transition-colors cursor-pointer disabled:cursor-wait ${
          isActive
            ? 'bg-[#EEF3EF] text-[#344E3B] border-[#D5E2D8] hover:bg-[#E3ECE5]'
            : 'bg-[#F2F3F0] text-[#636B65] border-[#DFE2DE] hover:bg-[#E7E9E5]'
        }`}
        title="Click to change status"
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin text-[#54745D]" />
        ) : (
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-[#54745D]' : 'bg-[#9DA49F]'
            }`}
          />
        )}
        <span>{status}</span>
        <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute left-0 mt-1 w-28 bg-white border border-[#E2E4DE] rounded-md shadow-md z-40 py-1 text-xs">
            <button
              type="button"
              onClick={() => handleToggle('Active')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#F7F7F5] transition-colors ${
                isActive ? 'font-semibold text-[#344E3B]' : 'text-[#191C1A]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#54745D]" />
              Active
            </button>
            <button
              type="button"
              onClick={() => handleToggle('Inactive')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#F7F7F5] transition-colors ${
                !isActive ? 'font-semibold text-[#636B65]' : 'text-[#191C1A]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9DA49F]" />
              Inactive
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StatusBadge;

