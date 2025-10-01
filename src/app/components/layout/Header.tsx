// Arquivo: app/components/layout/Header.tsx
'use client';
import { useAuth } from '@/app/contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();
    return (
        <header className="flex items-center justify-end h-16 px-8 bg-white border-b border-gray-200">
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button onClick={logout} className="p-2 text-gray-500 rounded-full hover:bg-gray-100" title="Sair">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}