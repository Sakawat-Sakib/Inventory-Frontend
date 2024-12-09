'use client'

export default function ProductDialog({ product, onConfirm, onCancel }) {
  if (!product) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3 className="text-xl font-bold mb-4">Confirm Product Details</h3>
        
        <div className="space-y-2 mb-6">
          <div>
            <span className="font-medium">Material ID:</span> {product.material}
          </div>
          <div>
            <span className="font-medium">Barcode:</span> {product.barcode}
          </div>
          <div>
            <span className="font-medium">Description:</span> {product.description}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="button-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="button-primary">
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
} 