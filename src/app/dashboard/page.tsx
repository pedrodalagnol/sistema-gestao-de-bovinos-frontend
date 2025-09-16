'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { isAuthenticated, user, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Apenas redireciona se o carregamento inicial terminou e o usuário não está autenticado
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Mostra um estado de carregamento para evitar um "flash" da página antes do redirecionamento
    if (isLoading || !isAuthenticated) {
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className='flex items-center gap-4'>
                    <span className="text-gray-700">Olá, {user?.email}</span>
                    <button onClick={logout} className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700">
                        Sair
                    </button>
                </div>
            </header>
            
            <main>
                <p>Bem-vindo ao sistema de gestão Meu Rebanho!</p>
                {/* Aqui entrarão os componentes do seu dashboard */}
            </main>
        </div>
    );
}