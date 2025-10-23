'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { AnimalDetails } from '@/app/types/animal';

// Importando os novos componentes
import AnimalHeader from '@/app/components/animal/AnimalHeader';
import EventForm from '@/app/components/animal/EventForm';
import EventHistory from '@/app/components/animal/EventHistory';

export default function AnimalDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [animal, setAnimal] = useState<AnimalDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnimalDetails = useCallback(() => {
        if (!id || !isAuthenticated) return;
        
        setIsLoading(true);
        api.get(`/animais/${id}`)
            .then(response => {
                setAnimal(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar detalhes do animal", error);
                setAnimal(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id, isAuthenticated]);
    
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                fetchAnimalDetails();
            }
        }
    }, [authLoading, isAuthenticated, router, fetchAnimalDetails]);

    if (authLoading || isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }
    
    if (!animal) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Animal não encontrado</h1>
                <Link href="/animais" className="text-green-600 hover:underline">
                    &larr; Voltar para o rebanho
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <AnimalHeader animal={animal} />
            <EventForm animalId={id} onEventAdded={fetchAnimalDetails} />
            <EventHistory historico={animal.historico} />
        </div>
    );
}
