import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { LoadoutWithDetails, Streamer } from '../types';
import { ArrowRight, Crosshair, Users, Flame, ChevronRight } from 'lucide-react';

const Home = () => {
    const [trending, setTrending] = useState<LoadoutWithDetails[]>([]);
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [t, s] = await Promise.all([
                db.getTrendingLoadouts(),
                db.getFeaturedStreamers()
            ]);
            setTrending(t);
            setStreamers(s);
            setLoading(false);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center font-display text-4xl text-codm-yellow uppercase tracking-widest animate-pulse">Carregando Intel...</div>;

    return (
        <div className="pb-12">
            {/* Hero Section - Estilo Banner de Evento */}
            <section className="relative h-[550px] flex items-center justify-start overflow-hidden border-b border-codm-yellow/30">
                <div className="absolute inset-0 bg-codm-dark/80 z-10"></div>
                <div className="absolute inset-0 z-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-50"></div>

                <div className="relative z-20 px-4 max-w-7xl mx-auto w-full">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-codm-yellow text-black text-xs font-bold px-2 py-1 uppercase tracking-wider skew-x-[-10deg]">
                                <span className="skew-x-[10deg]">Meta Oficial</span>
                            </div>
                            <span className="text-codm-yellow text-xs uppercase tracking-widest font-bold">Mestre de Armas</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4 uppercase tracking-tighter leading-[0.9] drop-shadow-lg">
                            Domine o <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-codm-yellow to-yellow-600">Campo de Batalha</span>
                        </h1>

                        <p className="text-gray-300 text-lg md:text-xl font-sans uppercase tracking-wide max-w-xl mb-8 border-l-4 border-codm-yellow pl-4">
                            Copie loadouts profissionais. Suba de rank. Seja lendário.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/streamers" className="group relative px-8 py-4 bg-codm-yellow hover:bg-white transition-colors skew-x-[-15deg] inline-flex items-center justify-center">
                                <span className="skew-x-[15deg] font-display font-bold text-2xl text-black uppercase tracking-wider flex items-center gap-2">
                                    <Crosshair size={24} /> Iniciar
                                </span>
                            </Link>

                            <a
                                href="#meta"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('meta')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group relative px-8 py-4 bg-transparent border-2 border-white/20 hover:border-codm-yellow transition-colors skew-x-[-15deg] inline-flex items-center justify-center cursor-pointer"
                            >
                                <span className="skew-x-[15deg] font-display font-bold text-2xl text-white group-hover:text-codm-yellow uppercase tracking-wider flex items-center gap-2">
                                    Ver Meta
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Section - Estilo Gunsmith */}
            <section id="meta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-2">
                    <h2 className="text-5xl font-display font-bold text-white uppercase italic tracking-wide">
                        Loadouts <span className="text-codm-yellow">Em Alta</span>
                    </h2>
                    <div className="hidden md:flex items-center gap-2 text-codm-yellow font-bold uppercase text-sm tracking-widest pb-2">
                        <Flame size={16} /> Mais Copiados
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trending.map((loadout, idx) => (
                        <Link key={loadout.id} to={`/s/${loadout.streamer.slug}/w/${loadout.weapon.slug}`} className="group relative block">
                            {/* Card Background Style */}
                            <div className="codm-panel h-full relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                                {/* Rarity Stripe */}
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${idx === 0 ? 'from-yellow-500 to-yellow-700' : 'from-purple-500 to-purple-700'}`}></div>

                                <div className="p-1">
                                    {/* Image Container */}
                                    <div className="relative h-48 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center overflow-hidden border-b border-white/5">
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                        <img src={loadout.weapon.imageUrl} alt={loadout.weapon.name} className="w-4/5 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" />

                                        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 border border-white/10 skew-x-[-10deg]">
                                            <span className="text-codm-yellow text-xs font-bold uppercase tracking-wider skew-x-[10deg]">
                                                {loadout.stats.views} Views
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 pl-6">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-3xl font-display font-bold text-white uppercase leading-none group-hover:text-codm-yellow transition-colors">{loadout.weapon.name}</h3>
                                            <div className="bg-white/10 px-1.5 py-0.5 rounded-sm">
                                                <span className="text-[10px] text-gray-300 font-bold uppercase">{loadout.weapon.category}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4 opacity-80">
                                            <img src={loadout.streamer.avatarUrl} className="w-4 h-4 rounded-full" />
                                            <span className="text-sm font-bold text-codm-gray uppercase tracking-wide">{loadout.streamer.name}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{loadout.patchVersion}</span>
                                            <ChevronRight className="text-codm-yellow group-hover:translate-x-1 transition-transform" size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Streamers Strip */}
            <section className="bg-codm-panel border-y border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-2 bg-codm-yellow skew-x-[-20deg]"></div>
                        <h2 className="text-4xl font-display font-bold text-white uppercase tracking-wider">STREAMERS</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {streamers.map(streamer => (
                            <Link key={streamer.id} to={`/s/${streamer.slug}`} className="group relative block bg-black/40 border border-white/5 hover:border-codm-yellow/50 transition-all p-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 shrink-0">
                                        <img src={streamer.avatarUrl} alt={streamer.name} className="w-full h-full object-cover border-2 border-gray-700 group-hover:border-codm-yellow transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-display font-bold text-white uppercase leading-none group-hover:text-codm-yellow">{streamer.name}</h3>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{streamer.tags[0]}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <SupportSection />
        </div>
    );
};

const SupportSection = () => {
    const [pixQr, setPixQr] = useState<string | null>(null);

    useEffect(() => {
        db.getSetting<string>('pix_qr_code').then(setPixQr);
    }, []);

    if (!pixQr) return null;

    return (
        <section className="bg-black/40 py-8 border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                        <div className="w-6 h-1 bg-codm-yellow"></div>
                        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider italic">Apoie o <span className="text-codm-yellow">Projeto</span></h2>
                    </div>
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-4 max-w-xl">
                        Contribua para mantermos os servidores ativos e novos arsenais atualizados.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">
                            <span className="text-[10px] text-green-400 font-display font-bold uppercase">Online & Operational</span>
                        </div>
                    </div>
                </div>

                <div className="relative group shrink-0">
                    {/* Pulsing Glow behind QR */}
                    <div className="absolute inset-0 bg-codm-yellow/30 blur-xl group-hover:bg-codm-yellow/50 transition-all animate-pulse"></div>

                    <div className="relative bg-codm-panel border border-codm-yellow/50 p-3 skew-x-[-1deg] shadow-[0_0_15px_rgba(251,191,36,0.2)] group-hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all">
                        <p className="text-center text-[9px] text-codm-yellow font-bold uppercase mb-2 tracking-widest opacity-80">PIX INSTANTÂNEO</p>
                        <div className="w-32 h-32 bg-white p-1 rounded-sm transition-transform group-hover:scale-105 duration-300">
                            <img src={pixQr} alt="Pix QR Code" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;