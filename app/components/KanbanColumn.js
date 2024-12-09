'use client'

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ProductCard from './ProductCard';

export default function KanbanColumn({ category, products }) {
  const { setNodeRef } = useDroppable({
    id: category._id
  });

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
    >
      <h3 className="font-bold mb-4 text-lg">{category.name}</h3>
      <div className="space-y-2">
        <SortableContext
          items={products.map(p => p._id)}
          strategy={verticalListSortingStrategy}
        >
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
} 