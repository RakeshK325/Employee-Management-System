import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import employeeService from '../../services/employeeService';
import useToast from '../../context/useToast';
import EmployeeTable from './EmployeeTable';
import EmployeeModal from './EmployeeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FilterControls from './FilterControls';
import Pagination from '../common/Pagination';

export const EmployeeDirectoryView = () => {
  const { showToast } = useToast();

  // Data states
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [pagination, setPagination] = useState({
    totalEmployees: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const hasActiveFilters = Boolean(
    search.trim() !== '' || department !== 'All' || status !== 'All'
  );

  // Synchronize with backend API whenever query parameters change
  useEffect(() => {
    let isMounted = true;

    employeeService.getEmployees({
      search,
      department,
      status,
      sortBy,
      sortOrder,
      page: pagination.currentPage,
      limit: pagination.limit,
    })
      .then((response) => {
        if (!isMounted) return;
        if (response && response.success) {
          setEmployees(response.data || []);
          if (response.pagination) {
            setPagination((prev) => ({
              ...prev,
              totalEmployees: response.pagination.totalEmployees,
              totalPages: response.pagination.totalPages,
              currentPage: response.pagination.currentPage,
              limit: response.pagination.limit,
            }));
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const errorMsg = err.message || 'Failed to retrieve employees from server';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    search, 
    department, 
    status, 
    sortBy, 
    sortOrder, 
    pagination.currentPage, 
    pagination.limit, 
    refreshTrigger, 
    showToast
  ]);

  const triggerRefresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Handle Search Change (reset to page 1)
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle Department Change (reset to page 1)
  const handleDepartmentChange = (newDept) => {
    setDepartment(newDept);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle Status Change (reset to page 1)
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle Sorting toggle
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Reset all search and filters
  const handleResetFilters = () => {
    setSearch('');
    setDepartment('All');
    setStatus('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setIsLoading(true);
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Open modal in "Add" mode
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  // Open modal in "Edit" mode
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Save Employee (Create or Update)
  const handleSaveEmployee = async (formData) => {
    if (selectedEmployee && selectedEmployee._id) {
      // Edit mode
      await employeeService.updateEmployee(selectedEmployee._id, formData);
      showToast(`Employee "${formData.fullName}" updated successfully`, 'success');
    } else {
      // Add mode
      await employeeService.createEmployee(formData);
      showToast(`Employee "${formData.fullName}" added to directory`, 'success');
    }
    triggerRefresh();
  };

  // Quick Status Toggle on table
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await employeeService.updateEmployeeStatus(id, newStatus);
      showToast(`Status updated to "${newStatus}"`, 'success');
      // Optimistically update list in state
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? { ...emp, status: newStatus } : emp))
      );
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
      triggerRefresh();
    }
  };

  // Open delete confirmation modal
  const handleDeletePrompt = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      showToast('Employee deleted successfully', 'success');
      // If we just deleted the last item on a page > 1, go back one page
      if (employees.length === 1 && pagination.currentPage > 1) {
        setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
      } else {
        triggerRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete employee', 'error');
    }
  };

  // Helper for RFC 4180 compliant CSV field escaping
  const escapeCSVField = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  // Export filtered employee records to CSV
  const handleExportCSV = async () => {
    try {
      // Fetch full set of records matching current filters
      const response = await employeeService.getEmployees({
        search,
        department,
        status,
        sortBy,
        sortOrder,
        page: 1,
        limit: 10000,
      });

      const recordsToExport = (response?.success && response.data?.length > 0) 
        ? response.data 
        : employees;

      if (!recordsToExport || recordsToExport.length === 0) {
        showToast('No records available to export', 'info');
        return;
      }

      const headers = ['Full Name', 'Email', 'Department', 'Designation', 'Status', 'Created At'];
      const rows = recordsToExport.map((e) => [
        escapeCSVField(e.fullName),
        escapeCSVField(e.email),
        escapeCSVField(e.department),
        escapeCSVField(e.designation),
        escapeCSVField(e.status),
        escapeCSVField(new Date(e.createdAt).toISOString().split('T')[0]),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `peopledesk_employees_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Exported ${recordsToExport.length} employee records to CSV`, 'success');
    } catch {
      showToast('Export failed. Please check network connection.', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h2 className="text-xl font-semibold text-[#191C1A] tracking-tight">
            Employee Directory
          </h2>
          <p className="text-xs text-[#636B65] mt-0.5">
            Active organizational personnel, department allocations, and verified employment records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={triggerRefresh}
            disabled={isLoading}
            className="p-1.5 text-[#5C625E] hover:text-[#191C1A] hover:bg-[#F2F3F0] rounded border border-[#D5D8D3] bg-white transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh employee data from server"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#54745D]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2C322E] bg-white border border-[#D5D8D3] rounded-md hover:bg-[#F7F7F5] transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#5C625E]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleAddEmployee}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#54745D] hover:bg-[#45614D] border border-[#486350] rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterControls
        search={search}
        onSearchChange={handleSearchChange}
        department={department}
        onDepartmentChange={handleDepartmentChange}
        status={status}
        onStatusChange={handleStatusChange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Primary Data Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        error={error}
        onRetry={triggerRefresh}
        onEdit={handleEditEmployee}
        onDelete={handleDeletePrompt}
        onStatusChange={handleStatusToggle}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onAddEmployee={handleAddEmployee}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination Footer */}
      {!isLoading && !error && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalEmployees={pagination.totalEmployees}
          limit={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        key={isModalOpen ? (selectedEmployee?._id || 'new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        employee={employeeToDelete}
      />
    </div>
  );
};

export default EmployeeDirectoryView;
