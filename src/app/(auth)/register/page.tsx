'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { CadastroRequestDTO } from '@/app/types/auth';

export default function RegisterPage() {
    const [formData, setFormData] = useState<CadastroRequestDTO>({ nomeFazenda: '', nomeUsuario: '', email: '', senha: '' });
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await register(formData);
        } catch (err) {
            setError('Falha ao registrar. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Criar Nova Conta</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="nomeFazenda" value={formData.nomeFazenda} onChange={handleChange} placeholder="Nome da Fazenda" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="text" name="nomeUsuario" value={formData.nomeUsuario} onChange={handleChange} placeholder="Seu Nome Completo" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Seu E-mail" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Registrar</button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-medium text-green-600 hover:underline">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
}