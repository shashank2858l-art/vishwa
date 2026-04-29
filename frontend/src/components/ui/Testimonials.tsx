"use client";

import { Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

const testimonialsData = [
  {
    name: "Ramesh Kumar",
    role: "Farmer, Rajasthan",
    text: "Thanks to this platform, the broken handpump in our village was fixed within 48 hours. The anonymity gave me courage to report.",
  },
  {
    name: "Priya Singh",
    role: "Teacher, UP",
    text: "I reported a missing teacher at the primary school. The authorities took action and now classes are running regularly. Truly empowering.",
  },
  {
    name: "Abdul Rahman",
    role: "Shopkeeper, MP",
    text: "The road outside my shop was full of potholes for years. I posted a photo here, and the repair work started the very next week!",
  },
  {
    name: "Sunita Devi",
    role: "Social Worker, Bihar",
    text: "A safe space to report ration delays without fear of the local dealers. This system is a blessing for poor families.",
  },
];

export function Testimonials() {
  const { t } = useI18n();
  // Duplicate array for infinite seamless looping
  const loopedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="py-12 bg-bg-primary border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
          Citizen Voices
        </h2>
        <p className="text-sm text-text-secondary">
          Real impact stories from across the country.
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        
        {/* Infinite Marquee Track */}
        <div className="flex w-max animate-marquee hover:pause">
          {loopedTestimonials.map((t, idx) => (
            <div key={idx} className="w-[300px] md:w-[350px] mx-3 shrink-0">
              <div className="relative bg-bg-elevated border border-border p-5 rounded-lg shadow-sm h-full flex flex-col">
                
                {/* The "Tail" pointing to the author */}
                <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-[var(--color-bg-elevated)] border-r-[12px] border-r-transparent drop-shadow-sm z-10" />
                <div className="absolute -bottom-3.5 left-6 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-[var(--color-border)] border-r-[12px] border-r-transparent z-0" />

                {/* Quote Icon */}
                <div className="absolute -top-4 -left-3 w-10 h-10 bg-accent rounded shadow-md flex items-center justify-center">
                  {/* Fold effect */}
                  <div className="absolute -top-2 left-0 w-0 h-0 border-b-[8px] border-b-[var(--color-accent-hover)] border-l-[10px] border-l-transparent" />
                  <Quote size={16} className="text-white" fill="currentColor" />
                </div>

                <p className="text-sm italic text-text-secondary mt-2 mb-4 flex-grow leading-relaxed">
                  "{t.text}"
                </p>
                
              </div>
              
              {/* Author Info below the bubble */}
              <div className="mt-5 ml-6">
                <span className="block text-sm font-bold text-text-primary">
                  {t.name}
                </span>
                <span className="block text-xs font-medium text-olive">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            /* Since we duplicated the array exactly once, shifting by 50% resets seamlessly */
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
