import { SupabaseClient } from '@supabase/supabase-js';

export interface DailyStreak {
    user_id: string;
    current_streak: number;
    last_login_date: string;
    updated_at: string;
}

/**
 * Check and update the user's daily streak.
 * Should be called on app launch/dashboard load.
 */
export async function checkDailyStreak(userId: string, supabase: SupabaseClient): Promise<DailyStreak | null> {
    if (!userId) return null;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 1. Get current streak
    const { data: streakData, error } = await supabase
        .from('daily_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching streak:', error);
        return null;
    }

    // 2. If no streak record, create one
    if (!streakData) {
        const { data: newStreak, error: createError } = await supabase
            .from('daily_streaks')
            .insert({
                user_id: userId,
                current_streak: 1,
                last_login_date: today
            })
            .select()
            .single();

        if (createError) {
            console.error('Error creating streak:', createError);
            return null;
        }
        return newStreak as DailyStreak;
    }

    const lastLogin = streakData.last_login_date;

    // 3. If already logged in today, return current
    if (lastLogin === today) {
        return streakData as DailyStreak;
    }

    // 4. Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreakCount = 1;
    if (lastLogin === yesterdayStr) {
        newStreakCount = (streakData.current_streak || 0) + 1;
    } else {
        // Missed a day (or more), reset to 1
        newStreakCount = 1;
    }

    // 5. Update streak
    const { data: updatedStreak, error: updateError } = await supabase
        .from('daily_streaks')
        .update({
            current_streak: newStreakCount,
            last_login_date: today,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

    if (updateError) {
        console.error('Error updating streak:', updateError);
        return null;
    }

    return updatedStreak as DailyStreak;
}

export async function getStreak(userId: string, supabase: SupabaseClient): Promise<number> {
    const { data } = await supabase
        .from('daily_streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .single();

    return data?.current_streak || 0;
}
