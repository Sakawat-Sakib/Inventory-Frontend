'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function ProductCard({ product }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: product._id,
    data: {
      type: 'product',
      product
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="product-card"
    >
      <div className="font-medium mb-2">Material: {product.material}</div>
      <div className="text-sm mb-1">Barcode: {product.barcode}</div>
      <div className="text-sm">{product.description}</div>
    </div>
  );
} 