import { getSupabaseClient } from '../supabase/client';

export interface Notification {
    id: string;
    user_id: string;
    type: 'match' | 'message' | 'like' | 'system';
    title: string;
    body: string;
    data?: Record<string, unknown>;
    read: boolean;
    created_at: string;
}

const supabase = getSupabaseClient();

/**
 * Get all notifications for a user
 */
export async function getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching notifications:', error.message);
        return [];
    }

    return (data as Notification[]) || [];
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) {
        console.error('Error fetching unread count:', error.message);
        return 0;
    }

    return count || 0;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }

    return true;
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);

    if (error) {
        console.error('Error marking all as read:', error);
        return false;
    }

    return true;
}

/**
 * Create a notification (typically called server-side or via trigger)
 */
export async function createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<Notification | null> {
    const { data, error } = await supabase
        .from('notifications')
        .insert({ ...notification, read: false })
        .select()
        .single();

    if (error) {
        console.error('Error creating notification:', error);
        return null;
    }

    return data as Notification;
}

/**
 * Subscribe to new notifications (real-time)
 */
export function subscribeToNotifications(
    userId: string,
    onNew: (notification: Notification) => void
): () => void {
    const channel = supabase
        .channel(`notifications-${userId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
            },
            (payload: { new: Record<string, unknown> }) => {
                onNew(payload.new as unknown as Notification);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
