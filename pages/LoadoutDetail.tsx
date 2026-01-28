import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/db';
import { LoadoutWithDetails } from '../types';
import WeaponVisual from '../components/WeaponVisual';
import { Copy, Check, Info, Shield, Zap, Crosshair, ArrowLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { GUNSMITH_ATTACHMENTS, CATEGORY_BASE_STATS } from '../constants/gunsmith';
import { Attachment, WeaponStats } from '../types';

const LoadoutDetail = () => {
    const { slug, weaponSlug } = useParams<{ slug: string; weaponSlug: string }>();
    const [loadout, setLoadout] = useState<LoadoutWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!slug || !weaponSlug) return;
        db.getLoadout(slug, weaponSlug).then((data) => {
            setLoadout(data);
            setLoading(false);
        });
    }, [slug, weaponSlug]);

    const handleCopy = () => {
        if (!loadout) return;
        navigator.clipboard.writeText(loadout.code);
        db.incrementCopyCount(loadout.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- Dynamic Stats Calculation ---
    const statsResult = React.useMemo(() => {
        if (!loadout) return { current: null, diffs: null };
        const base = loadout.weapon.baseStats || CATEGORY_BASE_STATS[loadout.weapon.category] || CATEGORY_BASE_STATS['AR'];

        const current = { ...base };
        const activeAttachments = Object.values(loadout.attachments)
            .filter(Boolean)
            .map(name => GUNSMITH_ATTACHMENTS.find(a => a.name === name))
            .filter(Boolean) as Attachment[];

        activeAttachments.forEach(att => {
            Object.entries(att.modifiers).forEach(([key, val]) => {
                if (key in current) {
                    (current as any)[key] += val;
                }
            });
        });

        const diffs = {
            damage: current.damage - base.damage,
            accuracy: current.accuracy - base.accuracy,
            range: current.range - base.range,
            fireRate: current.fireRate - base.fireRate,
            mobility: current.mobility - base.mobility,
            control: current.control - base.control
        };

        return { current, diffs };
    }, [loadout]);

    if (loading) return <div className="h-screen flex items-center justify-center font-display text-2xl text-white uppercase tracking-widest animate-pulse">Carregando Gunsmith...</div>;
    if (!loadout) return <div className="h-screen flex items-center justify-center font-display text-2xl text-red-500 uppercase">Erro de Acesso</div>;

    // Componente de Slot estilo Gunsmith (Lista lateral)
    const GunsmithSlot = ({ label, value }: { label: string, value?: string }) => {
        const hasAttachment = !!value;
        const attData = hasAttachment ? GUNSMITH_ATTACHMENTS.find(a => a.name === value) : null;

        return (
            <div className="flex flex-col group mb-3">
                <div className="flex items-center">
                    {/* Linha de conexão */}
                    <div className={`w-4 h-[2px] mr-2 transition-colors ${hasAttachment ? 'bg-codm-yellow' : 'bg-gray-800'}`}></div>

                    <div className={`flex-1 p-2 border-l-2 transition-all relative overflow-hidden ${hasAttachment ? 'bg-white/5 border-codm-yellow' : 'bg-transparent border-gray-800 opacity-50'}`}>
                        {hasAttachment && <div className="absolute top-0 right-0 w-2 h-2 bg-codm-yellow"></div>}
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                            {hasAttachment && <div className="w-1.5 h-1.5 rounded-full bg-codm-yellow shadow-[0_0_5px_#fbbf24]"></div>}
                        </div>
                        <div className={`text-lg font-display font-bold uppercase tracking-wide truncate ${hasAttachment ? 'text-white' : 'text-gray-600'}`}>
                            {value || 'Nenhum'}
                        </div>
                    </div>
                </div>

                {/* Effects List */}
                {attData && (
                    <div className="ml-6 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        {attData.positiveEffects.map(e => (
                            <span key={e} className="text-[10px] text-green-500 font-bold uppercase flex items-center gap-1">
                                <TrendingUp size={10} /> {e}
                            </span>
                        ))}
                        {attData.negativeEffects.map(e => (
                            <span key={e} className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-1">
                                <TrendingDown size={10} /> {e}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const DetailStatBar = ({ label, value, diff }: { label: string, value: number, diff: number }) => (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold">{label}</span>
                <div className="flex items-center gap-1">
                    {diff !== 0 && (
                        <span className={`text-[9px] font-bold ${diff > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {diff > 0 ? `+${diff}` : diff}
                        </span>
                    )}
                    <span className="text-xs font-mono font-bold text-white tracking-tighter">{Math.round(value)}</span>
                </div>
            </div>
            <div className="w-full h-1 bg-gray-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-white transition-all duration-500" style={{ width: `${Math.min(value, 100)}%` }}></div>
                {diff > 0 && (
                    <div className="absolute top-0 h-full bg-green-500 transition-all duration-500"
                        style={{ left: `${value - diff}%`, width: `${diff}%` }}></div>
                )}
                {diff < 0 && (
                    <div className="absolute top-0 h-full bg-red-500 transition-all duration-500"
                        style={{ left: `${value}%`, width: `${Math.abs(diff)}%` }}></div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="text-gray-400" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-codm-yellow/50 overflow-hidden bg-black/50 p-0.5">
                            <img src={loadout.streamer.avatarUrl} alt={loadout.streamer.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase italic leading-none">{loadout.weapon.name}</h1>
                            <p className="text-codm-yellow text-sm font-bold uppercase tracking-[0.2em]">{loadout.weapon.category} // {loadout.streamer.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                {/* Left Column: Weapon Model & Stats (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Visual da Arma */}
                    <div className="relative border border-white/5 bg-gradient-to-b from-gray-900 to-black p-1 rounded-sm shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-codm-yellow/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

                        {/* Pass video object list from weapon data */}
                        <WeaponVisual
                            imageUrl={loadout.weapon.imageUrl}
                            name={loadout.weapon.name}
                            rarity="legendary"
                            videos={loadout.weapon.videos}
                        />

                        {/* Stats Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 z-20">
                            {statsResult.current && (
                                <>
                                    <DetailStatBar label="Dano" value={statsResult.current.damage} diff={statsResult.diffs!.damage} />
                                    <DetailStatBar label="Alcance" value={statsResult.current.range} diff={statsResult.diffs!.range} />
                                    <DetailStatBar label="Precisão" value={statsResult.current.accuracy} diff={statsResult.diffs!.accuracy} />
                                    <DetailStatBar label="Cadência" value={statsResult.current.fireRate} diff={statsResult.diffs!.fireRate} />
                                    <DetailStatBar label="Mobilidade" value={statsResult.current.mobility} diff={statsResult.diffs!.mobility} />
                                    <DetailStatBar label="Controle" value={statsResult.current.control} diff={statsResult.diffs!.control} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Bar (Code & Equip) */}
                    <div className="bg-codm-panel p-6 border border-white/10 flex flex-col md:flex-row items-stretch gap-4">
                        <div className="flex-1 bg-black/40 border border-white/5 p-3 flex flex-col justify-center">
                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Código de Compartilhamento</label>
                            <div className="font-mono text-xl text-codm-yellow tracking-wider select-all">
                                {loadout.code}
                            </div>
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`px-10 py-2 font-display font-bold text-3xl uppercase tracking-wider transition-all skew-x-[-10deg] flex items-center justify-center gap-3 shadow-lg hover:shadow-codm-yellow/20 ${copied ? 'bg-green-600 text-white' : 'bg-codm-yellow hover:bg-white text-black'}`}
                        >
                            <span className="skew-x-[10deg] flex items-center gap-2">
                                {copied ? <Check size={28} /> : null}
                                {copied ? 'Copiado' : 'Copiar'}
                            </span>
                        </button>
                    </div>

                    {/* Brief Note if exists */}
                    {loadout.notes && (
                        <div className="border-l-2 border-white/10 pl-4 py-1">
                            <p className="text-gray-400 font-sans text-sm italic">"{loadout.notes}"</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Gunsmith Slots (5 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    <div className="bg-codm-panel border border-white/5 p-6 flex-grow">
                        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Armeiro</h2>
                            <span className="text-codm-yellow text-xs font-bold uppercase border border-codm-yellow px-2 py-0.5 rounded-sm">
                                {Object.values(loadout.attachments).filter(v => !!v).length}/5 Slots
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            {loadout.attachments.muzzle && <GunsmithSlot label="Boca" value={loadout.attachments.muzzle} />}
                            {loadout.attachments.barrel && <GunsmithSlot label="Cano" value={loadout.attachments.barrel} />}
                            {loadout.attachments.optic && <GunsmithSlot label="Lente" value={loadout.attachments.optic} />}
                            {loadout.attachments.stock && <GunsmithSlot label="Coronha" value={loadout.attachments.stock} />}
                            {loadout.attachments.perk && <GunsmithSlot label="Vantagem" value={loadout.attachments.perk} />}
                            {loadout.attachments.laser && <GunsmithSlot label="Laser" value={loadout.attachments.laser} />}
                            {loadout.attachments.underbarrel && <GunsmithSlot label="Acoplamento" value={loadout.attachments.underbarrel} />}
                            {loadout.attachments.ammo && <GunsmithSlot label="Munição" value={loadout.attachments.ammo} />}
                            {loadout.attachments.rear_grip && <GunsmithSlot label="Cabo" value={loadout.attachments.rear_grip} />}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Mods de Arma (BR)</h3>
                            <div className="flex gap-2">
                                {[loadout.mods.one, loadout.mods.two, loadout.mods.three].map((modName, index) => {
                                    if (!modName) return null;

                                    // Map name to image file
                                    let imgName = modName.toLowerCase().replace(/\s+/g, '_');
                                    // Exception for Precise Shot/Shoot
                                    if (imgName === 'precise_shot') imgName = 'precise_shoot';

                                    const imgPath = `/mods/${imgName}.png`;
                                    const borderColors = [
                                        'border-blue-500/30 bg-blue-900/10',
                                        'border-purple-500/30 bg-purple-900/10',
                                        'border-orange-500/30 bg-orange-900/10'
                                    ];
                                    const iconColors = ['text-blue-500', 'text-purple-500', 'text-orange-500'];

                                    return (
                                        <div key={index} className={`flex-1 border p-2 text-center skew-x-[-5deg] ${borderColors[index]}`}>
                                            <div className="skew-x-[5deg]">
                                                <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center">
                                                    <img
                                                        src={imgPath}
                                                        alt={modName}
                                                        className="max-w-full max-h-full object-contain"
                                                        onError={(e) => {
                                                            // Fallback to Icon if image fails
                                                            (e.target as any).style.display = 'none';
                                                            (e.target as any).nextSibling.style.display = 'block';
                                                        }}
                                                    />
                                                    <div style={{ display: 'none' }}>
                                                        {index === 0 && <Shield size={16} className={iconColors[index]} />}
                                                        {index === 1 && <Zap size={16} className={iconColors[index]} />}
                                                        {index === 2 && <Crosshair size={16} className={iconColors[index]} />}
                                                    </div>
                                                </div>
                                                <span className="text-[9px] text-white font-bold uppercase block leading-tight truncate">{modName}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadoutDetail;