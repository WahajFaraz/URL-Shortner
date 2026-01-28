import { useState } from 'react';
import { Navbar, Sidebar, Footer } from './Header.jsx';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
