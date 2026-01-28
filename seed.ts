import { db } from './services/db';

const MOCK_STREAMERS = [
    {
        name: 'iFerg',
        slug: 'iferg',
        avatarUrl: 'https://picsum.photos/id/64/200/200',
        bannerUrl: 'https://picsum.photos/id/132/1200/400',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gamer-playing-online-games-4786-large.mp4',
        bio: 'Criador de conteúdo de elite e jogador competitivo de CODM. Conhecido por partidas com muitas kills e nukes.',
        tags: ['Slayer', 'Nuke', 'Sniper', 'Leaderboard'],
        platforms: { youtube: 'https://youtube.com/iferg', twitter: 'https://x.com/ferg' },
        isActive: true,
    },
    {
        name: 'BobbyPlays',
        slug: 'bobbyplays',
        avatarUrl: 'https://picsum.photos/id/177/200/200',
        bannerUrl: 'https://picsum.photos/id/195/1200/400',
        bio: 'Caster, reactor e analista pro player. Traz o melhor conteúdo "literalmente".',
        tags: ['Caster', 'Engraçado', 'Analista Meta'],
        platforms: { youtube: 'https://youtube.com/bobbyplays' },
        isActive: true,
    },
];

const WEAPON_LIST = [
    // AR
    { name: 'AK-47', category: 'AR' },
    { name: 'M4', category: 'AR' },
    { name: 'M16', category: 'AR' },
    { name: 'AK117', category: 'AR' },
    { name: 'Type 25', category: 'AR' },
    { name: 'ASM10', category: 'AR' },
    { name: 'BK57', category: 'AR' },
    { name: 'LK24', category: 'AR' },
    { name: 'Man-O-War', category: 'AR' },
    { name: 'KN-44', category: 'AR' },
    { name: 'HVK-30', category: 'AR' },
    { name: 'DR-H', category: 'AR' },
    { name: 'Peacekeeper MK2', category: 'AR' },
    { name: 'FR .556', category: 'AR' },
    { name: 'CR-56 AMAX', category: 'AR' },
    { name: 'AS VAL', category: 'AR' },
    { name: 'Krig 6', category: 'AR' },
    { name: 'EM2', category: 'AR' },
    { name: 'Kilo 141', category: 'AR' },
    { name: 'Grau 5.56', category: 'AR' },
    { name: 'Oden', category: 'AR' },
    { name: 'M13', category: 'AR' },
    { name: 'FFAR 1', category: 'AR' },
    { name: 'Type 19', category: 'AR' },

    // SMG
    { name: 'RUS-79U', category: 'SMG' },
    { name: 'Chicom', category: 'SMG' },
    { name: 'PDW-57', category: 'SMG' },
    { name: 'Razorback', category: 'SMG' },
    { name: 'MSMC', category: 'SMG' },
    { name: 'HG 40', category: 'SMG' },
    { name: 'Pharo', category: 'SMG' },
    { name: 'GKS', category: 'SMG' },
    { name: 'Cordite', category: 'SMG' },
    { name: 'QQ9', category: 'SMG' },
    { name: 'Fennec', category: 'SMG' },
    { name: 'AGR 556', category: 'SMG' },
    { name: 'QXR', category: 'SMG' },
    { name: 'MX9', category: 'SMG' },
    { name: 'CBR4', category: 'SMG' },
    { name: 'PPSH-41', category: 'SMG' },
    { name: 'Switchblade X9', category: 'SMG' },
    { name: 'Mac-10', category: 'SMG' },
    { name: 'LAPA', category: 'SMG' },

    // Sniper
    { name: 'DL Q33', category: 'Sniper' },
    { name: 'Arctic .50', category: 'Sniper' },
    { name: 'M21 EBR', category: 'Sniper' },
    { name: 'XPR-50', category: 'Sniper' },
    { name: 'Locus', category: 'Sniper' },
    { name: 'NA-45', category: 'Sniper' },
    { name: 'Outlaw', category: 'Sniper' },
    { name: 'Rytec AMR', category: 'Sniper' },
    { name: 'ZRG 20mm', category: 'Sniper' },
    { name: 'HDR', category: 'Sniper' },

    // LMG
    { name: 'S36', category: 'LMG' },
    { name: 'UL736', category: 'LMG' },
    { name: 'RPD', category: 'LMG' },
    { name: 'M4LMG', category: 'LMG' },
    { name: 'Chopper', category: 'LMG' },
    { name: 'Holger 26', category: 'LMG' },
    { name: 'Hades', category: 'LMG' },
    { name: 'PKM', category: 'LMG' },
    { name: 'Bruen MK9', category: 'LMG' },

    // Shotgun
    { name: 'HS0405', category: 'Shotgun' },
    { name: 'BY15', category: 'Shotgun' },
    { name: 'HS2126', category: 'Shotgun' },
    { name: 'Striker', category: 'Shotgun' },
    { name: 'KRM-262', category: 'Shotgun' },
    { name: 'Echo', category: 'Shotgun' },
    { name: 'R9-0', category: 'Shotgun' },
    { name: 'JAK-12', category: 'Shotgun' },

    // Marksman
    { name: 'Kilo Bolt-Action', category: 'Marksman' },
    { name: 'SKS', category: 'Marksman' },
    { name: 'SP-R 208', category: 'Marksman' },
    { name: 'MK2', category: 'Marksman' },

    // Pistol
    { name: 'MW11', category: 'Pistol' },
    { name: 'J358', category: 'Pistol' },
    { name: '.50 GS', category: 'Pistol' },
    { name: 'Renetti', category: 'Pistol' },
    { name: 'Shorty', category: 'Pistol' },
    { name: 'Dobvra', category: 'Pistol' },
];

async function seed() {
    console.log('🚀 Iniciando Seeding do Arsenal Oficial...');

    try {
        // 1. Criar Streamers
        for (const s of MOCK_STREAMERS) {
            await db.createStreamer(s);
            console.log(`✅ Operador criado: ${s.name}`);
        }

        // 2. Criar Armas
        for (const w of WEAPON_LIST) {
            await db.createWeapon({
                name: w.name,
                slug: w.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''),
                category: w.category as any,
                imageUrl: 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(w.name),
                isActive: true,
                videos: []
            });
            console.log(`✅ Armamento registrado: ${w.name} [${w.category}]`);
        }

        console.log('✨ Missão Cumprida! Base de dados populada.');
    } catch (err) {
        console.error('❌ Abortar Missão! Erro no seeding:', err);
    }
}

// Executar
seed();
