import { Attachment, WeaponStats } from '../types';

export const CATEGORY_BASE_STATS: Record<string, WeaponStats> = {
    'AR': {
        damage: 40, accuracy: 50, range: 50, fireRate: 60, mobility: 60, control: 50,
        adsSpeed: 250, adsSpread: 20, adsMovementSpeed: 100, hipFireAccuracy: 40,
        sprintToFire: 180, verticalRecoil: 30, lateralRecoil: 20, movementSpeed: 100,
        flinchStability: 20, bulletDensity: 0, lungRefresher: 0, aimDriftControl: 0
    },
    'SMG': {
        damage: 35, accuracy: 40, range: 30, fireRate: 80, mobility: 85, control: 40,
        adsSpeed: 180, adsSpread: 15, adsMovementSpeed: 120, hipFireAccuracy: 60,
        sprintToFire: 120, verticalRecoil: 40, lateralRecoil: 30, movementSpeed: 110,
        flinchStability: 15, bulletDensity: 0, lungRefresher: 0, aimDriftControl: 0
    },
    'Sniper': {
        damage: 90, accuracy: 70, range: 90, fireRate: 10, mobility: 30, control: 30,
        adsSpeed: 450, adsSpread: 5, adsMovementSpeed: 60, hipFireAccuracy: 10,
        sprintToFire: 250, verticalRecoil: 60, lateralRecoil: 10, movementSpeed: 85,
        flinchStability: 50, bulletDensity: 0, lungRefresher: 50, aimDriftControl: 50
    },
    'Shotgun': {
        damage: 100, accuracy: 20, range: 15, fireRate: 20, mobility: 70, control: 20,
        adsSpeed: 200, adsSpread: 10, adsMovementSpeed: 90, hipFireAccuracy: 80,
        sprintToFire: 150, verticalRecoil: 50, lateralRecoil: 10, movementSpeed: 100,
        flinchStability: 10, bulletDensity: 40, lungRefresher: 0, aimDriftControl: 0
    }
};

