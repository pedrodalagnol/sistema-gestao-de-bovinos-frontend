
import Link from 'next/link';
import { AnimalDetails } from '@/app/types/animal';

interface AnimalHeaderProps {
    animal: AnimalDetails;
}

export default function AnimalHeader({ animal }: AnimalHeaderProps) {
    return (
        <div className="mb-8">
            <Link href="/animais" className="mb-6 inline-block text-green-600 hover:underline">
                &larr; Voltar para o rebanho
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card de Informações Principais */}
                <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
                    <h1 className="text-3xl font-bold text-gray-800">{animal.identificador}</h1>
                    <p className="text-gray-600 mt-1">{animal.raca} &bull; {animal.sexo}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Nascimento: {new Date(animal.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                </div>
                {/* Card de GMD */}
                <div className="p-6 text-center text-white bg-green-600 rounded-lg shadow-md flex flex-col justify-center">
                    <p className="text-lg">GMD (kg/dia)</p>
                    <p className="text-5xl font-bold">
                        {typeof animal.gmd === 'number' ? animal.gmd.toFixed(3) : '0.000'}
                    </p>
                </div>
            </div>
        </div>
    );
}
