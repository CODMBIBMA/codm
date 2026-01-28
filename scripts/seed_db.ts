
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Fix for resolving .env.local from script execution
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Starting seed...');

  // 1. Create Streamer
  const streamerData = {
    name: "Ferg",
    slug: "ferg",
    avatar_url: "https://yt3.googleusercontent.com/ytc/AIdro_k2a6uW7Yyq9N4r9u_v8E6x7Qy5z9w8q8q8q8=s176-c-k-c0x00ffffff-no-rj",
    bio: "The #1 CODM content creator.",
    tags: ["Pro", "Slayer", "Nuke"],
    platforms: { youtube: "https://youtube.com/ferg", twitter: "https://twitter.com/ferg" }
  };

  const { data: streamer, error: sError } = await supabase
    .from('streamers')
    .upsert(streamerData, { onConflict: 'slug' })
    .select()
    .single();

  if (sError) {
    console.error('Error seeding streamer:', sError);
    return;
  }
  console.log(`✅ Streamer: ${streamer.name}`);

  // 2. Create Weapon
  const weaponData = {
    name: "DL Q33",
    slug: "dlq33",
    category: "Sniper",
    image_url: "https://zilliongamer.com/uploads/codm/weapon/sniper/dl-q33-cod-mobile.jpg",
    videos: []
  };

  const { data: weapon, error: wError } = await supabase
    .from('weapons')
    .upsert(weaponData, { onConflict: 'slug' })
    .select()
    .single();

  if (wError) {
    console.error('Error seeding weapon:', wError);
    return;
  }
  console.log(`✅ Weapon: ${weapon.name}`);

  // 3. Create Loadout
  const loadoutData = {
    streamer_id: streamer.id,
    weapon_id: weapon.id,
    code: "DLQ33-1A2B3C4D5E",
    attachments: {
      barrel: "MIP Light",
      stock: "YKM Combat",
      perk: "FMJ",
      laser: "OWC Laser - Tactical",
      ammo: "Extended Mag A"
    },
    notes: "Aggressive sniping build",
    stats: { views: 120, copies: 45 },
    published_at: new Date().toISOString()
  };

  const { error: lError } = await supabase
    .from('loadouts')
    .insert(loadoutData);

  if (lError) {
    console.log('Note: Loadout insert might benefit from upsert key or just ignoring duplicates. Proceeding.');
  } else {
    console.log(`✅ Loadout created for ${streamer.name} with ${weapon.name}`);
  }

  console.log('✅ Seed completed!');
}

seed();
