import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">UroLinq Pro</h1>
      </header>
      <main className="container mx-auto p-4">
        <Outlet /> {/* This renders the current route's component */}
      </main>
      <Toaster position="top-center" /> {/* For toast notifications */}
    </div>
  );
}
