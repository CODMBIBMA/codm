import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Users, Crosshair, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        db.getAdminStats().then(s => {
            setStats(s);
            if (s.weaponViews) {
                setChartData(s.weaponViews);
            }
        });
    }, []);

    if (!stats) return <div className="text-codm-yellow font-display text-2xl animate-pulse">Iniciando Sistema...</div>;

    const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }: any) => (
        <div className="relative group bg-codm-panel border border-white/5 p-6 overflow-hidden hover:border-codm-yellow/50 transition-colors">
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/10 group-hover:border-codm-yellow transition-colors"></div>

            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">{title}</h3>
                    <p className={`text-3xl font-display font-bold ${colorClass} tracking-tight leading-none mb-1`}>{value}</p>
                    {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[150px]">{subtitle}</p>}
                </div>
                <div className="p-3 bg-white/5 rounded-sm">
                    <Icon size={20} className={colorClass} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-codm-yellow skew-x-[-15deg]"></div>
                    <h1 className="text-4xl font-display font-bold text-white uppercase tracking-wider">Centro de Comando</h1>
                </div>

                <div className="bg-white/5 px-4 py-2 border border-white/10 max-w-xs">
                    <p className="text-[9px] text-codm-yellow font-bold uppercase mb-1">O que é Intel?</p>
                    <p className="text-[10px] text-gray-400 leading-tight">Inteligência tática coletada de engajamento do usuário, visualizações e compartilhamento de metadados.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Projetos Ativos" value={stats.totalLoadouts} icon={FileText} colorClass="text-blue-400" />
                <StatCard title="Total de Intel" value={stats.totalViews.toLocaleString()} icon={Activity} colorClass="text-codm-yellow" subtitle="Acessos Totais" />
                <StatCard title="Top Operador" value={stats.topStreamer} icon={Users} colorClass="text-white" subtitle="Mais Visualizado" />
                <StatCard title="Meta Atual" value={stats.topWeapon} icon={Crosshair} colorClass="text-green-400" subtitle="Arma Mais Vista" />
            </div>

            <div className="bg-codm-panel border border-white/5 p-6 md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide">Relatório de Combate (Top Armas)</h3>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 bg-blue-500 rounded-sm inline-block"></span> <span className="text-xs text-gray-500 font-bold uppercase mr-4">Visualizações</span>
                    </div>
                </div>
                <div className="h-80 w-full text-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0b0f15', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                                itemStyle={{ color: '#fff', fontFamily: 'Rajdhani', fontWeight: 'bold', textTransform: 'uppercase' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="views" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Global Settings Section */}
            <div className="bg-codm-panel border border-white/5 p-6 relative">
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/10"></div>
                <h3 className="text-xl font-display font-bold text-codm-yellow uppercase tracking-widest mb-6 border-l-4 border-codm-yellow pl-4">Configurações de Apoio</h3>

                <PixSettings />
            </div>
        </div>
    );
};

const PixSettings = () => {
    const [pixQr, setPixQr] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        db.getSetting<string>('pix_qr_code').then(val => {
            if (val) setPixQr(val);
        });
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const { storage } = await import('../../services/storage');
            const url = await storage.upload('avatars', file);
            setPixQr(url);
        } catch (err) {
            alert('Erro no upload');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await db.updateSetting('pix_qr_code', pixQr);
            alert('Salvo com sucesso!');
        } catch (err) {
            alert('Erro ao salvar');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">QR Code Pix (Imagem)</label>
                <div className="flex gap-4 items-start">
                    <div className="w-40 h-40 bg-black/40 border border-white/10 flex items-center justify-center p-2 relative">
                        {pixQr ? (
                            <img src={pixQr} className="max-w-full max-h-full object-contain" alt="Pix QR Code" />
                        ) : (
                            <div className="text-center text-gray-700">
                                <Activity size={32} className="mx-auto mb-2 opacity-50" />
                                <span className="text-[9px] uppercase font-bold tracking-tighter">Nenhum QR Configurado</span>
                            </div>
                        )}
                        {isUploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-codm-yellow text-[10px] font-bold uppercase">Enviando...</div>}
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="relative group overflow-hidden">
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                            <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-2 px-4 uppercase text-xs tracking-widest hover:bg-white/10 transition-colors">
                                Selecionar Imagem
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[9px] font-bold text-gray-600 uppercase">Ou cole a URL</label>
                            <input
                                value={pixQr}
                                onChange={e => setPixQr(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 p-2 text-white text-[10px] focus:outline-none focus:border-codm-yellow"
                                placeholder="https://..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-codm-yellow text-black font-display font-bold py-3 uppercase tracking-widest skew-x-[-15deg] hover:bg-white transition-colors disabled:opacity-50"
                        >
                            <span className="skew-x-[15deg] block">Salvar Configurações</span>
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-gray-500 italic border-l-2 border-white/10 pl-2">
                Este QR Code será exibido na página inicial sob o título "Apoie o Projeto".
            </p>
        </div>
    );
};

export default AdminDashboard;