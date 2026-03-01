import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

const shopCategories = [
  { label: "All Categories", path: "/shop" },
  { label: "Words", path: "/shop/words" },
  { label: "Art", path: "/shop/art" },
  { label: "Creativity", path: "/shop/creativity" },
];

const blogCategories = [
  { label: "All Posts", path: "/blog" },
  { label: "Poems", path: "/blog?category=poems" },
  { label: "Quotes", path: "/blog?category=quotes" },
  { label: "Art", path: "/blog?category=art" },
  { label: "Lyrics", path: "/blog?category=lyrics" },
  { label: "Essays", path: "/blog?category=essays" },
  { label: "Prose", path: "/blog?category=prose" },
  { label: "Letters", path: "/blog?category=letters" },
  { label: "Photographs", path: "/blog?category=photographs" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItemClass =
    "nav-link text-foreground/70 hover:text-foreground font-body text-xs tracking-widest uppercase transition-colors duration-200";

  return (
    <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Site Name */}
          <Link
            to="/"
            className="flex flex-col leading-none group shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-display text-sm font-light tracking-[0.22em] text-foreground uppercase group-hover:text-accent transition-colors duration-300">
              Reena Doss
            </span>
            <span className="text-[8px] font-body text-muted-foreground tracking-[0.2em] uppercase mt-0.5">
              Writer&nbsp;&nbsp;Artist&nbsp;&nbsp;Creative
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {/* SHOP Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`${navItemClass} flex items-center gap-0.5`}
                >
                  Shop
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-44 bg-popover border-border shadow-literary"
              >
                <DropdownMenuItem asChild>
                  <Link to="/shop" className="cursor-pointer font-body text-sm">
                    All Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {shopCategories.slice(1).map((cat) => (
                  <DropdownMenuItem key={cat.path} asChild>
                    <Link
                      to={cat.path}
                      className="cursor-pointer font-body text-sm"
                    >
                      {cat.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PUBLICATIONS */}
            <Link to="/publications" className={navItemClass}>
              Publications
            </Link>

            {/* FEATURES */}
            <Link to="/features" className={navItemClass}>
              Features
            </Link>

            {/* CAUSES */}
            <Link to="/causes" className={navItemClass}>
              Causes
            </Link>

            {/* VOICES */}
            <Link to="/voices" className={navItemClass}>
              Voices
            </Link>

            {/* AUTHOR — external */}
            <a
              href="https://www.reenadoss.com"
              target="_blank"
              rel="noopener noreferrer"
              className={navItemClass}
            >
              Author
            </a>

            {/* PRESS — external */}
            <a
              href="https://www.inkgladiatorspress.com"
              target="_blank"
              rel="noopener noreferrer"
              className={navItemClass}
            >
              Press
            </a>

            {/* BLOG Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`${navItemClass} flex items-center gap-0.5`}
                >
                  Blog
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-44 bg-popover border-border shadow-literary"
              >
                {blogCategories.map((cat, i) => (
                  <>
                    {i === 1 && <DropdownMenuSeparator key="sep" />}
                    <DropdownMenuItem key={cat.path} asChild>
                      <Link
                        to={cat.path}
                        className="cursor-pointer font-body text-sm"
                      >
                        {cat.label}
                      </Link>
                    </DropdownMenuItem>
                  </>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`${navItemClass} flex items-center gap-1`}
              >
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant={isAuthenticated ? "outline" : "default"}
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="font-body text-xs tracking-wider uppercase"
            >
              {isLoggingIn
                ? "Signing in…"
                : isAuthenticated
                  ? "Sign Out"
                  : "Sign In"}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-1 animate-fade-in">
            {/* SHOP */}
            <div className="px-2 py-1">
              <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-2">
                Shop
              </p>
              {shopCategories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* PUBLICATIONS */}
            <div className="px-2 py-1 border-t border-border/40 mt-2 pt-2">
              <Link
                to="/publications"
                className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                Publications
              </Link>
            </div>

            {/* FEATURES */}
            <div className="px-2">
              <Link
                to="/features"
                className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </Link>
            </div>

            {/* CAUSES */}
            <div className="px-2">
              <Link
                to="/causes"
                className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                Causes
              </Link>
            </div>

            {/* VOICES */}
            <div className="px-2">
              <Link
                to="/voices"
                className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                Voices
              </Link>
            </div>

            {/* AUTHOR — external */}
            <div className="px-2">
              <a
                href="https://www.reenadoss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                Author ↗
              </a>
            </div>

            {/* PRESS — external */}
            <div className="px-2">
              <a
                href="https://www.inkgladiatorspress.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                Press ↗
              </a>
            </div>

            {/* BLOG */}
            <div className="px-2 py-1 border-t border-border/40 mt-2 pt-2">
              <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-2">
                Blog
              </p>
              {blogCategories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className="block px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {isAdmin && (
              <div className="px-2 py-1 border-t border-border/40 mt-2 pt-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 font-body text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
              </div>
            )}

            <div className="px-2 pt-3 border-t border-border/40">
              <Button
                variant={isAuthenticated ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  handleAuth();
                  setMobileOpen(false);
                }}
                disabled={isLoggingIn}
                className="w-full font-body text-xs tracking-wider uppercase"
              >
                {isLoggingIn
                  ? "Signing in…"
                  : isAuthenticated
                    ? "Sign Out"
                    : "Sign In"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
