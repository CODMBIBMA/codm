
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAndCleanup() {
    console.log('🔍 Inspecting Weapons...');
    const { data: weapons, error: wError } = await supabase.from('weapons').select('*');
    if (wError) return console.error(wError);

    console.table(weapons.map(w => ({ id: w.id, name: w.name, slug: w.slug })));

    const dlq33s = weapons.filter(w => w.slug === 'dlq33' || w.name.includes('DL Q33'));

    if (dlq33s.length > 1) {
        console.log(`⚠️ Found ${dlq33s.length} DL-Q33 entries. Cleaning up...`);

        // We keep the one with slug 'dlq33' or the first one
        const keep = dlq33s.find(w => w.slug === 'dlq33') || dlq33s[0];
        const toDelete = dlq33s.filter(w => w.id !== keep.id);

        for (const weapon of toDelete) {
            console.log(`🔄 Reassigning loadouts from ${weapon.id} to ${keep.id}...`);
            const { error: uError } = await supabase
                .from('loadouts')
                .update({ weapon_id: keep.id })
                .eq('weapon_id', weapon.id);

            if (uError) console.error(`Error reassigning: ${uError.message}`);

            console.log(`🗑️ Deleting duplicate weapon ${weapon.id}...`);
            const { error: dError } = await supabase.from('weapons').delete().eq('id', weapon.id);
            if (dError) console.error(`Error deleting: ${dError.message}`);
        }
    } else {
        console.log('✅ No duplicate DL-Q33 found.');
    }

    console.log('✨ Cleanup finished.');
}

inspectAndCleanup();
