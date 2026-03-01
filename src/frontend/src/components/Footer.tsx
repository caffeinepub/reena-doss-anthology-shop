import { Link } from "@tanstack/react-router";
import { ExternalLink, Heart } from "lucide-react";

const externalLinks = [
  { label: "My Website", url: "https://www.reenadoss.com" },
  { label: "Buy My Books", url: "https://rdbooks.carrd.co/" },
  { label: "Trails — All My Places", url: "https://reenadoss.carrd.co/" },
  { label: "Ink Gladiators Press", url: "https://www.inkgladiatorspress.com" },
  { label: "Patronage", url: "https://www.reenadoss.com/#patronage" },
];

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Publications", to: "/publications" },
  { label: "Features", to: "/features" },
  { label: "Causes", to: "/causes" },
  { label: "Voices", to: "/voices" },
  { label: "Blog", to: "/blog" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div>
              <h3 className="font-display text-base font-light tracking-[0.2em] uppercase text-foreground">
                Reena Doss
              </h3>
              <p className="text-[8px] font-body text-muted-foreground tracking-[0.2em] uppercase mt-0.5">
                Writer&nbsp;&nbsp;Artist&nbsp;&nbsp;Creative
              </p>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Writer, artist, and creative. Founder of Ink Gladiators Press.
              Creating worlds with words, one anthology at a time.
            </p>
            <a
              href="https://www.inkgladiatorspress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-body text-accent hover:text-accent/80 transition-colors uppercase tracking-widest"
            >
              <ExternalLink className="w-3 h-3" />
              Ink Gladiators Press
            </a>
          </div>

          {/* Navigate */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-light uppercase tracking-widest text-muted-foreground">
              Navigate
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-muted-foreground hover:text-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-light uppercase tracking-widest text-muted-foreground">
              Find Me
            </h4>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-muted-foreground">
            © {year} Reena Doss. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-accent fill-current" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
