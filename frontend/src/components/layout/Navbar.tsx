"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Mic, Search, LayoutDashboard, Users, Globe, LogIn, LogOut, User, ChevronDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { IconButton } from "@/components/ui/IconButton";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LANGUAGES, LanguageCode } from "@/lib/i18n/translations";
import { useAuth } from "@/lib/auth/AuthContext";
import { NewsNotification } from "@/components/ui/NewsNotification";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* ============================================
   NAVBAR — Light Theme with Auth
   ============================================ */

const navLinks = [
  { href: "/", i18nKey: "nav.home", icon: Shield },
  { href: "/community", i18nKey: "nav.community", icon: Users },
  { href: "/submit", i18nKey: "nav.submit", icon: Mic },
  { href: "/track", i18nKey: "nav.track", icon: Search },
  { href: "/support", i18nKey: "nav.support", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileOpen(false);
  };

  // Build dynamic nav links based on auth state
  const allLinks = [
    ...navLinks,
    ...(isAdmin ? [{ href: "/admin", i18nKey: "nav.dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 flex items-center justify-center group-hover:opacity-80 transition-opacity flex-shrink-0">
                <img src="/logo.jpg" alt={`${APP_NAME} Logo`} className="h-full w-auto object-contain rounded-md" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-text-primary">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop nav & Language & Auth */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1">
                {allLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                      )}
                    >
                      {t(link.i18nKey)}
                    </Link>
                  );
                })}
              </div>

              {/* News Notification */}
              <div className="border-l border-border pl-4 ml-1">
                <NewsNotification />
              </div>

              {/* Theme Toggle */}
              <div className="border-l border-border pl-4 ml-1">
                <ThemeToggle />
              </div>

              {/* Language Switcher */}
              <div className="relative flex items-center gap-2 border-l border-border pl-4">
                <Globe size={18} className="text-text-muted" />
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="bg-transparent flex items-center gap-1 text-sm font-medium text-text-primary cursor-pointer hover:text-accent transition-colors"
                >
                  {LANGUAGES.find(l => l.code === language)?.localName || "English"}
                  <ChevronDown size={14} className={cn("text-text-muted transition-transform", langMenuOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {langMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setLangMenuOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-bg-elevated border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="max-h-[300px] overflow-y-auto py-2">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                setLangMenuOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2 text-sm transition-colors",
                                language === lang.code 
                                  ? "bg-accent/10 text-accent font-medium" 
                                  : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                              )}
                            >
                              {lang.localName}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth section */}
              <div className="flex items-center gap-2 border-l border-border pl-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-surface">
                      <User size={14} className="text-accent" />
                      <span className="text-sm font-medium text-text-primary truncate max-w-[100px]">
                        {user?.name?.split(" ")[0]}
                      </span>
                      {isAdmin && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                          Admin
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/5 transition-all"
                    >
                      <LogOut size={16} />
                      <span className="hidden lg:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 transition-all"
                    >
                      <LogIn size={16} />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent-hover transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile toggle */}
            <IconButton
              label={mobileOpen ? "Close menu" : "Open menu"}
              variant="ghost"
              size="md"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/20 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-35 w-72 bg-bg-elevated border-l border-border p-6 pt-20 md:hidden shadow-lg"
            >
              <div className="flex flex-col gap-2">
                {allLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                      )}
                    >
                      <Icon size={22} />
                      {t(link.i18nKey)}
                    </Link>
                  );
                })}
              </div>

              {/* Auth section in mobile */}
              <div className="mt-6 px-4 border-t border-border pt-6">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-surface">
                      <User size={16} className="text-accent" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 transition-all"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-border text-text-primary hover:bg-bg-surface transition-all"
                    >
                      <LogIn size={18} />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent-hover transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 px-4 border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Globe size={20} />
                    <span className="font-medium text-sm">{t("nav.selectLang") || "Select Language"}</span>
                  </div>
                  <ThemeToggle />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "px-3 py-2 text-sm rounded-lg text-left transition-colors border",
                        language === lang.code
                          ? "bg-accent/10 border-accent/20 text-accent font-medium"
                          : "border-border bg-bg-surface text-text-secondary hover:bg-bg-elevated"
                      )}
                    >
                      {lang.localName}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
