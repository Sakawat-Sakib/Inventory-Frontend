'use client'

import BarcodeScanner from './components/BarcodeScanner';
import KanbanBoard from './components/KanbanBoard';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-primary text-secondary p-4">
        <h1 className="text-2xl font-bold">Inventory Management System</h1>
      </header>

      <main>
        <BarcodeScanner onProductScanned={() => {}} />
        <KanbanBoard />
      </main>
    </div>
  );
} 