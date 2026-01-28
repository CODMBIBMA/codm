import { Attachment, WeaponStats } from '../types';

export const CATEGORY_BASE_STATS: Record<string, WeaponStats> = {
    'AR': {
        damage: 40, accuracy: 50, range: 50, fireRate: 60, mobility: 60, control: 50,
        adsSpeed: 250, adsSpread: 20, adsMovementSpeed: 100, hipFireAccuracy: 40,
        sprintToFire: 180, verticalRecoil: 30, lateralRecoil: 20, movementSpeed: 100,
        flinchStability: 20, bulletDensity: 0
    },
    'SMG': {
        damage: 35, accuracy: 40, range: 30, fireRate: 80, mobility: 85, control: 40,
        adsSpeed: 180, adsSpread: 15, adsMovementSpeed: 120, hipFireAccuracy: 60,
        sprintToFire: 120, verticalRecoil: 40, lateralRecoil: 30, movementSpeed: 110,
        flinchStability: 15, bulletDensity: 0
    },
    'Sniper': {
        damage: 90, accuracy: 70, range: 90, fireRate: 10, mobility: 30, control: 30,
        adsSpeed: 450, adsSpread: 5, adsMovementSpeed: 60, hipFireAccuracy: 10,
        sprintToFire: 250, verticalRecoil: 60, lateralRecoil: 10, movementSpeed: 85,
        flinchStability: 50, bulletDensity: 0
    },
    'Shotgun': {
        damage: 100, accuracy: 20, range: 15, fireRate: 20, mobility: 70, control: 20,
        adsSpeed: 200, adsSpread: 10, adsMovementSpeed: 90, hipFireAccuracy: 80,
        sprintToFire: 150, verticalRecoil: 50, lateralRecoil: 10, movementSpeed: 100,
        flinchStability: 10, bulletDensity: 40
    }
};

