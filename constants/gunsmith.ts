
export const GUNSMITH_ATTACHMENTS = {
    muzzle: [
        'MIP Light Flash Guard',
        'Tactical Suppressor',
        'Monolithic Suppressor',
        'Agency Suppressor',
        'RTC Compensator',
        'OWC Light Suppressor',
        'Colossus Suppressor',
        'YKM Flash Guard'
    ],
    barrel: [
        'OWC Marksman',
        'MIP Extended Light Barrel',
        'MIP Long Barrel',
        'RTC Long',
        'RTC Heavy Long',
        'YKM Integral Suppressor Barrel',
        'Task Force Barrel',
        'Ranger Barrel',
        'Short Barrel',
        'Compact Barrel'
    ],
    optic: [
        'Classic Red Dot',
        'Red Dot Sight 1',
        'Red Dot Sight 2',
        'Red Dot Sight 3',
        'Holographic Sight 1',
        'Holographic Sight 2',
        'Holographic Sight 3',
        '3x Tactical Scope',
        '4x Tactical Scope',
        '6x Tactical Scope',
        'Tactical Scope'
    ],
    stock: [
        'No Stock',
        'RTC Steady Stock',
        'RTC Light Stock',
        'YKM Light Stock',
        'MIP Strike Stock',
        'OWC Skeleton Stock',
        'MIP Adjustable Stock',
        'Combat Stock'
    ],
    laser: [
        'OWC Laser – Tactical',
        'MIP Laser 5mW',
        'OWC Laser – Tactical (Green)',
        'RTC Laser 1mW'
    ],
    underbarrel: [
        'Operator Foregrip',
        'Strike Foregrip',
        'Ranger Foregrip',
        'Merc Foregrip',
        'Tactical Foregrip A',
        'Tactical Foregrip B'
    ],
    ammo: [
        'Extended Mag',
        'Large Extended Mag',
        'Fast Reload',
        'Light Reload',
        'Drum Mag',
        '30 Round Mag',
        '40 Round Mag',
        '50 Round Mag',
        '60 Round Mag',
        '10mm Auto Ammo',
        '.300 OWC Mag',
        '.458 SOCOM',
        '.338 Lapua Mag',
        '12 Gauge Slug',
        '5.45 Caliber Ammo',
        '7.62 Caliber Ammo'
    ],
    rear_grip: [
        'Granulated Grip Tape',
        'Stippled Grip Tape',
        'Rubberized Grip Tape'
    ],
    perk: [
        'Sleight of Hand',
        'FMJ',
        'Long Shot',
        'Disable',
        'Wounding',
        'Full Ammo',
        'Frangible – Wounding',
        'Frangible – Disabling'
    ],
    special: [
        'Stopping Power Reload',
        'RTC Steady Stock (Sniper)',
        'Bipod',
        'Marauder Suppressor',
        'Choke',
        'Slug Rounds',
        'Hollow Point Ammo',
        'Rapid Fire Barrel',
        'Cooling Compressor Barrel',
        'Heavy Handle'
    ]
};

export const GUNSMITH_MODS = [
    { name: 'Hip Fire Boost', categories: [] }, // Empty categories means available for all
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
