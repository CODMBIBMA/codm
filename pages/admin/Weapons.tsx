import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { storage } from '../../services/storage';
import { Weapon, WeaponVideo } from '../../types';
import { Edit2, Video, Plus, Trash2, Power, PlayCircle, Upload, Loader2, X, Search, Filter } from 'lucide-react';

const AdminWeapons = () => {
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingWeapon, setEditingWeapon] = useState<Weapon | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // State for creating new weapon
    const [newWeaponData, setNewWeaponData] = useState<Partial<Weapon>>({
        name: '', category: 'AR', imageUrl: '', isActive: true
    });

    // State for managing videos
    const [localVideos, setLocalVideos] = useState<WeaponVideo[]>([]);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [isVideoUploading, setIsVideoUploading] = useState(false);

    const refresh = () => db.getAllWeapons().then(setWeapons);
    useEffect(() => { refresh(); }, []);

    const filteredWeapons = weapons.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || w.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (w: Weapon) => {
        setEditingWeapon(w);
        setLocalVideos(w.videos ? [...w.videos] : []);
        setNewVideoUrl('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este armamento permanentemente?')) {
            await db.deleteWeapon(id);
            refresh();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCreate: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await storage.upload('weapons', file);
            if (isCreate) {
                setNewWeaponData(prev => ({ ...prev, imageUrl: url }));
            } else if (editingWeapon) {
                await db.updateWeapon(editingWeapon.id, { imageUrl: url });
                setEditingWeapon(prev => prev ? { ...prev, imageUrl: url } : null);
                refresh();
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            alert(`Erro no upload: ${err.message || 'Erro desconhecido'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsVideoUploading(true);
        try {
            const url = await storage.upload('weapons', file);
            const newVideo: WeaponVideo = {
                id: `v${Date.now()}`,
                url: url,
                isActive: true,
                createdAt: new Date().toISOString()
            };
            setLocalVideos(prev => [...prev, newVideo]);
        } catch (err: any) {
            console.error('Video upload error:', err);
            alert(`Erro no upload do vídeo: ${err.message || 'Verifique o tamanho do arquivo'}`);
        } finally {
            setIsVideoUploading(false);
        }
    };

    const handleAddVideoUrl = () => {
        if (!newVideoUrl.trim()) return;
        const newVideo: WeaponVideo = {
            id: `v${Date.now()}`,
            url: newVideoUrl,
            isActive: true,
            createdAt: new Date().toISOString()
        };
        setLocalVideos([...localVideos, newVideo]);
        setNewVideoUrl('');
    };

    const handleRemoveVideo = (videoId: string) => {
        setLocalVideos(localVideos.filter(v => v.id !== videoId));
    };

    const handleToggleStatus = (videoId: string) => {
        setLocalVideos(localVideos.map(v =>
            v.id === videoId ? { ...v, isActive: !v.isActive } : v
        ));
    };

    const handleSaveVideos = async () => {
        if (editingWeapon) {
            await db.updateWeapon(editingWeapon.id, { videos: localVideos });
            setIsModalOpen(false);
            refresh();
        }
    };

    const handleCreateWeapon = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.createWeapon({
            name: newWeaponData.name!,
            slug: newWeaponData.name!.toLowerCase().replace(/\s+/g, '-'),
            category: newWeaponData.category as any,
            imageUrl: newWeaponData.imageUrl || 'https://picsum.photos/400/200',
            isActive: true,
            videos: []
        });
        setIsCreateModalOpen(false);
        setNewWeaponData({ name: '', category: 'AR', imageUrl: '', isActive: true });
        refresh();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-codm-yellow skew-x-[-15deg]"></div>
                    <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Arsenal</h1>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-codm-yellow hover:bg-white text-black font-display font-bold text-xl px-6 py-2 uppercase tracking-wide skew-x-[-15deg] transition-all flex items-center gap-2"
                >
                    <span className="skew-x-[15deg] flex items-center gap-2"><Plus size={20} /> Forjar Arma</span>
                </button>
            </div>

            {/* Toolbar: Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar armamento..."
                        className="w-full bg-codm-panel border border-white/10 p-3 pl-10 text-white focus:border-codm-yellow outline-none uppercase font-bold text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        className="w-full bg-codm-panel border border-white/10 p-3 pl-10 text-white focus:border-codm-yellow outline-none font-bold text-sm appearance-none"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="ALL">TODAS AS CLASSES</option>
                        <option value="AR">Assault Rifle (AR)</option>
                        <option value="SMG">Submachine Gun (SMG)</option>
                        <option value="Sniper">Sniper Rifle</option>
                        <option value="LMG">Light Machine Gun (LMG)</option>
                        <option value="Shotgun">Shotgun</option>
                        <option value="Marksman">Marksman Rifle</option>
                        <option value="Pistol">Pistol</option>
                    </select>
                </div>
            </div>

            <div className="bg-codm-panel border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-codm-yellow font-display uppercase tracking-widest text-lg border-b border-white/10">
                        <tr>
                            <th className="p-4">Armamento</th>
                            <th className="p-4">Classe</th>
                            <th className="p-4">Galeria Tática</th>
                            <th className="p-4 text-right">Comandos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredWeapons.map(w => (
                            <tr key={w.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-4">
                                    <div className="w-24 h-12 bg-black/40 border border-white/10 flex items-center justify-center p-1 group-hover:border-codm-yellow transition-colors">
                                        <img src={w.imageUrl} className="max-w-full max-h-full object-contain" alt="" />
                                    </div>
                                    <span className="font-bold text-white font-display text-xl tracking-wide uppercase">{w.name}</span>
                                </td>
                                <td className="p-4">
                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest bg-white/5 px-2 py-1 border border-white/10">{w.category}</span>
                                </td>
                                <td className="p-4">
                                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${w.videos && w.videos.some(v => v.isActive) ? 'text-green-400' : 'text-gray-600'}`}>
                                        <Video size={14} />
                                        {w.videos ? `${w.videos.filter(v => v.isActive).length} ATIVOS / ${w.videos.length} TOTAL` : 'SEM MÍDIA'}
                                    </div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleEdit(w)} title="Configurar Mídia" className="text-gray-500 hover:text-codm-yellow p-2 transition-colors"><Video size={18} /></button>
                                    <button onClick={() => handleDelete(w.id)} title="Excluir" className="text-gray-500 hover:text-red-500 p-2 transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Criação */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-codm-panel w-full max-w-md border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-codm-yellow"></div>
                        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Novo Armamento</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
                        </div>
                        <form onSubmit={handleCreateWeapon} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-codm-yellow uppercase tracking-widest mb-1">Foto da Arma</label>
                                <div className="relative group h-32 bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {newWeaponData.imageUrl ? (
                                        <img src={newWeaponData.imageUrl} className="max-w-full max-h-full object-contain p-2" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto mb-2 text-gray-600 group-hover:text-codm-yellow transition-colors" />
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Upload PNG (Fundo Transparente)</span>
                                        </div>
                                    )}
                                    <input type="file" onChange={e => handleFileUpload(e, true)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    {isUploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-codm-yellow" /></div>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome</label>
                                <input className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-codm-yellow outline-none uppercase font-bold" value={newWeaponData.name} onChange={e => setNewWeaponData({ ...newWeaponData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Categoria</label>
                                <select className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-codm-yellow outline-none font-bold" value={newWeaponData.category} onChange={e => setNewWeaponData({ ...newWeaponData, category: e.target.value })}>
                                    <option value="AR">Assault Rifle (AR)</option>
                                    <option value="SMG">Submachine Gun (SMG)</option>
                                    <option value="Sniper">Sniper Rifle</option>
                                    <option value="LMG">Light Machine Gun (LMG)</option>
                                    <option value="Shotgun">Shotgun</option>
                                    <option value="Marksman">Marksman Rifle</option>
                                    <option value="Pistol">Pistol</option>
                                    <option value="Melee">Melee</option>
                                </select>
                            </div>
                            <button type="submit" disabled={isUploading} className="w-full bg-codm-yellow text-black font-bold py-3 uppercase tracking-widest hover:bg-white transition-colors">
                                Validar Armamento
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Mídia */}
            {isModalOpen && editingWeapon && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-codm-panel p-0 w-full max-w-5xl border border-white/10 shadow-2xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-codm-yellow via-transparent to-codm-yellow"></div>
                        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Configurar Mídia: <span className="text-codm-yellow">{editingWeapon.name}</span></h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-4 bg-black/40 border border-white/5 p-4 flex flex-col items-center justify-center relative group">
                                <img src={editingWeapon.imageUrl} alt="" className="w-full object-contain mb-4" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                    <Upload className="text-codm-yellow mb-2" />
                                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Alterar Imagem</span>
                                    <input type="file" onChange={e => handleFileUpload(e, false)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                {isUploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-codm-yellow" /></div>}
                                <div className="text-center mt-2">
                                    <h3 className="text-codm-yellow font-display text-xl uppercase">{editingWeapon.name}</h3>
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{editingWeapon.category}</span>
                                </div>
                            </div>
                            <div className="md:col-span-8 flex flex-col h-[550px]">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-black/20 p-4 border border-white/10">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-2">Upload de Vídeo Native</label>
                                        <div className="relative group h-12 bg-codm-yellow/10 border border-codm-yellow/30 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-codm-yellow/20 transition-colors">
                                            {isVideoUploading ? (
                                                <Loader2 className="animate-spin text-codm-yellow" />
                                            ) : (
                                                <span className="text-xs font-bold text-codm-yellow uppercase tracking-widest flex items-center gap-2">
                                                    <Upload size={14} /> Selecionar Arquivo
                                                </span>
                                            )}
                                            <input type="file" onChange={handleVideoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="video/mp4,video/webm" />
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-4 border border-white/10">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-2">Adicionar por Link (URL)</label>
                                        <div className="flex gap-2">
                                            <input className="flex-1 bg-codm-dark border border-white/10 p-2 text-white text-xs focus:border-codm-yellow outline-none" placeholder="Link MP4..." value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                                            <button onClick={handleAddVideoUrl} className="bg-codm-yellow px-4 font-bold uppercase text-[10px] text-black">ADD</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {localVideos.map((video, idx) => (
                                        <div key={video.id} className="flex items-center gap-4 bg-codm-panel border border-white/5 p-2 group hover:border-codm-yellow/20 transition-colors">
                                            <div className="w-32 h-20 bg-black relative border border-white/10 overflow-hidden shrink-0">
                                                <video src={video.url} className="w-full h-full object-cover opacity-60" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <PlayCircle size={24} className="text-white/50 group-hover:text-codm-yellow transition-colors" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-2 h-2 rounded-full ${video.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{video.isActive ? 'Ativo' : 'Inativo'}</span>
                                                </div>
                                                <p className="text-gray-400 text-[10px] truncate font-mono bg-black/20 p-1 border border-white/5">{video.url}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleToggleStatus(video.id)} title={video.isActive ? "Desativar" : "Ativar"} className={`p-2 border transition-colors ${video.isActive ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-gray-500 border-white/10'}`}><Power size={14} /></button>
                                                <button onClick={() => handleRemoveVideo(video.id)} title="Excluir vídeo" className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {localVideos.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/10">
                                            <Video size={48} className="mb-2 opacity-50" />
                                            <p className="font-display uppercase text-lg">Sem vídeos táticos registrados</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-black/20">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-400 hover:text-white uppercase font-bold text-sm tracking-widest">Voltar</button>
                            <button type="button" onClick={handleSaveVideos} disabled={isVideoUploading} className="bg-codm-yellow disabled:opacity-50 text-black font-bold px-8 py-2 uppercase tracking-wide skew-x-[-15deg] hover:bg-white transition-colors">
                                <span className="skew-x-[15deg]">Salvar Alterações</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWeapons;