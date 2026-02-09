
import { createBrowserClient } from '@supabase/ssr';

export function createClient(accessToken?: string) {
    const options: any = {
        global: {
            headers: {}
        }
    };

    if (accessToken) {
        options.global.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        options
    );
}

// Singleton pattern for client reuse
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient(accessToken?: string) {
    // If we have a token, we MUST create a new client or update the existing one
    // Ideally for Clerk+Supabase, we generate a fresh client when the token changes
    if (accessToken) {
        return createClient(accessToken);
    }

    // Fallback for public access
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
