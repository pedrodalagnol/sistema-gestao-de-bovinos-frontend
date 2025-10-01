'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Sidebar from '@/app/components/layout/Sidebar';
import Header from '@/app/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Apenas redireciona se o carregamento da autenticação terminou e o usuário NÃO está autenticado.
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Exibe uma tela de carregamento para evitar "piscar" a página de login antes do redirecionamento
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  // Se estiver autenticado, renderiza o layout do dashboard e o conteúdo da página
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 overflow-y-auto md:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // Se não estiver autenticado e ainda não redirecionou, não renderiza nada para evitar piscar a tela
  return null;
}