'use client'

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ProductCard from './ProductCard';

export default function KanbanColumn({ category, products }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category._id,
    data: {
      accepts: 'product',
      categoryId: category._id
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'bg-secondary-light' : ''}`}
    >
      <h3 className="font-bold mb-4 text-lg">
        {category.name} ({products.length})
      </h3>
      <div className="flex-1 relative">
        <SortableContext 
          items={products.map(p => p._id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
            {/* Empty space to make entire area droppable */}
            {products.length === 0 && (
              <div className="h-[200px]" />
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
} 