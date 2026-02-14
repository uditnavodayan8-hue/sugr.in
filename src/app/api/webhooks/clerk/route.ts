import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        try {
            const supabase = createClient();

            // Create profile in Supabase
            const { error } = await supabase
                .from('profiles')
                .insert({
                    id: id,
                    name: `${first_name || ''} ${last_name || ''}`.trim() || null,
                    avatar_url: image_url || null,
                    email: email_addresses[0]?.email_address || null,
                });

            if (error) {
                console.error('Error creating profile:', error);
                return new Response('Error creating profile', { status: 500 });
            }

            console.log(`Profile created for user ${id}`);
            return new Response('Profile created', { status: 200 });
        } catch (error) {
            console.error('Error in webhook:', error);
            return new Response('Internal server error', { status: 500 });
        }
    }

    if (eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        try {
            const supabase = createClient();

            // Update profile in Supabase
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: `${first_name || ''} ${last_name || ''}`.trim() || null,
                    avatar_url: image_url || null,
                })
                .eq('id', id);

            if (error) {
                console.error('Error updating profile:', error);
                return new Response('Error updating profile', { status: 500 });
            }

            console.log(`Profile updated for user ${id}`);
            return new Response('Profile updated', { status: 200 });
        } catch (error) {
            console.error('Error in webhook:', error);
            return new Response('Internal server error', { status: 500 });
        }
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        try {
            const supabase = createClient();

            // Delete profile from Supabase
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error && error.code !== 'PGRST116') { // Ignore if already deleted
                console.error('Error deleting profile:', error);
                return new Response('Error deleting profile', { status: 500 });
            }

            console.log(`Profile deleted for user ${id}`);
            return new Response('Profile deleted', { status: 200 });
        } catch (error) {
            console.error('Error in webhook:', error);
            return new Response('Internal server error', { status: 500 });
        }
    }

    return new Response('Webhook received', { status: 200 });
}
