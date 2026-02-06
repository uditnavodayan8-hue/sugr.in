'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { getUnreadCount, subscribeToNotifications } from '@/lib/services/notifications';

export default function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread count
    useEffect(() => {
        if (!user) return;

        getUnreadCount(user.id).then(setUnreadCount);

        // Subscribe to new notifications
        const unsubscribe = subscribeToNotifications(user.id, () => {
            setUnreadCount(prev => prev + 1);
        });

        return unsubscribe;
    }, [user]);

    // Hide on auth/onboarding pages
    const isHidden =
        pathname.startsWith('/auth') ||
        pathname.startsWith('/onboarding') ||
        (pathname === '/' && !user);

    if (isHidden) return null;

    const navItems = [
        { href: '/dashboard', icon: Sparkles, label: 'Discover', badge: 0 },
        { href: '/chat', icon: MessageCircle, label: 'Messages', badge: unreadCount },
        { href: '/profile', icon: User, label: 'You', badge: 0 },
    ];

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="flex items-center gap-2 px-3 py-3 rounded-full bg-[#1C1C1E]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href === '/chat' && pathname.startsWith('/chat'));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300",
                                isActive
                                    ? "bg-[#F7E7CE] text-[#0A0A0A]"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />

                            {/* Unread Badge */}
                            {item.badge > 0 && !isActive && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}

                            {isActive && (
                                <motion.span
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[13px] font-semibold tracking-tight overflow-hidden whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}

