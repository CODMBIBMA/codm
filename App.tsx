import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, Search, ShieldAlert, LayoutDashboard, Users, Crosshair, FileText, ChevronRight } from 'lucide-react';
import { db } from './services/db';

// --- Pages Imports ---
import Home from './pages/Home';
import StreamerList from './pages/StreamerList';
import StreamerProfile from './pages/StreamerProfile';
import LoadoutDetail from './pages/LoadoutDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStreamers from './pages/admin/Streamers';
import AdminWeapons from './pages/admin/Weapons';
import AdminLoadouts from './pages/admin/Loadouts';
import AdminLogin from './pages/admin/Login';

// --- Layout Components ---

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) navigate(`/streamers?q=${search}`);
    };

    return (
        <nav className="bg-codm-dark/95 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex-shrink-0 group flex items-center gap-2">
                            {/* Logo simplificado estilo militar */}
                            <div className="w-10 h-10 bg-codm-yellow flex items-center justify-center font-display font-bold text-black text-2xl skew-x-[-10deg]">
                                <span className="skew-x-[10deg]">CH</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-2xl text-white tracking-widest leading-none uppercase">
                                    CODM <span className="text-codm-yellow">HUB</span>
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] leading-none">Arsenal Tático</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/" className="font-display font-bold text-xl uppercase tracking-wider text-gray-400 hover:text-white px-6 py-2 transition-all hover:bg-white/5 border-l-2 border-transparent hover:border-codm-yellow">
                                Início
                            </Link>
                            <Link to="/streamers" className="font-display font-bold text-xl uppercase tracking-wider text-gray-400 hover:text-white px-6 py-2 transition-all hover:bg-white/5 border-l-2 border-transparent hover:border-codm-yellow">
                                STREAMERS
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="PROCURAR ARMA..."
                                className="bg-black/40 text-gray-200 text-sm font-sans font-semibold rounded-sm pl-4 pr-10 py-2 border border-white/10 focus:border-codm-yellow focus:outline-none w-64 transition-all uppercase placeholder:text-gray-600"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-2 text-codm-yellow hover:text-white transition-colors">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-codm-yellow">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-codm-dark border-b border-codm-yellow/20">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/" className="text-white block px-3 py-3 text-lg font-display uppercase tracking-widest border-l-4 border-codm-yellow bg-white/5">Início</Link>
                        <Link to="/streamers" className="text-gray-400 block px-3 py-3 text-lg font-display uppercase tracking-widest hover:text-white">STREAMERS</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Footer = () => (
    <footer className="bg-codm-dark border-t border-white/5 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">
                    Servidor Online &bull; v3.0.0
                </p>
            </div>
            <Link to="/admin" className="flex items-center gap-2 text-xs uppercase font-bold text-gray-700 hover:text-codm-yellow transition-colors">
                <ShieldAlert size={14} /> Acesso Admin
            </Link>
        </div>
    </footer>
);

const PublicLayout = ({ children }: { children?: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col bg-codm-dark text-gray-100 font-sans selection:bg-codm-yellow selection:text-black">
        <Navbar />
        <main className="flex-grow">
            {children}
        </main>
        <Footer />
    </div>
);

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await db.logout();
        navigate('/');
    };

    const NavItem = ({ to, icon: Icon, label }: any) => {
        const active = location.pathname.startsWith(to);
        return (
            <Link to={to} className={`flex items-center space-x-3 px-4 py-3 border-l-4 transition-all ${active ? 'bg-white/5 border-codm-yellow text-white' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Icon size={20} />
                <span className="font-display font-bold tracking-wide uppercase text-lg">{label}</span>
            </Link>
        )
    }

    return (
        <div className="min-h-screen flex bg-codm-dark text-gray-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            {/* Sidebar */}
            <aside className="w-64 bg-codm-panel border-r border-white/5 flex flex-col hidden md:flex shrink-0">
                <div className="p-6 border-b border-white/5">
                    <span className="font-display font-bold text-2xl text-white tracking-wider">
                        ADMIN<span className="text-codm-yellow">PANEL</span>
                    </span>
                </div>
                <nav className="flex-1 py-4 space-y-1">
                    <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Visão Geral" />
                    <NavItem to="/admin/streamers" icon={Users} label="Streamers" />
                    <NavItem to="/admin/weapons" icon={Crosshair} label="Arsenal" />
                    <NavItem to="/admin/loadouts" icon={FileText} label="Loadouts" />
                </nav>
                <div className="p-4 border-t border-white/5">
                    <Link to="/" className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white hover:bg-white/5 transition-colors uppercase font-bold font-display text-lg tracking-wider mb-2">
                        <ChevronRight size={20} />
                        <span>Voltar ao Site</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 transition-colors uppercase font-bold font-display text-lg tracking-wider">
                        <span>Sair (Logout)</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

const ProtectedRoute = ({ children }: { children?: React.ReactElement }) => {
    const isAuth = db.isAuthenticated();
    if (!isAuth) return <Navigate to="/admin/login" replace />;
    return <AdminLayout>{children}</AdminLayout>;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/streamers" element={<PublicLayout><StreamerList /></PublicLayout>} />
                <Route path="/s/:slug" element={<PublicLayout><StreamerProfile /></PublicLayout>} />
                <Route path="/s/:slug/w/:weaponSlug" element={<PublicLayout><LoadoutDetail /></PublicLayout>} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/streamers" element={<ProtectedRoute><AdminStreamers /></ProtectedRoute>} />
                <Route path="/admin/weapons" element={<ProtectedRoute><AdminWeapons /></ProtectedRoute>} />
                <Route path="/admin/loadouts" element={<ProtectedRoute><AdminLoadouts /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App;