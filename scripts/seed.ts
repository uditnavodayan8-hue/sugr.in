
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DEMO_IMAGES = {
    male: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=500&h=500&fit=crop',
    ],
    female: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop',
    ]
};

async function seed() {
    console.log('🌱 Seeding database...');

    const users = [];

    // Create 10 Providers (mostly older males)
    for (let i = 0; i < 10; i++) {
        users.push(createUser('Provider', 'male'));
    }

    // Create 10 Protégés (mostly younger females)
    for (let i = 0; i < 10; i++) {
        users.push(createUser('Protégé', 'female'));
    }

    for (const userPromise of users) {
        await userPromise;
    }

    console.log('✅ Seeding complete!');
}

async function createUser(role: 'Provider' | 'Protégé', gender: 'male' | 'female') {
    const email = faker.internet.email();
    const password = 'Password123!';

    // Create Auth User
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (authError) {
        console.error('Auth Error:', authError.message);
        return;
    }

    if (!user) return;

    // Generate Profile Data
    const name = faker.person.fullName({ sex: gender });
    const age = role === 'Provider' ? faker.number.int({ min: 35, max: 60 }) : faker.number.int({ min: 19, max: 28 });
    const bio = faker.person.bio();
    const city = faker.location.city();

    // Pick random image from demo list
    const images = DEMO_IMAGES[gender];
    const avatar_url = images[Math.floor(Math.random() * images.length)];

    // Create Profile Row
    const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        role,
        name,
        age,
        gender: gender === 'male' ? 'Male' : 'Female',
        city,
        bio,
        avatar_url,
        trust_score: faker.number.int({ min: 80, max: 100 }),
        verification_level: {
            phone: true,
            id: faker.datatype.boolean(),
            social: true,
            wealth: role === 'Provider'
        }
    });

    if (profileError) {
        console.error('Profile Error:', profileError.message);
    } else {
        console.log(`Created ${role}: ${name} (${email})`);
    }
}

seed();
