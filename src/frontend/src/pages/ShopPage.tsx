import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const SHOP_CATEGORIES = [
  {
    key: "words",
    label: "Words",
    path: "/shop/words",
    icon: BookOpen,
    description:
      "Poetry collections, anthologies, chapbooks, and literary prints — words you can hold in your hands.",
    accent: "bg-card border-border/50 hover:border-accent/40",
    iconClass: "text-gold bg-foreground/5",
  },
  {
    key: "art",
    label: "Art",
    path: "/shop/art",
    icon: Palette,
    description:
      "Limited edition art prints, canvases, and framed works drawn from Reena's visual art practice.",
    accent: "bg-card border-border/50 hover:border-accent/40",
    iconClass: "text-gold bg-foreground/5",
  },
  {
    key: "creativity",
    label: "Creativity",
    path: "/shop/creativity",
    icon: Sparkles,
    description:
      "Mugs, apparel, journals, and lifestyle products infused with literary and artistic themes.",
    accent: "bg-card border-border/50 hover:border-accent/40",
    iconClass: "text-gold bg-foreground/5",
  },
];

export default function ShopPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border/50 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3 opacity-80">
              ✦ &nbsp; Curated Shop
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-light tracking-widest mb-4 uppercase text-foreground">
              Words · Art · Creativity
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed italic">
              Browse products crafted from Reena's literary and artistic
              universe. Each item links directly to its merchant — from
              print-on-demand stores to digital downloads.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOP_CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Link to={cat.path} className="block h-full group">
                  <div
                    className={`h-full flex flex-col ${cat.accent} border rounded-lg p-8 card-hover hover:shadow-literary-lg transition-all duration-300`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.iconClass} mb-6`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                      {cat.label}
                    </h2>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">
                      {cat.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 font-body text-sm text-muted-foreground group-hover:text-gold transition-colors font-medium">
                      Browse {cat.label}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Note about fulfillment */}
      <section className="container mx-auto px-4 sm:px-6 pb-14">
        <div className="bg-muted/50 border border-border/40 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            <strong className="font-semibold text-foreground">
              About fulfillment:{" "}
            </strong>
            Products marked{" "}
            <span className="font-semibold text-foreground">Digital</span> are
            delivered electronically. Products marked{" "}
            <span className="font-semibold text-foreground">POD</span>{" "}
            (Print-on-Demand) are fulfilled by third-party merchants — click
            "Buy" to be taken directly to the external store. Reena handles
            digital deliveries personally.
          </p>
        </div>
      </section>
    </div>
  );
}
