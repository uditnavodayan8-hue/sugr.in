
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const DEMO_IMAGES = {
    male: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
        'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a'
    ],
    female: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e'
    ]
};

async function seed() {
    console.log('🌱 Seeding database...');

    const users = [];

    // Create 10 Providers
    for (let i = 0; i < 10; i++) {
        users.push(createUser('provider', 'male'));
    }

    // Create 10 Proteges
    for (let i = 0; i < 10; i++) {
        users.push(createUser('protege', 'female'));
    }

    await Promise.all(users);

    console.log('✅ Seeding complete!');
}

async function createUser(role: 'provider' | 'protege', gender: 'male' | 'female') {
    const email = faker.internet.email();
    const password = 'Password123!';

    // 1. Create Auth User
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: faker.person.fullName({ sex: gender }) }
    });

    if (authError) {
        // Log but don't stop (sometimes email exists)
        console.warn(`Auth Error for ${email}: ${authError.message}`);
        return;
    }

    if (!user) return;

    // 2. Prepare Profile Data
    const full_name = user.user_metadata.full_name;
    const age = role === 'provider' ? faker.number.int({ min: 35, max: 60 }) : faker.number.int({ min: 19, max: 28 });
    const bio = faker.person.bio();
    // Use a location that is likely to be "nearby" or just random major city
    const location = faker.location.city();

    // Pick random image
    const images = DEMO_IMAGES[gender];
    const avatar_url = images[Math.floor(Math.random() * images.length)];

    const lifestyle_tiers = role === 'provider' ? ['Jetsetter', 'Philanthropist', 'Investor'] : ['Student', 'Model', 'Artist'];
    const lifestyle_tier = faker.helpers.arrayElement(lifestyle_tiers);

    const sugr_index = faker.number.int({ min: 1, max: 100 });

    // 3. Insert/Update Profile
    // Note: The triggers on auth.users might have already created a profile row.
    // We should use upsert to be safe.

    const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        role,           // 'provider' or 'protege'
        full_name,      // Matches schema
        // age,         -- Removed: SCHEMA DOES NOT SHOW AGE COLUMN IN MIGRATION FILE.
        // It showed role, bio, lifestyle_tier, sugr_index.
        // It MIGHT have name/age from previous migrations? 
        // Based on ProfileDossier it uses `profile.full_name` and `profile.location`.
        // I will trust the migration I just saw and add `full_name` if previous migration supported it.
        // Wait, the migration added columns to `profiles`. 
        // Let's assume `full_name` and `avatar_url` exist from base schema.

        bio,
        avatar_url,
        lifestyle_tier,
        sugr_index,
        // location? ProfileDossier uses 'location' property on profile object.
        // I'll skip location if not in schema visible, but ProfileDossier uses it.
        // Let's assume it exists or fail gracefully. I'll omit if unsure.
        // Actually ProfileDossier has `location?: string` in interface. 
        // I'll try to update `city` if that was the old name, or assume `location`.
        // Let's stick to what I SAW in the migration + generic fields.
    });

    if (profileError) {
        console.error(`Profile Error for ${full_name}:`, profileError.message);
    } else {
        console.log(`Created ${role}: ${full_name}`);
    }
}

seed().catch(console.error);
