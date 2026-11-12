import React, { useState, useEffect } from 'react';
import { X, Loader2, User, Mail, Building2, Briefcase } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const departments = [
  'Engineering',
  'Product Design',
  'Operations',
  'Finance',
  'Human Resources',
  'Marketing',
  'Legal',
];

export const EmployeeModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  employee = null 
}) => {
  const isEditMode = Boolean(employee && employee._id);

  const [formData, setFormData] = useState(() => ({
    fullName: employee?.fullName || '',
    email: employee?.email || '',
    department: employee?.department || 'Engineering',
    designation: employee?.designation || '',
    status: employee?.status || 'Active',
  }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = 'Full name is required';
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (trimmedName.length > 100) {
      newErrors.fullName = 'Full name cannot exceed 100 characters';
    }

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please provide a valid email format (e.g. name@company.com)';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation/Job Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      await onSave({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        status: formData.status,
      });
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to save employee record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative bg-white border border-[#E2E4DE] rounded-md shadow-lg max-w-lg w-full overflow-hidden z-10 transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8E8E3] flex items-center justify-between bg-[#FAFBF9]">
          <div>
            <h3 id="modal-title" className="text-sm font-semibold text-[#191C1A]">
              {isEditMode ? 'Edit Employee Details' : 'Add New Employee'}
            </h3>
            <p className="text-xs text-[#636B65] mt-0.5">
              {isEditMode 
                ? 'Update personnel credentials, organizational placement, and job role.' 
                : 'Register a new team member into the central workforce directory.'}
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="p-1 text-[#858D87] hover:text-[#191C1A] hover:bg-[#EEF0EC] rounded transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {serverError && (
            <div className="p-3 bg-[#FCF4F4] border border-[#F2CACA] rounded text-xs text-[#992222] flex items-start gap-2">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-[#2C322E] mb-1">
              Full Name <span className="text-[#BA3838]">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-[#8C938D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Sarah Jenkins"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBF9] border rounded-md text-[#191C1A] focus:outline-none transition-all ${
                  errors.fullName 
                    ? 'border-[#BA3838] focus:border-[#BA3838] focus:ring-1 focus:ring-[#BA3838]/20' 
                    : 'border-[#D8DBD5] focus:border-[#54745D] focus:bg-white focus:ring-1 focus:ring-[#54745D]'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-[#BA3838] mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-[#2C322E] mb-1">
              Work Email Address <span className="text-[#BA3838]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#8C938D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. s.jenkins@company.com"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBF9] border rounded-md text-[#191C1A] focus:outline-none transition-all ${
                  errors.email 
                    ? 'border-[#BA3838] focus:border-[#BA3838] focus:ring-1 focus:ring-[#BA3838]/20' 
                    : 'border-[#D8DBD5] focus:border-[#54745D] focus:bg-white focus:ring-1 focus:ring-[#54745D]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-[#BA3838] mt-1">{errors.email}</p>
            )}
          </div>

          {/* Department & Designation in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2C322E] mb-1">
                Department <span className="text-[#BA3838]">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-[#8C938D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBF9] border rounded-md text-[#191C1A] focus:outline-none transition-all ${
                    errors.department 
                      ? 'border-[#BA3838]' 
                      : 'border-[#D8DBD5] focus:border-[#54745D] focus:ring-1 focus:ring-[#54745D]'
                  }`}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className="text-[11px] text-[#BA3838] mt-1">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2C322E] mb-1">
                Job Title / Designation <span className="text-[#BA3838]">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-[#8C938D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Staff Architect"
                  disabled={isSubmitting}
                  className={`w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBF9] border rounded-md text-[#191C1A] focus:outline-none transition-all ${
                    errors.designation 
                      ? 'border-[#BA3838] focus:border-[#BA3838]' 
                      : 'border-[#D8DBD5] focus:border-[#54745D] focus:bg-white focus:ring-1 focus:ring-[#54745D]'
                  }`}
                />
              </div>
              {errors.designation && (
                <p className="text-[11px] text-[#BA3838] mt-1">{errors.designation}</p>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-medium text-[#2C322E] mb-1.5">
              Employment Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#191C1A]">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="accent-[#54745D]"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#54745D]" />
                  Active
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#191C1A]">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="accent-[#54745D]"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#9DA49F]" />
                  Inactive
                </span>
              </label>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#E8E8E3] flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#2C322E] bg-white border border-[#D5D8D3] rounded-md hover:bg-[#F7F7F5] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#54745D] hover:bg-[#45614D] border border-[#486350] rounded-md transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditMode ? 'Save Changes' : 'Create Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
