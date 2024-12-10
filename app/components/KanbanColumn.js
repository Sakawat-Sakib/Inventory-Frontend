'use client'

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TrashIcon } from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';

export default function KanbanColumn({ category, products, onDeleteCategory }) {
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          {category.name} ({products.length})
        </h3>
        {category.name !== 'Uncategorized' && (
          <button
            onClick={() => onDeleteCategory(category._id)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Delete Category"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
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