"use client";

import React, { useState } from "react";
import { Menu, ArrowLeft, Star, Search, Share2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Dynamic VISHWAS palette using CSS variables for theme support
const vishwasColors = { 
  c50: "var(--color-bg-primary)",   // bg-surface
  c100: "var(--color-bg-surface)",  // bg-secondary
  c500: "var(--color-accent-hover)",  // moss green (hover)
  c900: "var(--color-accent)"   // forest green (primary)
};

interface MaterialCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
}

export function MaterialCard({ title, subtitle, description, imageSrc }: MaterialCardProps) {
  const [active, setActive] = useState(false);
  const colors = vishwasColors;

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square mb-[6.6em]">
      <article 
        className="absolute inset-0 transition-all duration-300 shadow-sm"
        style={{ backgroundColor: active ? colors.c50 : "transparent" }}
      >
        {/* Title Ribbon */}
        <h2 
          className={cn(
            "absolute left-0 w-full px-4 py-2.5 text-white z-10 transition-all duration-300 m-0 text-[1.4em] leading-[1.6em]"
          )}
          style={{ 
            backgroundColor: colors.c500,
            top: active ? "0" : "calc(100% - 16px)",
            padding: active ? "10px 16px 10px 90px" : "10px 16px"
          }}
        >
          <span className="block font-medium">{title}</span>
          <strong className="font-normal text-[0.8em] flex items-center gap-1.5 mt-0.5 text-white/90">
             <Star size={12} className="fill-current" /> {subtitle}
          </strong>

          {/* Top Triangle */}
          <div 
            className="absolute left-0 top-[-16px] w-0 h-0 border-[8px] transition-all duration-300"
            style={{
              borderTopColor: "transparent",
              borderRightColor: active ? colors.c500 : colors.c900,
              borderBottomColor: active ? colors.c500 : colors.c900,
              borderLeftColor: "transparent"
            }}
          />
          
          {/* Bottom Triangle */}
          <div 
            className="absolute left-0 transition-all duration-300 w-0 h-0 border-[8px]"
            style={{
              top: "auto",
              bottom: active ? "-16px" : "0",
              borderTopColor: active ? colors.c900 : "transparent",
              borderRightColor: active ? colors.c900 : colors.c500,
              borderBottomColor: "transparent",
              borderLeftColor: "transparent"
            }}
          />
        </h2>

        {/* Content Area */}
        <div className={cn(
          "absolute right-0 top-0 bottom-4 left-4 transition-all duration-300",
          active ? "pt-[5.6em]" : ""
        )}>
          {/* Image Container */}
          <div 
            className={cn(
              "absolute overflow-hidden transition-all duration-300 z-10 bg-black/10",
              active 
                ? "rounded-full left-0 top-[12px] w-[60px] h-[60px] z-20" 
                : "left-0 top-0 w-full h-full z-[3]"
            )}
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Description */}
          <div 
            className={cn(
              "absolute right-[30px] left-[30px] bottom-[54px] overflow-hidden transition-all duration-1000",
              active ? "opacity-100 pt-[5.6em] top-[50px]" : "opacity-0 top-full"
            )}
          >
            <p className="text-text-primary leading-relaxed text-[15px]">{description}</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setActive(!active)}
          className="absolute w-[54px] h-[54px] rounded-full border-[5px] text-white flex items-center justify-center z-20 transition-all duration-300 outline-none shadow-lg"
          style={{
            right: "16px",
            top: active ? "62px" : "15px",
            backgroundColor: active ? colors.c900 : colors.c500,
            borderColor: active ? colors.c50 : colors.c500,
          }}
        >
          {active ? <ArrowLeft size={20} /> : <Menu size={20} />}
        </button>

        {/* Footer */}
        <div 
          className="overflow-hidden transition-all duration-300 absolute left-4 right-0"
          style={{
            height: active ? "82px" : "0",
            top: active ? "calc(100% - 16px)" : "100%",
            paddingTop: active ? "15px" : "0",
            paddingLeft: "25px",
            backgroundColor: colors.c100,
            overflow: active ? "visible" : "hidden"
          }}
        >
          <h4 
            className="absolute left-[30px] m-0 font-bold text-base transition-all duration-1000"
            style={{
              top: active ? "-32px" : "200px",
              color: colors.c900
            }}
          >
            Discover More
          </h4>
          <div className="flex gap-2 relative">
            {[Search, Share2, Info].map((SocIcon, i) => (
              <a 
                key={i} 
                href="#" 
                className="relative w-[48px] h-[48px] flex items-center justify-center text-white no-underline transition-all rounded-full hover:scale-110"
                style={{ 
                  top: active ? "0" : "200px",
                  transitionDuration: `${0.5 + i * 0.1}s`,
                  backgroundColor: colors.c900
                }}
              >
                <SocIcon size={20} />
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
