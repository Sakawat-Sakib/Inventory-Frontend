'use client'

import { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import KanbanBoard from './components/KanbanBoard';
import ProductDialog from './components/ProductDialog';

export default function Home() {
  const [scannedProduct, setScannedProduct] = useState(null);

  function handleProductScanned(product) {
    setScannedProduct(product);
  }

  function handleConfirmProduct() {
    // Product is already saved by the scan API
    setScannedProduct(null);
  }

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-secondary p-4">
        <h1 className="text-2xl font-bold">Inventory Management System</h1>
      </header>

      <main>
        <BarcodeScanner onProductScanned={handleProductScanned} />
        <KanbanBoard />
        
        {scannedProduct && (
          <ProductDialog
            product={scannedProduct}
            onConfirm={handleConfirmProduct}
            onCancel={() => setScannedProduct(null)}
          />
        )}
      </main>
    </div>
  );
} 