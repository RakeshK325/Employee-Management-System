import React from 'react';
import { 
  Building2, 
  Briefcase, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  UserX, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  RotateCw
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const EmployeeTable = ({
  employees,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onStatusChange,
  sortBy,
  sortOrder,
  onSort,
  onAddEmployee,
  hasActiveFilters,
  onResetFilters,
}) => {
  const getInitials = (name = '') => {
    return name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#A8AEA9] opacity-60 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#54745D] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#54745D] ml-1 inline" />
    );
  };

  // 1. Error State
  if (error && !isLoading) {
    return (
      <div className="bg-white border border-[#E2E4DE] rounded-md p-8 text-center shadow-2xs">
        <div className="w-10 h-10 rounded-full bg-[#FCF2F2] border border-[#FAD4D4] text-[#BA3838] flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[#191C1A]">Unable to Load Employees</h3>
        <p className="text-xs text-[#636B65] mt-1 max-w-sm mx-auto">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#54745D] hover:bg-[#45614D] rounded-md transition-colors shadow-2xs"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E4DE] rounded-md shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAFBF9] border-b border-[#E2E4DE] text-[#555C57] select-none">
              {/* Employee Column Header */}
              <th
                scope="col"
                onClick={() => onSort('fullName')}
                className="py-2.5 px-4 font-semibold text-[11px] tracking-wider uppercase cursor-pointer hover:text-[#191C1A] transition-colors"
              >
                <div className="flex items-center">
                  <span>Employee</span>
                  {renderSortIndicator('fullName')}
                </div>
              </th>

              {/* Department Column Header */}
              <th
                scope="col"
                onClick={() => onSort('department')}
                className="py-2.5 px-4 font-semibold text-[11px] tracking-wider uppercase cursor-pointer hover:text-[#191C1A] transition-colors"
              >
                <div className="flex items-center">
                  <span>Department</span>
                  {renderSortIndicator('department')}
                </div>
              </th>

              {/* Designation Column Header */}
              <th
                scope="col"
                onClick={() => onSort('designation')}
                className="py-2.5 px-4 font-semibold text-[11px] tracking-wider uppercase cursor-pointer hover:text-[#191C1A] transition-colors"
              >
                <div className="flex items-center">
                  <span>Designation</span>
                  {renderSortIndicator('designation')}
                </div>
              </th>

              {/* Status Column Header */}
              <th
                scope="col"
                onClick={() => onSort('status')}
                className="py-2.5 px-4 font-semibold text-[11px] tracking-wider uppercase cursor-pointer hover:text-[#191C1A] transition-colors"
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {renderSortIndicator('status')}
                </div>
              </th>

              {/* Actions Header */}
              <th scope="col" className="py-2.5 px-4 font-semibold text-[11px] tracking-wider uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBECE7] text-[#191C1A]">
            {/* 2. Loading Skeleton Rows */}
            {isLoading && (
              <>
                {[1, 2, 3, 4, 5].map((idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-[#EAECE8]" />
                        <div className="space-y-1.5 flex-1 max-w-xs">
                          <div className="h-3 bg-[#EAECE8] rounded w-28" />
                          <div className="h-2.5 bg-[#F0F2EE] rounded w-40" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 bg-[#EAECE8] rounded w-24" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 bg-[#EAECE8] rounded w-32" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-[#EAECE8] rounded-full w-14" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex gap-2">
                        <div className="h-5 w-10 bg-[#EAECE8] rounded" />
                        <div className="h-5 w-6 bg-[#EAECE8] rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}

            {/* 3. Empty State */}
            {!isLoading && employees.length === 0 && (
              <tr>
                <td colSpan="5" className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-10 h-10 rounded-full bg-[#F4F5F2] text-[#78807A] flex items-center justify-center mx-auto mb-3 border border-[#E2E4DE]">
                      <UserX className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#191C1A]">No Employee Records Found</h3>
                    <p className="text-xs text-[#636B65] mt-1">
                      {hasActiveFilters
                        ? 'No employees match your current filter and search criteria.'
                        : 'Your workforce directory currently contains no registered employees.'}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={onResetFilters}
                          className="px-3 py-1.5 text-xs font-medium text-[#2C322E] bg-white border border-[#D5D8D3] rounded-md hover:bg-[#F7F7F5] transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onAddEmployee}
                        className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#54745D] hover:bg-[#45614D] rounded-md transition-colors shadow-2xs"
                      >
                        Add New Employee
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {/* 4. Real Employee Records */}
            {!isLoading && employees.map((employee) => (
              <tr 
                key={employee._id}
                className="hover:bg-[#F9FAF8] transition-colors duration-150 group"
              >
                {/* Employee Info */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-[#202421] text-[#F7F7F5] flex items-center justify-center font-medium text-[11px] shrink-0 border border-[#2D332E]">
                      {getInitials(employee.fullName)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-[#191C1A] truncate group-hover:text-[#45614D] transition-colors">
                        {employee.fullName}
                      </span>
                      <span className="text-[11px] text-[#717973] truncate">
                        {employee.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="py-3 px-4 text-[#3C423E] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#878F89]" />
                    <span>{employee.department}</span>
                  </div>
                </td>

                {/* Designation */}
                <td className="py-3 px-4 text-[#3C423E] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#878F89]" />
                    <span>{employee.designation}</span>
                  </div>
                </td>

                {/* Status Column with Interactive Badge */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <StatusBadge
                    status={employee.status}
                    employeeId={employee._id}
                    onStatusChange={onStatusChange}
                    interactive={true}
                  />
                </td>

                {/* Row Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(employee)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#404742] hover:text-[#191C1A] hover:bg-[#EEF0EC] rounded border border-transparent hover:border-[#D5D8D3] transition-colors"
                      title="Edit employee record"
                    >
                      <Edit3 className="w-3 h-3 text-[#5C625E]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(employee)}
                      className="p-1 text-[#8C938D] hover:text-[#BA3838] hover:bg-[#FDF2F2] rounded transition-colors"
                      title="Delete employee record"
                      aria-label="Delete employee"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;

