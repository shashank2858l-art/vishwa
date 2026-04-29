"use client";

import React from "react";
import { Hourglass, Globe, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { useI18n } from "@/lib/i18n/I18nContext";

export function ImpactSection() {
  const { t } = useI18n();
  return (
    <section className="flex flex-col w-full">
      {/* Top Bar with Stats */}
      <div className="bg-accent text-white py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg md:text-xl font-medium mb-10 text-white/90">{t("impact.heading")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto gap-12 sm:gap-8">
            <div className="flex flex-col items-center">
              <Hourglass size={48} className="mb-4 text-white/90" strokeWidth={1.5} />
              <h4 className="text-4xl md:text-5xl font-bold mb-1">10+</h4>
              <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">{t("impact.years")}</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe size={48} className="mb-4 text-white/90" strokeWidth={1.5} />
              <h4 className="text-4xl md:text-5xl font-bold mb-1">85+</h4>
              <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">{t("impact.districts")}</p>
            </div>
            <div className="flex flex-col items-center">
              <ClipboardCheck size={48} className="mb-4 text-white/90" strokeWidth={1.5} />
              <h4 className="text-4xl md:text-5xl font-bold mb-1">100+</h4>
              <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">{t("impact.evaluations")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative py-20 md:py-24 px-4 bg-[#F5F3EF] border-b border-border overflow-hidden">
        {/* Graph Paper Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#2F4F3F 1px, transparent 1px), linear-gradient(90deg, #2F4F3F 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
          <p className="text-text-primary font-medium text-sm md:text-base mb-16 max-w-3xl mx-auto">
            {t("impact.study")}
          </p>

          {/* Bar Charts */}
          <div className="flex flex-wrap items-end justify-center gap-10 md:gap-16 lg:gap-20 mb-20 min-h-[220px]">
             {[
               { 
                 val1: 55, val2: 85, pct: "33%", 
                 color1: "bg-olive/40", color2: "bg-olive", textColor: "text-olive",
                 desc: "at getting findings that address each evaluation question" 
               },
               { 
                 val1: 65, val2: 100, pct: "46%", 
                 color1: "bg-[#8b5a2b]/40", color2: "bg-[#8b5a2b]", textColor: "text-[#8b5a2b]", // Muted Brown
                 desc: "at analyzing gender and social factors" 
               },
               { 
                 val1: 60, val2: 95, pct: "38%", 
                 color1: "bg-[#d4a373]/50", color2: "bg-[#d4a373]", textColor: "text-[#a07245]", // Sand/Beige
                 desc: "at orienting action or recommendations" 
               },
               { 
                 val1: 45, val2: 70, pct: "26%", 
                 color1: "bg-accent/40", color2: "bg-accent", textColor: "text-accent", // Forest Green
                 desc: "at defining clear roles for implementing recommendations" 
               },
             ].map((item, i) => (
               <div key={i} className="flex flex-col items-center w-32 sm:w-36 group">
                  <div className="flex items-end justify-center gap-2 mb-6 h-[160px] w-full border-b border-border/50">
                     <motion.div 
                       initial={{ height: 0 }} whileInView={{ height: `${item.val1}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i*0.1 }}
                       className={`w-7 sm:w-9 ${item.color1} rounded-t-sm origin-bottom`} 
                     />
                     <motion.div 
                       initial={{ height: 0 }} whileInView={{ height: `${item.val2}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i*0.1 + 0.2 }}
                       className={`w-7 sm:w-9 ${item.color2} rounded-t-sm origin-bottom`} 
                     />
                  </div>
                  <div className="text-center">
                    <h4 className={`text-3xl sm:text-4xl font-bold mb-1 ${item.textColor}`}>{item.pct}</h4>
                    <p className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-3 ${item.textColor}`}>
                      {t("impact.effective") ? t("impact.effective").replace(" ", "\n") : "More\nEffective"}
                    </p>
                    <p className="text-[11px] sm:text-xs text-text-secondary leading-snug px-1 max-w-[140px] mx-auto">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>

          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white px-10 py-6 text-sm tracking-wider uppercase font-semibold">
            {t("impact.learnmore")}
          </Button>
        </div>
      </div>
    </section>
  );
}
