import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/db';
import { ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@codmhub.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await db.login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Credenciais Inválidas');
        }
    };

    return (
        <div className="min-h-screen bg-codm-dark flex items-center justify-center p-4">
            <div className="bg-codm-panel p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative">
                <Link to="/" className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
                    <ArrowLeft size={16} /> Voltar
                </Link>

                <div className="text-center mb-8 mt-4">
                    <h1 className="font-display text-4xl font-bold text-white tracking-wider">
                        ACESSO <span className="text-codm-yellow">ADMIN</span>
                    </h1>
                    <p className="text-gray-500 mt-2 uppercase text-xs tracking-widest font-bold">Faça login para gerenciar o arsenal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Endereço de Email</label>
                        <input
                            type="email"
                            placeholder="OPERADOR@COD HUB"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-codm-yellow transition-colors uppercase placeholder:text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Código de Acesso</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-codm-yellow transition-colors"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center font-bold uppercase italic">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-codm-yellow text-black font-display font-bold py-4 rounded-sm hover:bg-white transition-colors text-2xl uppercase tracking-widest skew-x-[-15deg]"
                    >
                        <span className="skew-x-[15deg] block">Entrar no Terminal</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;