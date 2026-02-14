import React from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased text-gray-100 font-sans min-h-screen bg-background-dark flex justify-center">
            <div className="w-full max-w-md relative bg-background-dark shadow-2xl min-h-screen pb-20">
                {children}
                <BottomNav />
            </div>
        </div>
    );
}
