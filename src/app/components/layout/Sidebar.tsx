// Arquivo: app/components/layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, BarChart2, DollarSign, Package } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Rebanho', href: '/animais', icon: List },
  { name: 'Lotes', href: '/lotes', icon: Package },
  { name: 'Pastos', href: '/pastos', icon: BarChart2 },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 p-6 text-white bg-green-800 md:block">
      <div className="mb-10 text-2xl font-bold">Meu Rebanho</div>
      <nav>
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.name}>
                <Link href={link.href} className={`flex items-center p-3 my-2 rounded-lg transition-colors ${isActive ? 'bg-green-700' : 'hover:bg-green-700'}`}>
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}