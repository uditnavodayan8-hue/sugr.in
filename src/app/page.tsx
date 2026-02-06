'use client';

import { motion } from 'framer-motion';
import SugrGate from '@/components/gatekeeper/SugrGate';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Editorial Text Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <h1 className="text-[20vw] font-serif leading-none tracking-tighter text-white whitespace-nowrap">
          GATE KEEPER
        </h1>
      </div>

      <div className="z-10 flex flex-col items-center space-y-12">
        {/* Header - Editorial Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // smooth editorial ease
          className="text-center space-y-2"
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-xl md:text-2xl font-sans tracking-[0.4em] uppercase text-zinc-500 mb-2">SUGR</span>
            <span className="text-6xl md:text-8xl font-serif text-[#F7E7CE] tracking-tight">Access</span>
            <span className="text-6xl md:text-8xl font-serif text-white italic tracking-tighter mix-blend-difference">Granted</span>
          </div>
        </motion.div>

        {/* The Gate (Jewelry-like) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#F7E7CE] rounded-full blur-[80px] opacity-10" />
          <SugrGate />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 text-[10px] text-[#F7E7CE]/60 font-mono tracking-widest uppercase"
        >
          Members Only · Est 2026
        </motion.div>
      </div>
    </main>
  );
}
