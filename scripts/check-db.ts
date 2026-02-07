
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Use service role key if available to bypass RLS for this check, otherwise anon
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey!);

async function checkDb() {
    console.log('Checking database...');

    // 1. Count profiles
    const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting profiles:', countError);
    } else {
        console.log(`Total Profiles: ${count}`);
    }

    // 2. Sample profiles with roles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .limit(5);

    if (profilesError) {
        console.error('Error fetching sample profiles:', profilesError);
    } else {
        console.log('Sample Profiles:', profiles);
    }
}

checkDb();