export const GUNSMITH_ATTACHMENTS: Attachment[] = [
    // --- MUZZLES ---
    {
        id: 'tactical_suppressor', name: 'Tactical Suppressor', slot: 'muzzle', isUniversal: true,
        positiveEffects: ['Silenced'], negativeEffects: ['ADS Speed', 'ADS Movement Speed'],
        modifiers: { adsSpeed: -5, adsMovementSpeed: -3 }, flags: ['silenced']
    },
    {
        id: 'ows_light_suppressor', name: 'OWS Light Suppressor', slot: 'muzzle', isUniversal: true,
        positiveEffects: ['Silenced'], negativeEffects: ['Damage Range'],
        modifiers: { range: -20 }, flags: ['silenced']
    },
    {
        id: 'monolithic_suppressor', name: 'Monolithic Suppressor', slot: 'muzzle', isUniversal: true,
        positiveEffects: ['Silenced', 'Damage Range'], negativeEffects: ['ADS Bullet Spread Accuracy', 'ADS Speed', 'ADS Movement Speed'],
        modifiers: { range: 25, adsSpread: -12, adsSpeed: -7, adsMovementSpeed: -5 }, flags: ['silenced']
    },
    {
        id: 'mft_light_flash_guard', name: 'MFT Light Flash Guard', slot: 'muzzle', isUniversal: true,
        positiveEffects: ['Hidden Muzzle Flash', 'ADS Bullet Spread Accuracy', 'Hip Fire Accuracy'], negativeEffects: ['Damage Range'],
        modifiers: { adsSpread: 8, hipFireAccuracy: 5, range: -10 }, flags: ['hiddenFlash']
    },
    {
        id: 'breacher_device', name: 'Breacher Device', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['icr-1'],
        positiveEffects: ['+Quick Melee Speed'], negativeEffects: ['ADS Speed'],
        modifiers: { adsSpeed: -5 }
    },
    {
        id: 'choke', name: 'Choke', slot: 'muzzle', isUniversal: false, compatibleCategories: ['Shotgun'],
        positiveEffects: ['Damage Range', 'Bullet Spread Accuracy'], negativeEffects: ['Movement Speed', 'Sprint-to-Fire Speed'],
        modifiers: { range: 15, adsSpread: 10, movementSpeed: -3, sprintToFire: -5 }
    },

    // --- BARRELS (Simulated since missing from prompt images but required by CODM) ---
    {
        id: 'owc_marksman', name: 'OWC Marksman', slot: 'barrel', isUniversal: true,
        positiveEffects: ['Damage Range', 'ADS Bullet Spread Accuracy', 'Vertical Recoil Control'], negativeEffects: ['Movement Speed', 'ADS Speed'],
        modifiers: { range: 20, adsSpread: 10, verticalRecoil: 8, movementSpeed: -5, adsSpeed: -10 }
    },

    // --- GRIPS (UNDERBARREL) ---
    {
        id: 'commando_foregrip', name: 'Commando Foregrip', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['Vertical Recoil Control', 'Lateral Recoil Stability'], negativeEffects: ['Movement Speed'],
        modifiers: { verticalRecoil: 6, lateralRecoil: 6, movementSpeed: -2 }
    },
    {
        id: 'merc_foregrip', name: 'Merc Foregrip', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['Hip Fire Accuracy', 'Vertical Recoil Control'], negativeEffects: ['ADS Speed', 'Movement Speed'],
        modifiers: { hipFireAccuracy: 10, verticalRecoil: 8, adsSpeed: -5, movementSpeed: -2 }
    },
    {
        id: 'ranger_foregrip', name: 'Ranger Foregrip', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['Vertical Recoil Control', 'ADS Bullet Spread Accuracy', 'Lateral Recoil Stability'], negativeEffects: ['ADS Speed', 'ADS Movement Speed'],
        modifiers: { verticalRecoil: 12, adsSpread: 10, lateralRecoil: 5, adsSpeed: -8, adsMovementSpeed: -5 }
    },
    {
        id: 'bipod', name: 'Bipod', slot: 'underbarrel', isUniversal: false, compatibleCategories: ['Sniper', 'LMG'],
        positiveEffects: ['Crouch/Prone Recoil Control'], negativeEffects: [],
        modifiers: { verticalRecoil: 15, lateralRecoil: 10 }
    },

    // --- STOCKS ---
    {
        id: 'mft_strike_stock', name: 'MFT Strike Stock', slot: 'stock', isUniversal: true,
        positiveEffects: ['ADS Bullet Spread Accuracy', 'Vertical Recoil Control', 'Flinch Stability'], negativeEffects: ['ADS Movement Speed'],
        modifiers: { adsSpread: 8, verticalRecoil: 5, flinchStability: 10, adsMovementSpeed: -12 }
    },
    {
        id: 'no_stock', name: 'No Stock', slot: 'stock', isUniversal: false,
        compatibleWeapons: ['m16', 'ak117', 'ak47', 'asm10', 'm4', 'lk24', 'icr-1', 'kn-44', 'hbra3', 'xpr-50', 'm21-ebr', 'outlaw', 'rpd', 'm4lmg', 'rus-79u', 'msmc', 'qq9', 'by15', 'hs0405', 'krm-262'],
        positiveEffects: ['ADS Speed', 'Movement Speed'], negativeEffects: ['ADS Bullet Spread Accuracy', 'Flinch Stability', 'Vertical Recoil Control'],
        modifiers: { adsSpeed: 12, movementSpeed: 5, adsSpread: -10, flinchStability: -15, verticalRecoil: -8 }
    },
    {
        id: 'owc_skeleton_stock', name: 'OWC Skeleton Stock', slot: 'stock', isUniversal: false,
        compatibleWeapons: ['ak47', 'hbra3', 'dl-q33', 'arctic-50', 'm21-ebr', 'locus', 'outlaw', 'rus-79u', 'hg-40'],
        positiveEffects: ['ADS Speed', 'Movement Speed'], negativeEffects: ['ADS Bullet Spread Accuracy'],
        modifiers: { adsSpeed: 8, movementSpeed: 3, adsSpread: -5 }
    },

    // --- LASERS ---
    {
        id: 'owc_laser_tac', name: 'OWC Laser – Tactical', slot: 'laser', isUniversal: true,
        positiveEffects: ['ADS Speed', 'ADS Bullet Spread Accuracy'], negativeEffects: ['Laser Visible while ADS'],
        modifiers: { adsSpeed: 5, adsSpread: 8 }
    },

    // --- REAR GRIPS ---
    {
        id: 'stippled_grip_tape', name: 'Stippled Grip Tape', slot: 'rear_grip', isUniversal: true,
        positiveEffects: ['ADS Speed', 'Sprint-to-Fire Speed'], negativeEffects: ['ADS Bullet Spread Accuracy'],
        modifiers: { adsSpeed: 5, sprintToFire: 5, adsSpread: -8 }
    },
    {
        id: 'granulated_grip_tape', name: 'Granulated Grip Tape', slot: 'rear_grip', isUniversal: true,
        positiveEffects: ['ADS Bullet Spread Accuracy'], negativeEffects: ['ADS Movement Speed'],
        modifiers: { adsSpread: 12, adsMovementSpeed: -4 }
    },

    // --- AMMO ---
    {
        id: 'stopping_power_mag', name: 'Stopping Power Mag', slot: 'ammo', isUniversal: false, compatibleWeapons: ['type-25'],
        positiveEffects: ['Damage', 'Damage Range'], negativeEffects: ['Vertical Recoil Control', 'ADS Speed'],
        modifiers: { damage: 15, range: 10, verticalRecoil: -10, adsSpeed: -8 }
    }
];

export const GUNSMITH_MODS = [
    { name: 'Hip Fire Boost', categories: [] },
    { name: 'Precise Shot', categories: [] },
    { name: 'Vertical Recoil Control', categories: [] },
    { name: 'Extended Mag', categories: [] },
    { name: 'Long Range', categories: [] },
    { name: 'Fast ADS', categories: [] },
    { name: 'Lateral Recoil Control', categories: [] },
    { name: 'Long Barrel', categories: ['Shotgun'] },
    { name: 'Sniper Expert', categories: ['Sniper'] },
    { name: 'Extended Mag Sniper', categories: ['Sniper'] }
];
