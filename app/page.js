'use client'

import { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import KanbanBoard from './components/KanbanBoard';

export default function Home() {
  const [newProduct, setNewProduct] = useState(null);

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-secondary p-4">
        <h1 className="text-2xl font-bold">Inventory Management System</h1>
      </header>

      <main>
        <BarcodeScanner 
          onProductScanned={(product) => setNewProduct(product)} 
        />
        <KanbanBoard newProduct={newProduct} />
      </main>
    </div>
  );
} 