import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { storage } from '../../services/storage';
import { Streamer, LoadoutWithDetails } from '../../types';
import { Trash2, Edit2, Plus, X, Upload, Loader2, PlayCircle, FileText, ExternalLink, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminStreamers = () => {
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingLoadoutsFor, setViewingLoadoutsFor] = useState<Streamer | null>(null);
    const [streamerLoadouts, setStreamerLoadouts] = useState<LoadoutWithDetails[]>([]);
    const [formData, setFormData] = useState<Partial<Streamer>>({
        name: '', slug: '', bio: '', tags: [], videoUrl: '', avatarUrl: '', videoVerticalPos: 50
    });

    const refresh = () => db.getAllStreamers().then(setStreamers);
    useEffect(() => { refresh(); }, []);

    useEffect(() => {
        if (viewingLoadoutsFor) {
            db.getLoadoutsByStreamer(viewingLoadoutsFor.id).then(setStreamerLoadouts);
        }
    }, [viewingLoadoutsFor]);

    const handleDeleteLoadout = async (id: string) => {
        if (window.confirm('Excluir este projeto permanentemente?')) {
            await db.deleteLoadout(id);
            if (viewingLoadoutsFor) {
                db.getLoadoutsByStreamer(viewingLoadoutsFor.id).then(setStreamerLoadouts);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Confirmar eliminação do operador?')) {
            await db.deleteStreamer(id);
            refresh();
        }
    };

    const handleEdit = (streamer: Streamer) => {
        setEditingId(streamer.id);
        setFormData({
            name: streamer.name,
            slug: streamer.slug,
            bio: streamer.bio,
            avatarUrl: streamer.avatarUrl,
            videoUrl: streamer.videoUrl || '',
            videoPosX: streamer.videoPosX || 50,
            videoPosY: streamer.videoPosY || 50,
            videoScale: streamer.videoScale || 1,
            tags: streamer.tags || [],
            platforms: streamer.platforms || {},
            isActive: streamer.isActive
        });
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'videoUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isVideo = field === 'videoUrl';
        if (isVideo) setIsVideoUploading(true);
        else setIsUploading(true);

        try {
            const url = await storage.upload('avatars', file);
            setFormData(prev => ({ ...prev, [field]: url }));
        } catch (err: any) {
            console.error('Upload error:', err);
            alert(`Erro ao fazer upload: ${err.message || 'Erro desconhecido'}`);
        } finally {
            if (isVideo) setIsVideoUploading(false);
            else setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: formData.name!,
            slug: formData.slug || formData.name!.toLowerCase().replace(/\s+/g, '-'),
            bio: formData.bio || '',
            avatarUrl: formData.avatarUrl || 'https://picsum.photos/200',
            videoUrl: formData.videoUrl || '',
            videoPosX: formData.videoPosX || 50,
            videoPosY: formData.videoPosY || 50,
            videoScale: formData.videoScale || 1,
            tags: formData.tags || [],
            platforms: formData.platforms || {},
            isActive: formData.isActive !== undefined ? formData.isActive : true
        };

        if (editingId) {
            await db.updateStreamer(editingId, data);
        } else {
            await db.createStreamer(data);
        }

        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', slug: '', bio: '', tags: [], videoUrl: '', avatarUrl: '', videoPosX: 50, videoPosY: 50, videoScale: 1 });
        refresh();
    };

    const openNewModal = () => {
        setEditingId(null);
        setFormData({ name: '', slug: '', bio: '', tags: [], videoUrl: '', avatarUrl: '' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-codm-yellow skew-x-[-15deg]"></div>
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Gestão de Streamers</h2>
                </div>
                <button
                    onClick={openNewModal}
                    className="bg-codm-yellow hover:bg-white text-black font-display font-bold text-xl px-6 py-2 uppercase tracking-wide skew-x-[-15deg] transition-all flex items-center gap-2"
                >
                    <span className="skew-x-[15deg] flex items-center gap-2"><Plus size={20} /> Novo Streamer</span>
                </button>
            </div>

            <div className="bg-codm-panel border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-codm-yellow font-display uppercase tracking-widest text-lg border-b border-white/10">
                        <tr>
                            <th className="p-4">Identidade</th>
                            <th className="p-4">Codinome (Slug)</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Comandos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {streamers.map(s => (
                            <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-sm overflow-hidden border border-white/20 group-hover:border-codm-yellow transition-colors bg-gray-900">
                                        <img src={s.avatarUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <span className="font-bold text-white font-display text-xl tracking-wide uppercase">{s.name}</span>
                                </td>
                                <td className="p-4 text-gray-400 font-mono text-sm uppercase">{s.slug}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-widest border ${s.isActive ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'}`}>
                                        {s.isActive ? 'Em Campo' : 'K.I.A.'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-4">
                                    <button onClick={() => setViewingLoadoutsFor(s)} className="text-gray-500 hover:text-blue-400 transition-colors title='Ver Projetos'"><FileText size={18} /></button>
                                    <button onClick={() => handleEdit(s)} className="text-gray-500 hover:text-codm-yellow transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(s.id)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Gamer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-codm-panel p-0 w-full max-w-lg border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-y-auto max-h-[90vh]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-codm-yellow via-transparent to-codm-yellow"></div>

                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">{editingId ? 'Editar Registro' : 'Novo Registro'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="flex flex-col items-center mb-4">
                                <label className="block text-xs font-bold text-codm-yellow uppercase tracking-widest mb-2">Avatar do Operador</label>
                                <div className="relative group cursor-pointer w-32 h-32 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden bg-black/50 hover:border-codm-yellow transition-all">
                                    {formData.avatarUrl ? (
                                        <img src={formData.avatarUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto text-gray-600 group-hover:text-codm-yellow transition-colors" />
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mt-1 px-2">PNG / JPG</span>
                                        </div>
                                    )}
                                    <input type="file" onChange={e => handleFileUpload(e, 'avatarUrl')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    {(isUploading && !isVideoUploading) && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-codm-yellow" /></div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-codm-yellow uppercase tracking-widest mb-1">Vídeo de Fundo (Upload)</label>
                                <div className="relative group h-12 bg-codm-yellow/10 border border-codm-yellow/30 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-codm-yellow/20 transition-colors">
                                    {isVideoUploading ? (
                                        <Loader2 className="animate-spin text-codm-yellow" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {formData.videoUrl ? (
                                                <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <PlayCircle size={14} /> Vídeo Carregado
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-codm-yellow font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <Upload size={14} /> Selecionar MP4
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <input type="file" onChange={e => handleFileUpload(e, 'videoUrl')} className="absolute inset-0 opacity-0 cursor-pointer" accept="video/mp4,video/webm" />
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 border border-white/5 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Link Externo do Vídeo (Opcional)</label>
                                    <input
                                        className="w-full bg-codm-dark border border-white/10 p-2 text-white font-mono text-sm focus:border-codm-yellow focus:outline-none transition-colors"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                {formData.videoUrl && (
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-black/40 p-3 border border-white/5">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
                                                Horizontal (X) <span>{formData.videoPosX}%</span>
                                            </label>
                                            <input
                                                type="range" min="0" max="100"
                                                value={formData.videoPosX}
                                                onChange={e => setFormData({ ...formData, videoPosX: parseInt(e.target.value) })}
                                                className="w-full accent-codm-yellow cursor-pointer h-1.5"
                                            />
                                            <div className="flex justify-between text-[8px] text-gray-600 mt-1 uppercase font-bold">
                                                <span>Esq</span><span>Centro</span><span>Dir</span>
                                            </div>
                                        </div>
                                        <div className="bg-black/40 p-3 border border-white/5">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
                                                Vertical (Y) <span>{formData.videoPosY}%</span>
                                            </label>
                                            <input
                                                type="range" min="0" max="100"
                                                value={formData.videoPosY}
                                                onChange={e => setFormData({ ...formData, videoPosY: parseInt(e.target.value) })}
                                                className="w-full accent-codm-yellow cursor-pointer h-1.5"
                                            />
                                            <div className="flex justify-between text-[8px] text-gray-600 mt-1 uppercase font-bold">
                                                <span>Topo</span><span>Centro</span><span>Base</span>
                                            </div>
                                        </div>
                                        <div className="bg-black/40 p-3 border border-white/5 col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
                                                Zoom / Escala (Distância) <span>{Math.round(formData.videoScale! * 100)}%</span>
                                            </label>
                                            <input
                                                type="range" min="0.5" max="2.0" step="0.1"
                                                value={formData.videoScale}
                                                onChange={e => setFormData({ ...formData, videoScale: parseFloat(e.target.value) })}
                                                className="w-full accent-codm-yellow cursor-pointer h-1.5"
                                            />
                                            <div className="flex justify-between text-[8px] text-gray-600 mt-1 uppercase font-bold">
                                                <span>Longe</span><span>Normal</span><span>Perto</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-codm-yellow uppercase tracking-widest mb-1">Nome do Operador</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white font-bold focus:border-codm-yellow focus:outline-none transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Ex: iFerg"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Briefing da Missão (Bio)</label>
                                <textarea rows={3} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-codm-yellow focus:outline-none transition-colors" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                            </div>

                            <div className="bg-black/30 p-4 border border-white/5">
                                <label className="block text-xs font-bold text-codm-yellow uppercase tracking-widest mb-2">Redes Sociais</label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">YouTube URL</label>
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-codm-yellow focus:outline-none transition-colors"
                                            value={formData.platforms?.youtube || ''}
                                            onChange={e => setFormData({ ...formData, platforms: { ...formData.platforms, youtube: e.target.value } })}
                                            placeholder="https://youtube.com/@..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Twitch URL</label>
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-codm-yellow focus:outline-none transition-colors"
                                            value={formData.platforms?.twitch || ''}
                                            onChange={e => setFormData({ ...formData, platforms: { ...formData.platforms, twitch: e.target.value } })}
                                            placeholder="https://twitch.tv/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-400 hover:text-white uppercase font-bold tracking-wider text-sm">Cancelar</button>
                                <button type="submit" disabled={isUploading || isVideoUploading} className="bg-codm-yellow disabled:opacity-50 text-black font-bold px-8 py-2 uppercase tracking-wide skew-x-[-15deg] hover:bg-white transition-colors">
                                    <span className="skew-x-[15deg]">Salvar Dados</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Loadouts Viewing Modal */}
            {viewingLoadoutsFor && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-codm-panel w-full max-w-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border border-codm-yellow/30 overflow-hidden">
                                    <img src={viewingLoadoutsFor.avatarUrl} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider leading-none">{viewingLoadoutsFor.name}</h2>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Arsenal Designado</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingLoadoutsFor(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {streamerLoadouts.length > 0 ? (
                                <div className="space-y-3">
                                    {streamerLoadouts.map(l => (
                                        <div key={l.id} className="bg-black/40 border border-white/5 p-4 flex items-center justify-between hover:border-blue-500/30 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-900 border border-white/10 flex items-center justify-center">
                                                    <Crosshair size={20} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-display font-bold text-white uppercase leading-none">{l.weapon.name}</h3>
                                                    <p className="text-[10px] text-gray-500 font-mono mt-1">{l.code}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to="/admin/loadouts"
                                                    className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-sm"
                                                    title="Editar no Gerenciador"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteLoadout(l.id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-white/5 rounded-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-white/5">
                                    <FileText size={48} className="mx-auto text-gray-800 mb-4" />
                                    <p className="text-gray-500 font-display text-xl uppercase tracking-widest">Nenhum Projeto Ativo</p>
                                    <Link to="/admin/loadouts" className="text-codm-yellow text-xs font-bold uppercase mt-2 inline-block hover:underline">Ir para Arsenal para criar</Link>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white/5 border-t border-white/5 text-right">
                            <button onClick={() => setViewingLoadoutsFor(null)} className="bg-white/5 border border-white/10 px-6 py-2 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10">Fechar Arquivo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStreamers;