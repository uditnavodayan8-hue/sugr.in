import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { PanicProvider } from '@/context/PanicContext';
import { AuthProvider } from '@/context/AuthContext';
import { SugrProvider } from '@/context/SugrContext';
import { Toaster } from 'sonner';
import BottomNav from '@/components/layout/BottomNav';

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
      <body className={clsx(inter.className, playfair.variable, "bg-background text-foreground min-h-screen antialiased font-sans")}>
        <PanicProvider>
          <AuthProvider>
            <SugrProvider>
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
      </body>
    </html>
  );
}
