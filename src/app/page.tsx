"use client";

import { VideoBackground } from "@/components/ui/VideoBackground";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center">
      <VideoBackground
        fallbackImage="https://images.unsplash.com/photo-1672055290450-0fbc026c5b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMG5pZ2h0JTIwY2l0eXxlbnwxfHx8fDE3NzA3NDIxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
      />

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] tracking-[0.2em] text-sm font-bold uppercase">
              The Elite Circle
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl text-white font-serif tracking-tight leading-tight">
            SUGR
          </h1>

          <p className="text-xl md:text-2xl text-white/80 font-light max-w-xl mx-auto leading-relaxed">
            Where temptation meets the heat. <br />
            <span className="text-[#D4AF37]">Experience the extraordinary.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8"
        >
          <Link href="/auth/sign-in">
            <LuxuryButton variant="primary" className="min-w-[200px] flex items-center justify-center gap-2 group">
              Join Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </LuxuryButton>
          </Link>

          <Link href="/auth/sign-in">
            <LuxuryButton variant="outline" className="min-w-[200px]">
              Member Login
            </LuxuryButton>
          </Link>
        </motion.div>
      </div>

      {/* Footer / Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-white/30 text-xs tracking-wider uppercase">
          Exclusive • Discrete • Luxury
        </p>
      </motion.div>
    </div>
  );
}
