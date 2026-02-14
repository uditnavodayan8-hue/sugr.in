import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { ClerkProvider } from '@clerk/nextjs';
import { PanicProvider } from '@/context/PanicContext';
import { AuthProvider } from '@/context/AuthContext';
import { SugrProvider } from '@/context/SugrContext';
import { Toaster } from 'sonner';
import BottomNav from '@/components/layout/BottomNav';
import { RealtimeEngine } from '@/components/layout/RealtimeEngine';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'sugr | Gatekeeper',
  description: 'Exclusive access.',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={clsx(inter.className, playfair.variable, "bg-background text-foreground min-h-screen antialiased font-sans")}>
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" afterSignOutUrl="/">
          <PanicProvider>
            <AuthProvider>
              <SugrProvider>
                <RealtimeEngine />
                {children}
                <Toaster position="top-center" toastOptions={{
                  className: 'bg-zinc-900 border border-zinc-800 text-white font-sans',
                  style: {
                    background: '#18181b',
                    borderColor: '#27272a',
                    color: '#fff',
                  }
                }} />
              </SugrProvider>
            </AuthProvider>
          </PanicProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
