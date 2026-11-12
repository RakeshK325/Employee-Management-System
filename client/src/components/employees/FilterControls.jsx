import React, { useState, useEffect } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

const departments = [
  'All',
  'Engineering',
  'Product Design',
  'Operations',
  'Finance',
  'Human Resources',
  'Marketing',
  'Legal',
];

export const FilterControls = ({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  // Synchronize state during render when prop changes externally (e.g. on reset)
  if (prevSearch !== search) {
    setPrevSearch(search);
    setLocalSearch(search);
  }

  // Debounce search update to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  return (
    <div className="bg-white border border-[#E2E4DE] rounded-md p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="w-3.5 h-3.5 text-[#858D87] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Filter by name, email, department..."
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#FAFBF9] border border-[#D8DBD5] rounded-md text-[#191C1A] placeholder-[#858D87] focus:outline-none focus:border-[#54745D] focus:bg-white focus:ring-1 focus:ring-[#54745D] transition-all"
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch('');
              onSearchChange('');
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858D87] hover:text-[#191C1A] p-0.5 rounded cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Department Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-[#6B736D] hidden sm:inline">Dept:</span>
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#FAFBF9] border border-[#D8DBD5] rounded-md text-[#2C322E] focus:outline-none focus:border-[#54745D] focus:ring-1 focus:ring-[#54745D]"
          >
            <option value="All">All Departments</option>
            {departments.filter(d => d !== 'All').map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-[#6B736D] hidden sm:inline">Status:</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#FAFBF9] border border-[#D8DBD5] rounded-md text-[#2C322E] focus:outline-none focus:border-[#54745D] focus:ring-1 focus:ring-[#54745D]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Reset Filters Action Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#5C625E] hover:text-[#191C1A] hover:bg-[#F2F3F0] rounded border border-[#D8DBD5] transition-colors cursor-pointer"
            title="Reset all search and filter values"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterControls;
