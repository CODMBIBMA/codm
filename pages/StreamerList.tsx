import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { db } from '../services/db';
import { Streamer } from '../types';
import { Search, Radio } from 'lucide-react';

const StreamerList = () => {
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';

    useEffect(() => {
        db.getAllStreamers().then((data) => {
            setStreamers(data);
            setLoading(false);
        });
    }, []);

    const filteredStreamers = streamers.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.tags.some(t => t.toLowerCase().includes(query))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-4 gap-4">
                <div>
                    <h1 className="text-5xl font-display font-bold text-white uppercase tracking-tighter">
                        Selecione o <span className="text-codm-yellow">Streamer</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
                        <Radio size={14} className="text-green-500 animate-pulse" />
                        Conexão do Lobby: Estável
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full h-64 flex items-center justify-center font-display text-2xl text-codm-yellow uppercase animate-pulse">Escaneando...</div>
                ) : filteredStreamers.length > 0 ? (
                    filteredStreamers.map(s => (
                        <Link key={s.id} to={`/s/${s.slug}`} className="group relative block bg-codm-panel border border-white/5 hover:border-codm-yellow transition-all duration-300">
                            {/* Card Body */}
                            <div className="p-4 flex gap-4">
                                {/* Avatar Box with Video Loop support */}
                                <div className="relative shrink-0 w-24 h-24 bg-black border border-white/10 overflow-hidden">
                                    {s.videoUrl ? (
                                        <video
                                            src={s.videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <img
                                            src={s.avatarUrl}
                                            alt={s.name}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3 className="text-3xl font-display font-bold text-white uppercase leading-none tracking-wide group-hover:text-codm-yellow truncate transition-colors">{s.name}</h3>
                                    <div className="flex flex-wrap gap-1 mb-2 mt-1">
                                        {s.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-1 uppercase">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-500 text-xs font-sans uppercase truncate">
                                        Status: Em Missão
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20 group-hover:border-codm-yellow transition-colors"></div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full border border-dashed border-white/20 p-12 text-center">
                        <p className="text-gray-500 font-display text-xl uppercase">Nenhum operador encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StreamerList;