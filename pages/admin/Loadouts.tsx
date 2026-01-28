import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { LoadoutWithDetails, Streamer, Weapon, Loadout } from '../../types';
import { Plus, Trash2, Crosshair, Save, X, Edit2 } from 'lucide-react';
import { GUNSMITH_ATTACHMENTS, GUNSMITH_MODS } from '../../constants/gunsmith';

const SelectInput = ({ label, val, onChange, options, isMod }: { label: string, val: string, onChange: (v: string) => void, options: string[], isMod?: boolean }) => {
    let imgPath = '';
    if (isMod && val) {
        let name = val.toLowerCase().replace(/\s+/g, '_');
        if (name === 'precise_shot') name = 'precise_shoot';
        imgPath = `/mods/${name}.png`;
    }

    return (
        <div className="bg-black/30 p-2 border border-white/10 group hover:border-codm-yellow/30 transition-colors">
            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1 group-hover:text-codm-yellow transition-colors flex justify-between">
                {label}
                {isMod && val && <img src={imgPath} alt="" className="h-4 w-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity" onError={e => (e.target as any).style.display = 'none'} />}
            </label>
            <select
                className="w-full bg-transparent text-white font-display text-lg uppercase focus:outline-none appearance-none cursor-pointer"
                value={val}
                onChange={e => onChange(e.target.value)}
            >
                <option value="" className="bg-codm-panel text-gray-500">Nenhum</option>
                {options.map(opt => (
                    <option key={opt} value={opt} className="bg-codm-panel text-white">{opt}</option>
                ))}
            </select>
        </div>
    );
};

