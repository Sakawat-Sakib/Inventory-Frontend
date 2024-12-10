'use client'

import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import ProductCard from './ProductCard';
import CategoryDialog from './CategoryDialog';
import axios from 'axios';

export default function KanbanBoard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchProducts()
    ]).finally(() => setLoading(false));
  }, []);

  async function fetchCategories() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const sortedCategories = response.data.sort((a, b) => {
        if (a.name === 'Uncategorized') return -1;
        if (b.name === 'Uncategorized') return 1;
        return a.name.localeCompare(b.name);
      });
      setCategories(sortedCategories);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  }

  async function fetchProducts() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    }
  }

  async function handleCreateCategory(name) {
    if (name.toLowerCase() === 'uncategorized') {
      alert('Cannot create another Uncategorized category');
      return;
    }
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { name });
      setCategories(prev => {
        const uncategorized = prev.find(c => c.name === 'Uncategorized');
        const others = prev.filter(c => c.name !== 'Uncategorized');
        return [uncategorized, ...others, response.data];
      });
      setIsCategoryDialogOpen(false);
    } catch (error) {
      alert('Failed to create category');
    }
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const productId = active.id;
      const categoryId = over.id;
      
      console.log('Moving product:', productId, 'to category:', categoryId);
      console.log('Current products in category:', 
        products.filter(p => p.category && p.category._id === categoryId).length
      );
      
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/category`, 
          { categoryId }
        );

        console.log('Server response:', response.data);

        if (response.data) {
          setProducts(prevProducts => {
            const newProducts = prevProducts.map(product => 
              product._id === productId 
                ? { ...product, category: response.data.category }
                : product
            );
            
            console.log('Updated products in category:', 
              newProducts.filter(p => p.category && p.category._id === categoryId).length
            );
            
            return newProducts;
          });
        }
      } catch (error) {
        console.error('Failed to update product category:', error);
        console.error('Error response:', error.response?.data);
        alert('Failed to update product category');
      }
    }
    
    setActiveId(null);
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Inventory Board</h2>
        <button onClick={() => setIsCategoryDialogOpen(true)} className="button-primary">
          Create Category
        </button>
      </div>

      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {categories.map(category => (
            <KanbanColumn
              key={category._id}
              category={category}
              products={products.filter(p => {
                if (category.name === 'Uncategorized') {
                  return !p.category || p.category._id === category._id;
                }
                return p.category && p.category._id === category._id;
              })}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <ProductCard
              product={products.find(p => p._id === activeId)}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
} 