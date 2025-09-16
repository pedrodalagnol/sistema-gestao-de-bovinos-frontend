import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 md:text-6xl">
          Bem-vindo ao <span className="text-green-600">Meu Rebanho</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          O sistema completo para a gestão do seu gado.
        </p>
        <div className="mt-8 space-x-4">
          <Link href="/auth/login" className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">
            Acessar Sistema
          </Link>
          <Link href="/auth/register" className="px-6 py-3 font-semibold text-green-700 bg-white border border-green-600 rounded-lg shadow-md hover:bg-gray-100">
            Criar Conta
          </Link>
        </div>
      </div>
    </main>
  );
}