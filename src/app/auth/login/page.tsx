'use client';

import { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import Link from 'next/link';
import { LoginRequestDTO } from '@/src/types/auth';

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginRequestDTO>({ email: '', senha: '' });
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(formData);
        } catch (err) {
            setError('E-mail ou senha inválidos.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Acessar Minha Conta</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Seu E-mail" required className="w-full px-4 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha" required className="w-full px-4 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button type="submit" className="w-full py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Entrar
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Não tem uma conta?{' '}
                    <Link href="/auth/register" className="font-medium text-green-600 hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}