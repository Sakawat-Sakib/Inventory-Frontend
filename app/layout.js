import './globals.css'

export const metadata = {
  title: 'Inventory Management System',
  description: 'Barcode-driven inventory system with Kanban board',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-secondary min-h-screen">
        {children}
      </body>
    </html>
  )
} 