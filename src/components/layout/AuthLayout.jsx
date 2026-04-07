import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <main className="pt-16 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
}