export const GUNSMITH_ATTACHMENTS: Attachment[] = [
    // --- MUZZLES (AK117 SPECIFIC) ---
    {
        id: 'ak117_muzzle_tactical', name: 'Tactical Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Silenced'], negativeEffects: ['ADS Speed'],
        modifiers: { adsSpeed: -5 }, flags: ['silenced']
    },
    {
        id: 'ak117_muzzle_owc_light', name: 'OWC Light Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Silenced'], negativeEffects: ['Damage Range'],
        modifiers: { range: -20 }, flags: ['silenced']
    },
    {
        id: 'ak117_muzzle_monolithic', name: 'Monolithic Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Silenced', 'Damage Range'], negativeEffects: ['ADS Bullet Spread', 'ADS Speed'],
        modifiers: { range: 25, adsSpread: -7, adsSpeed: -12 }, flags: ['silenced']
    },
    {
        id: 'ak117_muzzle_light_compensator', name: 'OWC Light Compensator', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Vertical Recoil Control', 'Lateral Recoil Stability'], negativeEffects: ['ADS Speed', 'ADS Bullet Spread'],
        modifiers: { verticalRecoil: 11.1, lateralRecoil: 7, adsSpeed: -5, adsSpread: -8 }
    },
    {
        id: 'ak117_muzzle_flash_guard', name: 'MIP Light Flash Guard', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Hidden Muzzle Flash', 'ADS Bullet Spread', 'Hipfire Bullet Spread'], negativeEffects: ['ADS Speed'],
        modifiers: { adsSpread: 9.6, hipFireAccuracy: 7.8, adsSpeed: -5 }, flags: ['hiddenFlash']
    },
    {
        id: 'ak117_muzzle_rtc_muzzle_brake', name: 'RTC Light Muzzle Brake', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Lateral Recoil Stability', 'Vertical Recoil Control'], negativeEffects: ['ADS Speed', 'ADS Bullet Spread'],
        modifiers: { lateralRecoil: 10.5, verticalRecoil: 7.8, adsSpeed: -5, adsSpread: -8 }
    },
    {
        id: 'ak117_muzzle_mip_muzzle_brake', name: 'MIP Light Muzzle Brake', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Lateral Recoil Stability', 'ADS Bullet Spread'], negativeEffects: ['ADS Speed', 'Vertical Recoil'],
        modifiers: { lateralRecoil: 18.1, adsSpread: 6.4, adsSpeed: -10, verticalRecoil: -6.4 }
    },

    // --- MUZZLES (DLQ33 SPECIFIC) ---
    {
        id: 'dlq33_muzzle_tactical', name: 'Tactical Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Silenced'], negativeEffects: ['ADS Speed'],
        modifiers: { adsSpeed: -3 }, flags: ['silenced']
    },
    {
        id: 'dlq33_muzzle_owc_light', name: 'OWC Light Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Silenced'], negativeEffects: ['Damage Range'],
        modifiers: { range: -20 }, flags: ['silenced']
    },
    {
        id: 'dlq33_muzzle_monolithic', name: 'Monolithic Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Silenced', 'Damage Range'],
        negativeEffects: ['ADS Speed', 'Aiming Crosshair Drift', 'Lung Refresher'],
        modifiers: { range: 25, adsSpeed: -8, aimDriftControl: -20, lungRefresher: -35 }, flags: ['silenced']
    },
    {
        id: 'dlq33_muzzle_rtc_compensator', name: 'RTC Compensator', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Vertical Recoil Control', 'Horizontal Recoil Control', 'Aiming Crosshair Drift', 'Lung Refresher'],
        negativeEffects: ['ADS Speed'],
        modifiers: { verticalRecoil: 15, lateralRecoil: 15, aimDriftControl: 60, lungRefresher: 60, adsSpeed: -10 }
    },
    {
        id: 'dlq33_muzzle_flash_guard', name: 'MIP Light Flash Guard', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Hidden Muzzle Flash', 'Aiming Crosshair Drift', 'Lung Refresher'],
        negativeEffects: ['ADS Speed'],
        modifiers: { aimDriftControl: 30, lungRefresher: 35, adsSpeed: -5 }, flags: ['hiddenFlash']
    },
    {
        id: 'dlq33_muzzle_rtc_muzzle_brake', name: 'RTC Light Muzzle Brake', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Vertical Recoil Control', 'Horizontal Recoil Control'],
        negativeEffects: ['ADS Speed', 'Aiming Crosshair Drift', 'Lung Refresher'],
        modifiers: { verticalRecoil: 10, lateralRecoil: 10, adsSpeed: -5, aimDriftControl: -20, lungRefresher: -35 }
    },
    // --- MUZZLES (HS0405 SPECIFIC) ---
    {
        id: 'hs0405_muzzle_tactical', name: 'Tactical Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Silenced'], negativeEffects: ['ADS Speed'],
        modifiers: { adsSpeed: -5 }, flags: ['silenced']
    },
    {
        id: 'hs0405_muzzle_monolithic', name: 'Monolithic Suppressor', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Silenced', 'Damage Range'], negativeEffects: ['ADS Bullet Spread', 'ADS Speed', 'Movement Speed'],
        modifiers: { range: 10, adsSpread: -7, adsSpeed: -11, movementSpeed: -5 }, flags: ['silenced']
    },
    {
        id: 'hs0405_muzzle_light_compensator', name: 'OWC Light Compensator', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Vertical Recoil Control', 'Lateral Recoil Stability'], negativeEffects: ['ADS Speed', 'ADS Bullet Spread'],
        modifiers: { verticalRecoil: 11.1, lateralRecoil: 7, adsSpeed: -5, adsSpread: -8 }
    },
    {
        id: 'hs0405_muzzle_flash_guard', name: 'Flash Guard', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Hidden Muzzle Flash', 'ADS Bullet Spread', 'Hipfire Bullet Spread'], negativeEffects: ['Damage Range', 'Sprint-to-Fire Delay'],
        modifiers: { adsSpread: 12, hipFireAccuracy: 7.8, range: -15, sprintToFire: -7.5 }, flags: ['hiddenFlash']
    },
    {
        id: 'hs0405_muzzle_rtc_muzzle_brake', name: 'RTC Light Muzzle Brake', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Lateral Recoil Stability', 'Vertical Recoil Control'], negativeEffects: ['ADS Speed', 'ADS Bullet Spread'],
        modifiers: { lateralRecoil: 10.5, verticalRecoil: 7.8, adsSpeed: -5, adsSpread: -8 }
    },
    {
        id: 'hs0405_muzzle_choke', name: 'Choke', slot: 'muzzle', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Damage Range', 'ADS Bullet Spread', 'Hipfire Bullet Spread'], negativeEffects: ['Sprint-to-Fire Delay'],
        modifiers: { range: 15, adsSpread: 10, hipFireAccuracy: 10, sprintToFire: -7.5 }
    },

    // --- BARRELS ---
    {
        id: 'ak117_barrel_light_short', name: 'MIP Light Barrel (Short)', slot: 'barrel', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['ADS Speed', 'Movement Speed', 'ADS Movement Speed'], negativeEffects: ['ADS Bullet Spread', 'Vertical Recoil'],
        modifiers: { adsSpeed: 10, movementSpeed: 2, adsMovementSpeed: 2, adsSpread: -5, verticalRecoil: -10.7 }
    },
    {
        id: 'ak117_barrel_extended_light', name: 'MIP Extended Light Barrel', slot: 'barrel', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['ADS Bullet Spread', 'Damage Range', 'Lateral Recoil Stability'], negativeEffects: ['ADS Speed'],
        modifiers: { adsSpread: 3.8, range: 20, lateralRecoil: 6, adsSpeed: -11 }
    },
    {
        id: 'ak117_barrel_owc_marksman', name: 'OWC Marksman', slot: 'barrel', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Damage Range', 'Lateral Recoil Stability', 'Vertical Recoil Control', 'ADS Bullet Spread'],
        negativeEffects: ['Movement Speed', 'ADS Movement Speed', 'ADS Speed'],
        modifiers: { range: 35, lateralRecoil: 10.8, verticalRecoil: 15.7, adsSpread: 8.8, movementSpeed: -3, adsMovementSpeed: -15, adsSpeed: -17 }
    },
    {
        id: 'ak117_barrel_ykm_integral', name: 'YKM Integral Suppressor', slot: 'barrel', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Silenced', 'ADS Bullet Spread'], negativeEffects: ['ADS Speed'],
        modifiers: { adsSpread: 9.2, adsSpeed: -5 }, flags: ['silenced']
    },

    // --- BARRELS (HS0405 SPECIFIC) ---
    {
        id: 'hs0405_barrel_rtc_extended', name: 'RTC Extended Light Barrel', slot: 'barrel', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Bullet Spread', 'Damage Range'], negativeEffects: ['ADS Speed', 'Sprint Speed', 'Fire Interval'],
        modifiers: { adsSpread: 6.4, range: 20, adsSpeed: -10, movementSpeed: -3, fireRate: -5 }
    },
    {
        id: 'hs0405_barrel_sawed_off', name: 'Sawed-Off Barrel (-3 Ammo)', slot: 'barrel', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Speed', 'Movement Speed', 'ADS Movement Speed'],
        negativeEffects: ['Damage Range', 'Magazine Capacity', 'ADS Bullet Spread', 'Vertical Recoil'],
        modifiers: { adsSpeed: 12, movementSpeed: 5, adsMovementSpeed: 10, range: -5, adsSpread: -11.2, verticalRecoil: -5.6 }
    },

    // --- BARRELS (DLQ33 SPECIFIC) ---
    {
        id: 'dlq33_barrel_mip_light', name: 'MIP Light', slot: 'barrel', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['ADS Speed'],
        negativeEffects: ['Horizontal Recoil', 'Vertical Recoil', 'Hit Flinch', 'Sprint-to-Fire Delay'],
        modifiers: { adsSpeed: 10, lateralRecoil: -4, verticalRecoil: -4, flinchStability: -20, sprintToFire: -2.5 }
    },
    {
        id: 'dlq33_barrel_408_standard', name: '408 Standard', slot: 'barrel', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Damage Range', 'Vertical Recoil Control', 'Hit Flinch Stability', 'Horizontal Recoil Control'],
        negativeEffects: ['Movement Speed', 'ADS Movement Speed', 'ADS Speed'],
        modifiers: { range: 35, verticalRecoil: 15, flinchStability: 25, lateralRecoil: 12, movementSpeed: -5, adsMovementSpeed: -15, adsSpeed: -10 }
    },
    {
        id: 'dlq33_barrel_free_floating', name: 'Free Floating', slot: 'barrel', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Damage Range', 'Horizontal Recoil Control', 'Vertical Recoil Control'],
        negativeEffects: ['Hit Flinch', 'Movement Speed', 'ADS Movement Speed', 'ADS Speed'],
        modifiers: { range: 45, lateralRecoil: 20, verticalRecoil: 20, flinchStability: -45, movementSpeed: -5, adsMovementSpeed: -20, adsSpeed: -15 }
    },

    // --- OPTICS (COMMON UNIVERSAL) ---
    { id: 'common_red_dot', name: 'Classic Red Dot Sight', slot: 'optic', isUniversal: true, positiveEffects: ['Precision Sight'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -2 } },
    { id: 'common_tactical_scope', name: 'Tactical Scope (Common)', slot: 'optic', isUniversal: true, positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -5 } },

    // --- OPTICS (HS0405 SPECIFIC) ---
    { id: 'hs0405_optic_rds', name: 'Classic Red Dot Sight', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -3 } },
    { id: 'hs0405_optic_rds2', name: 'Red Dot Sight 2', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -3 } },
    { id: 'hs0405_optic_rds3', name: 'Red Dot Sight 3', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -3 } },
    { id: 'hs0405_optic_rds4', name: 'Red Dot Sight 4', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -3 } },
    { id: 'hs0405_optic_3f', name: 'Optic-3F', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -4 } },
    { id: 'hs0405_optic_3g', name: 'Optic-3G', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -4 } },
    { id: 'hs0405_optic_3h', name: 'Optic-3H', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -4 } },
    { id: 'hs0405_optic_3i', name: 'Optic-3I', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -4 } },
    { id: 'hs0405_optic_3j', name: 'Optic-3J', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -4 } },
    { id: 'hs0405_optic_3k', name: 'Optic-3K', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -4 } },
    { id: 'hs0405_optic_tac_scope', name: 'Tactical Scope', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -7 } },
    { id: 'hs0405_optic_3x_tac_1', name: '3X Tactical Scope 1', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -8 } },
    { id: 'hs0405_optic_3x_tac_2', name: '3X Tactical Scope 2', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -8 } },
    { id: 'hs0405_optic_3x_tac_3', name: '3X Tactical Scope 3', slot: 'optic', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: [], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -8 } },

    // --- OPTICS (DLQ33 SPECIFIC) ---
    { id: 'dlq33_optic_tac_scope', name: 'Tactical Scope', slot: 'optic', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -5 } },
    { id: 'dlq33_optic_3x_tac_a', name: '3X Tactical Scope A', slot: 'optic', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -8 } },
    { id: 'dlq33_optic_3x_tac_b', name: '3X Tactical Scope B', slot: 'optic', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Zoom'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -8 } },
    { id: 'dlq33_optic_3x_tac_c', name: '3X Tactical Scope C', slot: 'optic', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Zoom 3X'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -8 } },
    { id: 'dlq33_optic_4x_tac', name: '4X Tactical Scope', slot: 'optic', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Zoom 4X'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -10 } },
    { id: 'dlq33_optic_6x_tac_b', name: '6X Tactical Scope B', slot: 'optic', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Zoom 6X'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -12 } },
    { id: 'dlq33_optic_6x_tac_c', name: '6X Tactical Scope C', slot: 'optic', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Zoom 6X'], negativeEffects: ['ADS Speed'], modifiers: { adsSpeed: -12 } },

    // --- PERKS (COMMON UNIVERSAL) ---
    { id: 'common_fmj', name: 'FMJ', slot: 'perk', isUniversal: true, positiveEffects: ['Bullet Penetration'], negativeEffects: [], modifiers: {} },
    { id: 'common_soh', name: 'Sleight of Hand', slot: 'perk', isUniversal: true, positiveEffects: ['Reload Speed'], negativeEffects: [], modifiers: {} },

    // --- PERKS (HS0405 SPECIFIC) ---
    { id: 'hs0405_perk_soh', name: 'Sleight of Hand', slot: 'perk', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Reload Time -35.0%'], negativeEffects: [], modifiers: {} },
    { id: 'hs0405_perk_wounding', name: 'Wounding', slot: 'perk', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Wound Infliction Effect'], negativeEffects: [], modifiers: {} },
    { id: 'hs0405_perk_full_ammo', name: 'Full Ammo', slot: 'perk', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Max Starting Ammo'], negativeEffects: [], modifiers: {} },
    { id: 'hs0405_perk_disable', name: 'Disable', slot: 'perk', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Movement Impairment'], negativeEffects: [], modifiers: {} },
    { id: 'hs0405_perk_speed_kill', name: 'Speed Up Kill', slot: 'perk', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Speed Up After Kill'], negativeEffects: [], modifiers: {} },
    { id: 'hs0405_perk_flak', name: 'Slide Flak Jacket', slot: 'perk', isUniversal: false, compatibleWeapons: ['hs0405'], positiveEffects: ['Decreased Blast Damage While Sliding'], negativeEffects: [], modifiers: {} },

    // --- PERKS (DLQ33 SPECIFIC) ---
    { id: 'dlq33_perk_fmj', name: 'FMJ', slot: 'perk', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Bullet Penetration'], negativeEffects: [], modifiers: {} },
    { id: 'dlq33_perk_soh', name: 'Sleight of Hand', slot: 'perk', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Reload Time -15.0%'], negativeEffects: [], modifiers: {} },
    { id: 'dlq33_perk_wounding', name: 'Wounding', slot: 'perk', isUniversal: false, compatibleWeapons: ['dlq33'], positiveEffects: ['Wound Infliction Effect'], negativeEffects: [], modifiers: {} },

    // --- GRIPS (UNDERBARREL - HS0405 SPECIFIC) ---
    {
        id: 'hs0405_underbarrel_merc', name: 'Merc Foregrip', slot: 'underbarrel', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Vertical Recoil Control', 'Hipfire Bullet Spread'], negativeEffects: ['ADS Movement Speed', 'ADS Speed'],
        modifiers: { verticalRecoil: 8.9, hipFireAccuracy: 11.2, adsMovementSpeed: -10, adsSpeed: -10 }
    },
    {
        id: 'hs0405_underbarrel_operator', name: 'Operator Foregrip', slot: 'underbarrel', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Vertical Recoil Control'], negativeEffects: ['ADS Bullet Spread', 'ADS Speed'],
        modifiers: { verticalRecoil: 13.9, adsSpread: -8, adsSpeed: -15 }
    },
    {
        id: 'hs0405_underbarrel_ranger', name: 'Ranger Foregrip', slot: 'underbarrel', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Vertical Recoil Control', 'ADS Bullet Spread', 'Lateral Recoil Stability'], negativeEffects: ['ADS Movement Speed'],
        modifiers: { verticalRecoil: 12.9, adsSpread: 12.2, lateralRecoil: 3.7, adsMovementSpeed: -10 }
    },
    {
        id: 'hs0405_underbarrel_tac_a', name: 'Tactical Foregrip A', slot: 'underbarrel', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Bullet Spread'], negativeEffects: ['Movement Speed', 'ADS Movement Speed'],
        modifiers: { adsSpread: 10, movementSpeed: -1, adsMovementSpeed: -5 }
    },
    {
        id: 'hs0405_underbarrel_tac_b', name: 'Tactical Foregrip B', slot: 'underbarrel', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Bullet Spread', 'Lateral Recoil Stability'], negativeEffects: ['ADS Speed', 'ADS Movement Speed'],
        modifiers: { adsSpread: 5.2, lateralRecoil: 13.2, adsSpeed: -8, adsMovementSpeed: -5 }
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

    // --- STOCKS (AK117 SPECIFIC) ---
    {
        id: 'ak117_stock_4a', name: 'Stock-4A', slot: 'stock', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Movement Speed', 'ADS Movement Speed'],
        negativeEffects: ['ADS Speed', 'ADS Bullet Spread', 'Hit Flinch', 'Vertical Recoil'],
        modifiers: { movementSpeed: 3, adsMovementSpeed: 10, adsSpeed: -14, adsSpread: -9.6, flinchStability: -8, verticalRecoil: -10.8 }
    },
    {
        id: 'ak117_stock_4b', name: 'Stock-4B', slot: 'stock', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['ADS Movement Speed'], negativeEffects: ['ADS Bullet Spread', 'Lateral Recoil', 'Vertical Recoil'],
        modifiers: { adsMovementSpeed: 20, adsSpread: -8, lateralRecoil: -1.8, verticalRecoil: -1.8 }
    },
    {
        id: 'ak117_stock_4c', name: 'Stock-4C', slot: 'stock', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['ADS Movement Speed', 'Flinch Stability'],
        negativeEffects: ['ADS Speed', 'Lateral Recoil', 'Vertical Recoil'],
        modifiers: { adsMovementSpeed: 15, flinchStability: 5, adsSpeed: -8, lateralRecoil: -1.8, verticalRecoil: -1.8 }
    },
    {
        id: 'ak117_stock_4d', name: 'Stock-4D', slot: 'stock', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['ADS Speed'],
        negativeEffects: ['ADS Bullet Spread', 'Hit Flinch', 'Lateral Recoil Stability', 'ADS Movement Speed'],
        modifiers: { adsSpeed: 7, adsSpread: -8.2, flinchStability: -12, lateralRecoil: -3.2, adsMovementSpeed: -10 }
    },

    // --- STOCKS (HS0405 SPECIFIC) ---
    {
        id: 'hs0405_stock_4a', name: 'Stock-4A', slot: 'stock', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Speed', 'Movement Speed', 'ADS Movement Speed'],
        negativeEffects: ['ADS Bullet Spread', 'Hit Flinch', 'Vertical Recoil'],
        modifiers: { adsSpeed: 15, movementSpeed: 3, adsMovementSpeed: 7, adsSpread: -9.6, flinchStability: -10, verticalRecoil: -12 }
    },
    {
        id: 'hs0405_stock_ykm_light', name: 'YKM Light Stock', slot: 'stock', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Movement Speed'], negativeEffects: ['ADS Bullet Spread', 'Horizontal Recoil', 'Vertical Recoil'],
        modifiers: { adsMovementSpeed: 20, adsSpread: -7, lateralRecoil: -1.6, verticalRecoil: -1.6 }
    },

    // --- LASERS (AK117 SPECIFIC) ---
    {
        id: 'ak117_laser_owc_tactical', name: 'OWC Laser – Tactical', slot: 'laser', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['ADS Speed', 'ADS Bullet Spread'], negativeEffects: ['Laser Visible while ADS'],
        modifiers: { accuracy: 2, mobility: 3, adsSpeed: 8, adsSpread: 9.2 }
    },

    // --- STOCKS (DLQ33 SPECIFIC) ---
    {
        id: 'dlq33_stock_ykm_combat', name: 'YKM Combat Stock', slot: 'stock', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['ADS Speed'],
        negativeEffects: ['Horizontal Recoil', 'Vertical Recoil', 'Aiming Crosshair Drift'],
        modifiers: { adsSpeed: 10, lateralRecoil: -4, verticalRecoil: -4, aimDriftControl: -30 }
    },
    {
        id: 'dlq33_stock_owc_skeleton', name: 'OWC Skeleton Stock', slot: 'stock', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['ADS Movement Speed', 'ADS Speed'],
        negativeEffects: ['Hit Flinch', 'Horizontal Recoil', 'Vertical Recoil', 'Aiming Crosshair Drift'],
        modifiers: { adsMovementSpeed: 15, adsSpeed: 5, flinchStability: -15, lateralRecoil: -4, verticalRecoil: -4, aimDriftControl: -20 }
    },
    {
        id: 'dlq33_stock_mip_strike', name: 'MIP Strike Stock', slot: 'stock', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Hit Flinch Stability', 'Horizontal Recoil Control', 'Aiming Crosshair Drift Control', 'Lung Refresher'],
        negativeEffects: ['Sprint-to-Fire Delay', 'ADS Movement Speed'],
        modifiers: { flinchStability: 25, lateralRecoil: 10, aimDriftControl: 30, lungRefresher: 35, sprintToFire: -2.5, adsMovementSpeed: -10 }
    },
    {
        id: 'dlq33_stock_owc_ranger', name: 'OWC Ranger Stock', slot: 'stock', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Hit Flinch Stability', 'Horizontal Recoil Control', 'Aiming Crosshair Drift Control', 'Lung Refresher'],
        negativeEffects: ['ADS Time', 'ADS Movement Speed', 'Movement Speed'],
        modifiers: { flinchStability: 45, lateralRecoil: 15, aimDriftControl: 60, lungRefresher: 60, adsSpeed: -9, adsMovementSpeed: -15, movementSpeed: -4 }
    },

    // --- LASERS (DLQ33 SPECIFIC) ---
    {
        id: 'dlq33_laser_owc_tac', name: 'OWC Laser - Tactical', slot: 'laser', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['ADS Speed'], negativeEffects: ['Sprint-to-Fire Delay', 'Visible Laser Sights'],
        modifiers: { adsSpeed: 3, sprintToFire: -1.5 }
    },

    // --- UNDERBARRELS (DLQ33 SPECIFIC) ---
    {
        id: 'dlq33_underbarrel_bipod', name: 'Bipod', slot: 'underbarrel', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Crouch or Prone Recoil Control'], negativeEffects: [],
        modifiers: { verticalRecoil: 15, lateralRecoil: 15 } // Simplificação para recoil geral
    },

    // --- AMMO (DLQ33 SPECIFIC) ---
    {
        id: 'dlq33_ammo_ext_a', name: 'Extended Mag A', slot: 'ammo', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Magazine Capacity'], negativeEffects: ['Movement Speed', 'Reload Time'],
        modifiers: { movementSpeed: -1 }
    },
    {
        id: 'dlq33_ammo_ext_b', name: 'Large Extended Mag B', slot: 'ammo', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Magazine Capacity'], negativeEffects: ['Movement Speed', 'Reload Time', 'ADS Time'],
        modifiers: { movementSpeed: -2, adsSpeed: -3 }
    },
    {
        id: 'dlq33_ammo_omega', name: 'Maewat Omega-1', slot: 'ammo', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['Concussion after Getting Hit'],
        negativeEffects: ['Magazine Capacity', 'Movement Speed', 'Reload Time', 'Bullet Speed'],
        modifiers: { movementSpeed: -1 }
    },

    // --- LASERS (HS0405 SPECIFIC) ---
    {
        id: 'hs0405_laser_rtc_1mw', name: 'RTC Laser 1mW', slot: 'laser', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Speed'], negativeEffects: ['Hipfire Bullet Spread'],
        modifiers: { hipFireAccuracy: -18 }
    },
    {
        id: 'hs0405_laser_mip_5mw', name: 'MIP Laser 5mW', slot: 'laser', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Hipfire Bullet Spread', 'Sprint-to-Fire Delay'], negativeEffects: ['Laser Visible'],
        modifiers: { hipFireAccuracy: 17, sprintToFire: 25 }
    },
    {
        id: 'hs0405_laser_owc_tactical', name: 'OWC Laser – Tactical', slot: 'laser', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Speed', 'Laser Visible'], negativeEffects: ['ADS Bullet Spread'],
        modifiers: { adsSpeed: 8, adsSpread: -15 }
    },

    // --- UNDERBARRELS ---
    {
        id: 'strike_foregrip', name: 'Strike Foregrip', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['Vertical Recoil Control', 'ADS Bullet Spread'], negativeEffects: ['Movement Speed', 'ADS Movement Speed'],
        modifiers: { accuracy: 1, control: 4, mobility: -3, verticalRecoil: 7.6, adsSpread: 4.4, movementSpeed: -1, adsMovementSpeed: -5 }
    },
    {
        id: 'merc_foregrip', name: 'Merc Foregrip', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['Vertical Recoil Control', 'Hipfire Bullet Spread'], negativeEffects: ['ADS Movement Speed', 'ADS Speed'],
        modifiers: { verticalRecoil: 8.9, hipFireAccuracy: 11.2, adsMovementSpeed: -10, adsSpeed: -10 }
    },
    {
        id: 'operator_foregrip', name: 'Operator Foregrip', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['Vertical Recoil Control'], negativeEffects: ['ADS Bullet Spread', 'ADS Speed'],
        modifiers: { verticalRecoil: 13.9, adsSpread: -8, adsSpeed: -15 }
    },
    {
        id: 'ranger_foregrip', name: 'Ranger Foregrip', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['Vertical Recoil Control', 'ADS Bullet Spread', 'Lateral Recoil Stability'], negativeEffects: ['ADS Movement Speed'],
        modifiers: { verticalRecoil: 12.9, adsSpread: 12.2, lateralRecoil: 3.7, adsMovementSpeed: -10 }
    },
    {
        id: 'tactical_foregrip_a', name: 'Tactical Foregrip A', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['ADS Bullet Spread'], negativeEffects: ['Movement Speed', 'ADS Movement Speed'],
        modifiers: { adsSpread: 10, movementSpeed: -1, adsMovementSpeed: -5 }
    },
    {
        id: 'tactical_foregrip_b', name: 'Tactical Foregrip B', slot: 'underbarrel', isUniversal: true,
        positiveEffects: ['ADS Bullet Spread', 'Lateral Recoil Stability'], negativeEffects: ['ADS Speed', 'ADS Movement Speed'],
        modifiers: { adsSpread: 5.2, lateralRecoil: 13.2, adsSpeed: -8, adsMovementSpeed: -5 }
    },

    // --- REAR GRIPS (AK117 SPECIFIC) ---
    {
        id: 'ak117_grip_granulated', name: 'Granulated Grip Tape', slot: 'rear_grip', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['ADS Bullet Spread'], negativeEffects: ['ADS Movement Speed'],
        modifiers: { adsSpread: 11.6, adsMovementSpeed: -4 }
    },

    // --- REAR GRIPS (DLQ33 SPECIFIC) ---
    {
        id: 'dlq33_grip_granulated', name: 'Granulated Grip Tape', slot: 'rear_grip', isUniversal: false, compatibleWeapons: ['dlq33'],
        positiveEffects: ['ADS Bullet Spread'], negativeEffects: ['ADS Movement Speed'],
        modifiers: { adsSpread: 11.6, adsMovementSpeed: -4 }
    },

    // --- REAR GRIPS (HS0405 SPECIFIC) ---
    {
        id: 'hs0405_grip_granulated', name: 'Granulated Grip Tape', slot: 'rear_grip', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Bullet Spread'], negativeEffects: ['ADS Movement Speed'],
        modifiers: { adsSpread: 15, adsMovementSpeed: -4 }
    },
    {
        id: 'hs0405_grip_rubberized', name: 'Rubberized Grip Tape', slot: 'rear_grip', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Vertical Recoil Control'], negativeEffects: ['ADS Bullet Spread'],
        modifiers: { verticalRecoil: 13.2, adsSpread: -9.2 }
    },
    {
        id: 'hs0405_grip_stippled', name: 'Stippled Grip Tape', slot: 'rear_grip', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['ADS Speed', 'Sprint-to-Fire Speed'], negativeEffects: ['ADS Bullet Spread', 'Lateral Recoil', 'Vertical Recoil'],
        modifiers: { adsSpeed: 5, sprintToFire: 15, adsSpread: -12, lateralRecoil: -3.2, verticalRecoil: -3.2 }
    },

    // --- AMMO (AK117 SPECIFIC) ---
    {
        id: 'ak117_ammo_power_mag', name: 'Stopping Power Mag', slot: 'ammo', isUniversal: false, compatibleWeapons: ['ak117'],
        positiveEffects: ['Damage', 'Damage Range'], negativeEffects: ['Vertical Recoil Control', 'ADS Speed'],
        modifiers: { damage: 15, range: 10, verticalRecoil: -10, adsSpeed: -8 }
    },

    // --- AMMO (HS0405 SPECIFIC) ---
    {
        id: 'hs0405_ammo_tube', name: 'Tube Extension (+2 Ammo)', slot: 'ammo', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Magazine Capacity'], negativeEffects: ['Movement Speed', 'ADS Speed'],
        modifiers: { movementSpeed: -2, adsSpeed: -5 }
    },
    {
        id: 'hs0405_ammo_slug', name: '500gr Slug', slot: 'ammo', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Damage Range', 'Damage', 'ADS Bullet Spread'],
        negativeEffects: ['Pellets Per Shot'],
        modifiers: { range: 30, adsSpread: 20 }
    },
    {
        id: 'hs0405_ammo_thunder', name: 'Thunder Rounds', slot: 'ammo', isUniversal: false, compatibleWeapons: ['hs0405'],
        positiveEffects: ['Ammo Bursts into Fragments', 'Body Part Multiplier'], negativeEffects: ['Pellets Per Shot'],
        modifiers: {}
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
