import 'server-only';
import { createClient } from '@supabase/supabase-js';

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Supabase admin credentials not configured');
    }

    if (!isValidUrl(supabaseUrl)) {
        throw new Error('Invalid Supabase URL: Must be a valid HTTP or HTTPS URL');
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}