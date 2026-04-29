"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Newspaper, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NewsItem {
  title: string;
  link: string;
  publishedAt: string;
  source: string;
  snippet: string;
}

export function NewsNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      if (data.news) {
        setNews(data.news);
        // Only set unread if we haven't opened it recently
        const lastSeen = localStorage.getItem("vishwas_last_news_seen");
        if (!lastSeen || new Date(data.news[0]?.publishedAt) > new Date(lastSeen)) {
          setUnreadCount(Math.min(data.news.length, 5)); // cap badge at 5
        }
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load current affairs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      if (news.length > 0) {
        localStorage.setItem("vishwas_last_news_seen", news[0].publishedAt);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-bg-elevated transition-colors text-text-secondary hover:text-text-primary"
        aria-label="Current Affairs"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white shadow-sm ring-2 ring-bg-primary">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-[340px] sm:w-[400px] bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border flex justify-between items-center bg-bg-surface">
              <div className="flex items-center gap-2 text-text-primary">
                <Newspaper size={18} className="text-accent" />
                <h3 className="font-semibold">Current Affairs</h3>
              </div>
              <span className="text-xs text-text-muted">India News</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {isLoading && news.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-text-muted">
                  <Loader2 size={24} className="animate-spin mb-2 text-accent" />
                  <p className="text-sm">Fetching latest updates...</p>
                </div>
              ) : error && news.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-danger">
                  <AlertCircle size={24} className="mb-2" />
                  <p className="text-sm text-center">{error}</p>
                </div>
              ) : news.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-text-muted">
                  <Newspaper size={24} className="mb-2 opacity-50" />
                  <p className="text-sm">No recent updates</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {news.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 hover:bg-bg-elevated transition-colors group"
                    >
                      <h4 className="text-sm font-medium text-text-primary mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h4>
                      {item.snippet && (
                        <p className="text-xs text-text-secondary mb-2 line-clamp-1">
                          {item.snippet}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-[11px] text-text-muted">
                        <span className="font-medium">{item.source}</span>
                        <div className="flex items-center gap-1">
                          <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                          <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-border bg-bg-surface text-center">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Powered by Google News
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
