import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Streamer, Weapon } from '../types';
import { Youtube, Twitch, Twitter, Instagram } from 'lucide-react';

const StreamerProfile = () => {
    const { slug } = useParams<{ slug: string }>();
    const [streamer, setStreamer] = useState<Streamer | null>(null);
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        const load = async () => {
            const s = await db.getStreamerBySlug(slug);
            if (s) {
                setStreamer(s);
                const w = await db.getWeaponsByStreamer(s.id);
                setWeapons(w);
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    if (loading) return <div className="p-12 text-center text-white font-mono">Carregando Perfil...</div>;
    if (!streamer) return <div className="p-12 text-center text-white font-mono">Streamer não encontrado</div>;

    const SocialIcon = ({ type, url }: { type: string, url?: string }) => {
        if (!url) return null;
        const icons: any = { youtube: Youtube, twitch: Twitch, twitter: Twitter, instagram: Instagram };
        const Icon = icons[type] || Youtube;
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-neon-blue hover:text-black transition-colors">
                <Icon size={18} />
            </a>
        );
    };

    return (
        <div className="min-h-screen bg-codm-dark">
            {/* Header / Banner Replacement */}
            <header className="relative h-[600px] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    {streamer.videoUrl ? (
                        <video
                            src={streamer.videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full opacity-40 grayscale"
                            style={{
                                objectFit: (streamer.videoScale || 1) < 1 ? 'contain' : 'cover',
                                objectPosition: `${streamer.videoPosX || 50}% ${streamer.videoPosY || 50}%`,
                                transform: `scale(${streamer.videoScale || 1})`
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-codm-panel to-codm-dark"></div>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-codm-dark via-transparent to-transparent"></div>

                <div className="relative z-10 text-center flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-codm-yellow/20 blur-xl"></div>
                        <img
                            src={streamer.avatarUrl}
                            alt={streamer.name}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-codm-yellow relative shadow-[0_0_30px_rgba(251,191,36,0.2)]"
                        />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tighter mb-4 shadow-black drop-shadow-lg">
                        {streamer.name}
                    </h1>

                    <div className="flex gap-4">
                        <SocialIcon type="twitch" url={streamer.platforms.twitch} />
                        <SocialIcon type="tiktok" url={streamer.platforms.tiktok} />
                        <SocialIcon type="instagram" url={streamer.platforms.instagram} />
                    </div>
                </div>

                {/* Floating "Visitar Canal" button in the corner */}
                {streamer.platforms.youtube && (
                    <div className="absolute top-8 right-8 z-20 hidden md:block">
                        <a
                            href={streamer.platforms.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-codm-yellow hover:bg-white text-black font-display font-bold text-xl px-8 py-3 uppercase tracking-wider skew-x-[-15deg] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                        >
                            <span className="skew-x-[15deg] flex items-center gap-2">
                                <Youtube size={20} /> Visitar Canal
                            </span>
                        </a>
                    </div>
                )}
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-gray-300 max-w-2xl text-lg mb-12">{streamer.bio}</p>

                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-neon-blue pl-4 uppercase tracking-wider">Loadouts de Armas</h2>

                {weapons.length === 0 ? (
                    <p className="text-gray-500 font-mono">Nenhum loadout publicado ainda.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {weapons.map(w => (
                            <Link key={w.id} to={`/s/${streamer.slug}/w/${w.slug}`} className="bg-gamer-900 rounded-xl overflow-hidden group hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all border border-white/5">
                                <div className="h-32 p-4 flex items-center justify-center bg-gamer-800/50">
                                    <img src={w.imageUrl} alt={w.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-neon-blue font-bold uppercase tracking-wider mb-1">{w.category}</div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-neon-blue">{w.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default StreamerProfile;