const AdminLoadouts = () => {
    const [loadouts, setLoadouts] = useState<LoadoutWithDetails[]>([]);
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Quick Form State
    const [form, setForm] = useState({
        streamerId: '',
        weaponId: '',
        code: '',
        notes: '',
        muzzle: '', barrel: '', optic: '', stock: '', perk: '', laser: '', underbarrel: '', ammo: '', rear_grip: '',
        mod1: '', mod2: '', mod3: '',
        lethal: '', tactical: ''
    });

    const refresh = async () => {
        const [l, s, w] = await Promise.all([
            db.getAllLoadouts(),
            db.getAllStreamers(),
            db.getAllWeapons()
        ]);
        setLoadouts(l);
        setStreamers(s);
        setWeapons(w);
    };

    useEffect(() => { refresh(); }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Deletar projeto permanentemente?')) {
            await db.deleteLoadout(id);
            refresh();
        }
    };

    const handleEdit = (loadout: LoadoutWithDetails) => {
        setEditingId(loadout.id);
        setForm({
            streamerId: loadout.streamerId,
            weaponId: loadout.weaponId,
            code: loadout.code,
            notes: loadout.notes,
            muzzle: loadout.attachments.muzzle || '',
            barrel: loadout.attachments.barrel || '',
            optic: loadout.attachments.optic || '',
            stock: loadout.attachments.stock || '',
            perk: loadout.attachments.perk || '',
            laser: loadout.attachments.laser || '',
            underbarrel: loadout.attachments.underbarrel || '',
            ammo: loadout.attachments.ammo || '',
            rear_grip: loadout.attachments.rear_grip || '',
            mod1: loadout.mods.one || '',
            mod2: loadout.mods.two || '',
            mod3: loadout.mods.three || '',
            lethal: loadout.equipment.lethal || '',
            tactical: loadout.equipment.tactical || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.streamerId || !form.weaponId) return alert('Selecione Streamer e Arma');

        const attachments = {
            muzzle: form.muzzle, barrel: form.barrel, optic: form.optic, stock: form.stock,
            perk: form.perk, laser: form.laser, underbarrel: form.underbarrel,
            ammo: form.ammo, rear_grip: form.rear_grip
        };

        const activeCount = Object.values(attachments).filter(v => !!v).length;
        if (activeCount > 5) {
            return alert(`Um loadout de Armeiro pode ter no máximo 5 acessórios. (Atual: ${activeCount}/5)`);
        }

        const loadoutData = {
            streamerId: form.streamerId,
            weaponId: form.weaponId,
            code: form.code || `${form.streamerId}-${form.weaponId}-${Date.now().toString().slice(-4)}`,
            notes: form.notes,
            attachments,
            mods: { one: form.mod1, two: form.mod2, three: form.mod3 },
            equipment: { lethal: form.lethal, tactical: form.tactical }
        };

        if (editingId) {
            await db.updateLoadout(editingId, loadoutData as any);
        } else {
            await db.createLoadout(loadoutData as any);
        }

        setIsModalOpen(false);
        setEditingId(null);
        refresh();
        setForm({ ...form, weaponId: '', code: '', notes: '', muzzle: '', barrel: '', optic: '', stock: '', perk: '', laser: '', underbarrel: '', ammo: '', rear_grip: '', mod1: '', mod2: '', mod3: '' });
    };

    const updateField = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const openNewModal = () => {
        setEditingId(null);
        setForm({
            ...form,
            streamerId: '', weaponId: '', code: '', notes: '', muzzle: '', barrel: '', optic: '', stock: '', perk: '', laser: '', underbarrel: '', ammo: '', rear_grip: '', mod1: '', mod2: '', mod3: ''
        });
        setIsModalOpen(true);
    };

    const selectedWeapon = weapons.find(w => w.id === form.weaponId);
    const availableMods = GUNSMITH_MODS.filter(m =>
        m.categories.length === 0 || (selectedWeapon && m.categories.includes(selectedWeapon.category))
    ).map(m => m.name);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-codm-yellow skew-x-[-15deg]"></div>
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Gestão de Loadouts</h2>
                </div>
                <button
                    onClick={openNewModal}
                    className="bg-codm-yellow hover:bg-white text-black font-display font-bold text-xl px-6 py-2 uppercase tracking-wide skew-x-[-15deg] transition-all flex items-center gap-2"
                >
                    <span className="skew-x-[15deg] flex items-center gap-2"><Plus size={20} /> Novo Loadout</span>
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loadouts.map(l => (
                    <div key={l.id} className="group bg-codm-panel border border-white/5 hover:border-codm-yellow/50 transition-all p-4 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-white uppercase leading-none">{l.weapon.name}</h3>
                                <p className="text-codm-yellow text-xs font-bold uppercase tracking-wider">{l.streamer.name}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-gray-500 uppercase block">Views</span>
                                <span className="text-white font-mono font-bold">{l.stats.views}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-xs text-gray-400 font-mono mb-4 bg-black/20 p-2 border-l-2 border-codm-yellow/30">
                            <div className="truncate">{l.code}</div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-white/5 gap-2">
                            <button onClick={() => handleEdit(l)} className="text-gray-500 hover:text-codm-yellow p-2 transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(l.id)} className="text-gray-500 hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAST CREATE/EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-codm-panel w-full max-w-5xl border border-white/10 shadow-2xl relative">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Crosshair /> {editingId ? 'Editar Projeto' : 'Construir Loadout'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* Coluna Esquerda: Meta Info */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="bg-black/40 p-4 border border-white/5">
                                    <label className="text-xs text-codm-yellow uppercase font-bold mb-2 block">Dados do Operador</label>
                                    <select
                                        className="w-full bg-codm-dark border border-white/10 text-white p-2 mb-3 focus:border-codm-yellow outline-none uppercase font-bold"
                                        value={form.streamerId}
                                        onChange={e => updateField('streamerId', e.target.value)}
                                    >
                                        <option value="">Selecione Streamer</option>
                                        {streamers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <select
                                        className="w-full bg-codm-dark border border-white/10 text-white p-2 focus:border-codm-yellow outline-none uppercase font-bold"
                                        value={form.weaponId}
                                        onChange={e => updateField('weaponId', e.target.value)}
                                    >
                                        <option value="">Selecione Arma</option>
                                        {weapons.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                </div>

                                <div className="bg-black/40 p-4 border border-white/5">
                                    <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Metadados</label>
                                    <input className="w-full bg-codm-dark border border-white/10 p-2 text-white text-sm mb-2 font-mono" placeholder="Código de Compartilhamento" value={form.code} onChange={e => updateField('code', e.target.value)} />
                                    <textarea className="w-full bg-codm-dark border border-white/10 p-2 text-white text-sm" placeholder="Notas táticas..." rows={2} value={form.notes} onChange={e => updateField('notes', e.target.value)} />
                                </div>
                            </div>

                            {/* Coluna Direita: Gunsmith Grid */}
                            <div className="lg:col-span-8">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex justify-between items-center">
                                    <span>Attachments (Gunsmith)</span>
                                    <span className="text-[10px] text-gray-500">Máximo de 5 componentes</span>
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                    <SelectInput label="Boca (Muzzle)" val={form.muzzle} options={GUNSMITH_ATTACHMENTS.muzzle} onChange={v => updateField('muzzle', v)} />
                                    <SelectInput label="Cano (Barrel)" val={form.barrel} options={GUNSMITH_ATTACHMENTS.barrel} onChange={v => updateField('barrel', v)} />
                                    <SelectInput label="Lente (Optic)" val={form.optic} options={GUNSMITH_ATTACHMENTS.optic} onChange={v => updateField('optic', v)} />
                                    <SelectInput label="Coronha (Stock)" val={form.stock} options={GUNSMITH_ATTACHMENTS.stock} onChange={v => updateField('stock', v)} />
                                    <SelectInput label="Vantagem (Perk)" val={form.perk} options={[...GUNSMITH_ATTACHMENTS.perk, ...GUNSMITH_ATTACHMENTS.special]} onChange={v => updateField('perk', v)} />
                                    <SelectInput label="Laser" val={form.laser} options={GUNSMITH_ATTACHMENTS.laser} onChange={v => updateField('laser', v)} />
                                    <SelectInput label="Acoplamento" val={form.underbarrel} options={GUNSMITH_ATTACHMENTS.underbarrel} onChange={v => updateField('underbarrel', v)} />
                                    <SelectInput label="Munição" val={form.ammo} options={GUNSMITH_ATTACHMENTS.ammo} onChange={v => updateField('ammo', v)} />
                                    <SelectInput label="Cabo (Rear Grip)" val={form.rear_grip} options={GUNSMITH_ATTACHMENTS.rear_grip} onChange={v => updateField('rear_grip', v)} />
                                </div>

                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex justify-between">
                                    <span>Mods de Arma (BR)</span>
                                    <span className="text-[10px] text-gray-500">Somente 3 mods por arma</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                                    <SelectInput label="Mod 1" val={form.mod1} options={availableMods} onChange={v => updateField('mod1', v)} isMod />
                                    <SelectInput label="Mod 2" val={form.mod2} options={availableMods} onChange={v => updateField('mod2', v)} isMod />
                                    <SelectInput label="Mod 3" val={form.mod3} options={availableMods} onChange={v => updateField('mod3', v)} isMod />
                                </div>

                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Equipamento Tático</h3>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                                    <input className="bg-black/40 border border-white/10 p-2 text-white text-xs focus:border-codm-yellow focus:outline-none uppercase" placeholder="Lethal" value={form.lethal} onChange={e => updateField('lethal', e.target.value)} />
                                    <input className="bg-black/40 border border-white/10 p-2 text-white text-xs focus:border-codm-yellow focus:outline-none uppercase" placeholder="Tactical" value={form.tactical} onChange={e => updateField('tactical', e.target.value)} />
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button type="submit" className="bg-codm-yellow text-black font-display font-bold text-2xl px-12 py-3 uppercase tracking-wider skew-x-[-10deg] hover:bg-white transition-colors shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                                        <span className="skew-x-[10deg] flex items-center gap-2"><Save /> {editingId ? 'Salvar Edição' : 'Concluir Projeto'}</span>
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLoadouts;