'use client'

export default function DeleteDialog({ isOpen, onClose, onConfirm, categoryName }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content max-w-sm">
        <h3 className="text-lg font-bold mb-4">Delete Category</h3>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{categoryName}"? All products in this category will be moved to Uncategorized.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 