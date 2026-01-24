
import { createClient } from '@supabase/supabase-js';

// Re-use the existing client structure but we will need to ensure it's accessible.
// Since we are likely inside a helper, we will import the supabase client from 'supabase.ts' if possible,
// but to be safe and avoid circular deps, I'll pass the client or import it.
import { supabase } from './supabase';

export interface LogEntry {
    action_type: string;
    user_id?: string;
    user_email?: string;
    metadata?: any;
}

export const logUserAction = async (
    action: string,
    details?: any,
    user?: { id: string; emailAddresses: { emailAddress: string }[] } | null
) => {
    try {
        const userId = user ? user.id : 'guest';
        const userEmail = user ? user.emailAddresses[0]?.emailAddress : null;

        const entry = {
            user_id: userId,
            user_email: userEmail,
            action_type: action,
            details: details,
            created_at: new Date().toISOString()
        };

        console.log(`[Activity Log] ${action}`, entry);

        // 1. Save to Local Storage (Backup/Immediate View)
        try {
            const img = localStorage.getItem('local_activity_logs');
            const localLogs = img ? JSON.parse(img) : [];
            // Prep entry with ID for local view
            const localEntry = { ...entry, id: Date.now() };
            localStorage.setItem('local_activity_logs', JSON.stringify([localEntry, ...localLogs].slice(0, 100)));
        } catch (err) {
            console.error("Local storage log error", err);
        }

        // 2. Save to Supabase (Persistent)
        const { error } = await supabase
            .from('user_activity_logs')
            .insert([entry]);

        if (error) {
            console.warn("Failed to log entry to Supabase:", error.message);
        }
    } catch (e) {
        console.error("Logging error:", e);
    }
};
