'use client'

export default function CategoryDialog({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('categoryName');
    if (name) {
      onSubmit(name);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4">Create New Category</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter category name"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 