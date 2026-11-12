import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  employee,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !employee) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(employee._id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={() => !isDeleting && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative bg-white border border-[#E2E4DE] rounded-md shadow-lg max-w-md w-full overflow-hidden z-10 transition-all p-5"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded bg-[#FDF2F2] border border-[#F9D2D2] text-[#BA3838] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 id="delete-dialog-title" className="text-sm font-semibold text-[#191C1A]">
              Delete Employee Record
            </h3>
            <p className="text-xs text-[#5C625E] mt-1 leading-relaxed">
              Are you sure you want to permanently delete the profile for{' '}
              <strong className="text-[#191C1A]">{employee.fullName}</strong> ({employee.email})?
            </p>
            <p className="text-[11px] text-[#8C938D] mt-2">
              This action cannot be undone and will remove the record from MongoDB Atlas.
            </p>
          </div>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="p-1 -mr-1 -mt-1 text-[#8C938D] hover:text-[#191C1A] rounded transition-colors disabled:opacity-50"
            aria-label="Cancel delete"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-3 border-t border-[#E8E8E3] flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-[#2C322E] bg-white border border-[#D5D8D3] rounded-md hover:bg-[#F7F7F5] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#BA3838] hover:bg-[#A32E2E] border border-[#A83232] rounded-md transition-colors shadow-2xs disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete Employee</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

