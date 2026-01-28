import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../../services/db';
import { LoadoutWithDetails, Streamer, Weapon, Loadout, WeaponStats, Attachment } from '../../types';
import { Plus, Trash2, Crosshair, Save, X, Edit2, Info, ChevronDown } from 'lucide-react';
import { GUNSMITH_ATTACHMENTS, GUNSMITH_MODS, CATEGORY_BASE_STATS } from '../../constants/gunsmith';

const SelectInput = ({
    label,
    val,
    onChange,
    options,
    isMod
}: {
    label: string,
    val: string,
    onChange: (v: string) => void,
    options: (string | Attachment)[],
    isMod?: boolean
}) => {
    let imgPath = '';
    const selectedAttachment = !isMod ? (options as Attachment[]).find(o => o.name === val) : null;

    if (isMod && val) {
        let name = val.toLowerCase().replace(/\s+/g, '_');
        if (name === 'precise_shot') name = 'precise_shoot';
        imgPath = `/mods/${name}.png`;
    }

    return (
        <div className="bg-black/30 p-2 border border-white/10 group hover:border-codm-yellow/30 transition-colors">
            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1 group-hover:text-codm-yellow transition-colors flex justify-between items-center">
                <span>{label}</span>
                {isMod && val && <img src={imgPath} alt="" className="h-4 w-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity" onError={e => (e.target as any).style.display = 'none'} />}
            </label>
            <div className="relative">
                <select
                    className="w-full bg-transparent text-white font-display text-lg uppercase focus:outline-none appearance-none cursor-pointer pr-6"
                    value={val}
                    onChange={e => onChange(e.target.value)}
                >
                    <option value="" className="bg-codm-panel text-gray-500">Nenhum</option>
                    {options.map(opt => {
                        const name = typeof opt === 'string' ? opt : opt.name;
                        return <option key={name} value={name} className="bg-codm-panel text-white">{name}</option>
                    })}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Effect Preview for Attachments */}
            {!isMod && selectedAttachment && (
                <div className="mt-1 flex flex-wrap gap-1">
                    {selectedAttachment.positiveEffects.slice(0, 2).map(e => (
                        <span key={e} className="text-[8px] text-green-500 font-bold uppercase leading-none">+{e}</span>
                    ))}
                    {selectedAttachment.negativeEffects.slice(0, 1).map(e => (
                        <span key={e} className="text-[8px] text-red-500 font-bold uppercase leading-none">-{e}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatBar = ({ label, value, diff }: { label: string, value: number, diff: number }) => {
    return (
        <div className="mb-2">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</span>
                <div className="flex items-center gap-1">
                    {diff !== 0 && (
                        <span className={`text-[10px] font-bold ${diff > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {diff > 0 ? `+${diff}` : diff}
                        </span>
                    )}
                    <span className="text-sm font-mono font-bold text-white">{Math.round(value)}</span>
                </div>
            </div>
            <div className="h-1 bg-gray-800 relative overflow-hidden">
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
}

const AdminLoadouts = () => {
    const [loadouts, setLoadouts] = useState<LoadoutWithDetails[]>([]);
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

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

    const selectedWeapon = useMemo(() => weapons.find(w => w.id === form.weaponId), [weapons, form.weaponId]);

    // Dynamic Stats Calculation
    const statsResult = useMemo(() => {
        const base = selectedWeapon?.baseStats || (selectedWeapon ? CATEGORY_BASE_STATS[selectedWeapon.category] : null);
        if (!base) return { current: null, diffs: null };

        const current = { ...base };
        const activeAttachments = [
            form.muzzle, form.barrel, form.stock, form.perk, form.laser, form.underbarrel, form.ammo, form.rear_grip
        ].map(name => GUNSMITH_ATTACHMENTS.find(a => a.name === name)).filter(Boolean) as Attachment[];

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
    }, [selectedWeapon, form.muzzle, form.barrel, form.stock, form.perk, form.laser, form.underbarrel, form.ammo, form.rear_grip]);

    const getAvailableAttachments = (slot: string) => {
        if (!selectedWeapon) return [];
        return GUNSMITH_ATTACHMENTS.filter(a => {
            if (a.slot !== slot) return false;
            if (a.isUniversal) return true;
            if (a.compatibleWeapons?.includes(selectedWeapon.slug)) return true;
            if (a.compatibleCategories?.includes(selectedWeapon.category)) return true;
            return false;
        });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Deletar projeto permanentemente?')) {
            await db.deleteLoadout(id);
            refresh();
        }
    };

    const handleEdit = (loadout: LoadoutWithDetails) => {
        setEditingId(loadout.id);
        const atts = loadout.attachments || {};
        setForm({
            streamerId: loadout.streamerId,
            weaponId: loadout.weaponId,
            code: loadout.code,
            notes: loadout.notes,
            muzzle: atts.muzzle || '',
            barrel: atts.barrel || '',
            optic: atts.optic || '',
            stock: atts.stock || '',
            perk: atts.perk || '',
            laser: atts.laser || '',
            underbarrel: atts.underbarrel || '',
            ammo: atts.ammo || '',
            rear_grip: atts.rear_grip || '',
            mod1: loadout.mods?.one || '',
            mod2: loadout.mods?.two || '',
            mod3: loadout.mods?.three || '',
            lethal: loadout.equipment?.lethal || '',
            tactical: loadout.equipment?.tactical || ''
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
    };

    const updateField = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const openNewModal = () => {
        setEditingId(null);
        setForm({
            streamerId: '', weaponId: '', code: '', notes: '', muzzle: '', barrel: '', optic: '', stock: '', perk: '', laser: '', underbarrel: '', ammo: '', rear_grip: '', mod1: '', mod2: '', mod3: '', lethal: '', tactical: ''
        });
        setIsModalOpen(true);
    };

    const availableModsList = useMemo(() => {
        return GUNSMITH_MODS.filter(m =>
            m.categories.length === 0 || (selectedWeapon && m.categories.includes(selectedWeapon.category))
        ).map(m => m.name);
    }, [selectedWeapon]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-codm-yellow skew-x-[-15deg]"></div>
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Gestão de Loadouts</h2>
                </div>
                <button onClick={openNewModal} className="bg-codm-yellow hover:bg-white text-black font-display font-bold text-xl px-6 py-2 uppercase tracking-wide skew-x-[-15deg] transition-all flex items-center gap-2">
                    <span className="skew-x-[15deg] flex items-center gap-2"><Plus size={20} /> Novo Loadout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loadouts.map(l => (
                    <div key={l.id} className="group bg-codm-panel border border-white/5 hover:border-codm_yellow/50 transition-all p-4 relative overflow-hidden">
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-codm-panel w-full max-w-6xl border border-white/10 shadow-2xl relative">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Crosshair /> {editingId ? 'Editar Projeto' : 'Construir Loadout'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Meta Info & Stats */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-black/40 p-4 border border-white/5">
                                    <label className="text-xs text-codm-yellow uppercase font-bold mb-3 block">Dados Base</label>
                                    <select className="w-full bg-codm-dark border border-white/10 text-white p-2 mb-3 focus:border-codm-yellow outline-none uppercase font-bold" value={form.streamerId} onChange={e => updateField('streamerId', e.target.value)}>
                                        <option value="">Selecione Streamer</option>
                                        {streamers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <select className="w-full bg-codm-dark border border-white/10 text-white p-2 focus:border-codm-yellow outline-none uppercase font-bold" value={form.weaponId} onChange={e => updateField('weaponId', e.target.value)}>
                                        <option value="">Selecione Arma</option>
                                        {weapons.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                </div>

                                {/* Stat Bars */}
                                <div className="bg-black/40 p-4 border border-white/5">
                                    <label className="text-xs text-gray-500 uppercase font-bold mb-4 block">Atributos da Arma</label>
                                    {statsResult.current ? (
                                        <div className="space-y-1">
                                            <StatBar label="Dano" value={statsResult.current.damage} diff={statsResult.diffs!.damage} />
                                            <StatBar label="Precisão" value={statsResult.current.accuracy} diff={statsResult.diffs!.accuracy} />
                                            <StatBar label="Alcance" value={statsResult.current.range} diff={statsResult.diffs!.range} />
                                            <StatBar label="Cadência" value={statsResult.current.fireRate} diff={statsResult.diffs!.fireRate} />
                                            <StatBar label="Mobilidade" value={statsResult.current.mobility} diff={statsResult.diffs!.mobility} />
                                            <StatBar label="Controle" value={statsResult.current.control} diff={statsResult.diffs!.control} />
                                        </div>
                                    ) : (
                                        <div className="h-40 flex items-center justify-center text-gray-600 text-xs text-center uppercase border border-dashed border-white/10">Selecione uma arma para ver os status</div>
                                    )}
                                </div>

                                <div className="bg-black/40 p-4 border border-white/5">
                                    <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Metadados</label>
                                    <input className="w-full bg-codm-dark border border-white/10 p-2 text-white text-sm mb-2 font-mono" placeholder="Código de Compartilhamento" value={form.code} onChange={e => updateField('code', e.target.value)} />
                                    <textarea className="w-full bg-codm-dark border border-white/10 p-2 text-white text-sm" placeholder="Notas táticas..." rows={2} value={form.notes} onChange={e => updateField('notes', e.target.value)} />
                                </div>
                            </div>

                            {/* Gunsmith Grid */}
                            <div className="lg:col-span-8">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex justify-between items-center">
                                    <span>Attachments (Gunsmith)</span>
                                    <span className="text-[10px] text-gray-500">Máximo de 5 componentes</span>
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                                    <SelectInput label="Boca (Muzzle)" val={form.muzzle} options={getAvailableAttachments('muzzle')} onChange={v => updateField('muzzle', v)} />
                                    <SelectInput label="Cano (Barrel)" val={form.barrel} options={getAvailableAttachments('barrel')} onChange={v => updateField('barrel', v)} />
                                    <SelectInput label="Lente (Optic)" val={form.optic} options={getAvailableAttachments('optic')} onChange={v => updateField('optic', v)} />
                                    <SelectInput label="Coronha (Stock)" val={form.stock} options={getAvailableAttachments('stock')} onChange={v => updateField('stock', v)} />
                                    <SelectInput label="Vantagem (Perk)" val={form.perk} options={getAvailableAttachments('perk')} onChange={v => updateField('perk', v)} />
                                    <SelectInput label="Laser" val={form.laser} options={getAvailableAttachments('laser')} onChange={v => updateField('laser', v)} />
                                    <SelectInput label="Acoplamento" val={form.underbarrel} options={getAvailableAttachments('underbarrel')} onChange={v => updateField('underbarrel', v)} />
                                    <SelectInput label="Munição" val={form.ammo} options={getAvailableAttachments('ammo')} onChange={v => updateField('ammo', v)} />
                                    <SelectInput label="Cabo (Rear Grip)" val={form.rear_grip} options={getAvailableAttachments('rear_grip')} onChange={v => updateField('rear_grip', v)} />
                                </div>

                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex justify-between">
                                    <span>Mods de Arma (BR)</span>
                                    <span className="text-[10px] text-gray-500">Somente 3 mods por arma</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                                    <SelectInput label="Mod 1" val={form.mod1} options={availableModsList} onChange={v => updateField('mod1', v)} isMod />
                                    <SelectInput label="Mod 2" val={form.mod2} options={availableModsList} onChange={v => updateField('mod2', v)} isMod />
                                    <SelectInput label="Mod 3" val={form.mod3} options={availableModsList} onChange={v => updateField('mod3', v)} isMod />
                                </div>

                                <div className="bg-black/40 p-4 border border-white/5 mb-8">
                                    <label className="text-xs text-white uppercase font-bold mb-3 block">Equipamento Tático</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input className="bg-codm-dark border border-white/10 p-2 text-white text-xs focus:border-codm-yellow focus:outline-none uppercase" placeholder="Lethal" value={form.lethal} onChange={e => updateField('lethal', e.target.value)} />
                                        <input className="bg-codm-dark border border-white/10 p-2 text-white text-xs focus:border-codm-yellow focus:outline-none uppercase" placeholder="Tactical" value={form.tactical} onChange={e => updateField('tactical', e.target.value)} />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-codm-yellow text-black font-display font-bold text-2xl py-4 uppercase tracking-wider skew-x-[-10deg] hover:bg-white transition-colors shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                                    <span className="skew-x-[10deg] flex items-center justify-center gap-2"><Save /> {editingId ? 'Salvar Alterações' : 'Finalizar Projeto'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLoadouts;
