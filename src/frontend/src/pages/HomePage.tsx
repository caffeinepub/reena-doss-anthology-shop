import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookHeart, ExternalLink, Flame } from "lucide-react";
import { motion } from "motion/react";
import { BlogCategory, type BlogPost } from "../backend.d";
import { useGetAllBlogPosts } from "../hooks/useQueries";

const categoryColors: Record<string, string> = {
  poems: "badge-poems",
  quotes: "badge-quotes",
  art: "badge-art",
  lyrics: "badge-lyrics",
  essays: "badge-essays",
  prose: "badge-prose",
  photographs: "badge-photographs",
  letters: "badge-letters",
};

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: BigInt(1),
    title: "The Weight of Unspoken Words",
    category: BlogCategory.poems,
    body: "In the silence between heartbeats, I find the verses that refuse to be named. They live in the breath before the sentence, the pause that holds everything — a universe collapsed into a comma...",
    publishedAt:
      BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    authorNote: "Written at midnight when the city finally quieted down.",
  },
  {
    id: BigInt(2),
    title: "When Art Speaks Louder Than Reason",
    category: BlogCategory.essays,
    body: "There is a particular kind of madness that seizes you when you stand before a painting that should mean nothing and feel everything. Art is not language — it is the thing language reaches for and never quite grasps...",
    publishedAt:
      BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(3),
    title: "Smoke & Gold",
    category: BlogCategory.lyrics,
    body: "Chorus: We burned like pages in the rain / Smoke and gold, we hid the pain / Your voice the match, my heart the flame / We burned so bright, we looked the same...",
    publishedAt:
      BigInt(Date.now() - 8 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    authorNote: "From the upcoming Ink & Ember collection.",
  },
  {
    id: BigInt(4),
    title: "Every Storm Has Its Grammar",
    category: BlogCategory.quotes,
    body: '"The storm does not apologize for its fury. It simply arrives, does what it must, and leaves everything washed clean." — from Thresholds',
    publishedAt:
      BigInt(Date.now() - 10 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(5),
    title: "Meridian",
    category: BlogCategory.prose,
    body: "She stood at the crossing of two lives she had never meant to live — one the daughter her mother remembered, the other the woman she had quietly become while no one was paying attention. Both were true. Neither was complete...",
    publishedAt:
      BigInt(Date.now() - 14 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(6),
    title: "Still Life with Open Window",
    category: BlogCategory.photographs,
    body: "Light does its best work when it thinks no one is watching. This photograph was taken at 5:47am, when the morning had not yet decided what it wanted to be — that liminal, golden indecision that lasts only minutes...",
    publishedAt:
      BigInt(Date.now() - 18 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    imageUrl: undefined,
  },
];

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const excerpt =
    post.body.length > 160 ? `${post.body.slice(0, 160)}…` : post.body;
  const categoryKey = post.category as unknown as string;
  const colorClass =
    categoryColors[categoryKey] ||
    "bg-muted text-muted-foreground border-border";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <Link to={`/blog/${post.id}`} className="block h-full">
        <div className="bg-card border border-border rounded-lg p-6 h-full card-hover hover:border-accent/40 hover:shadow-literary flex flex-col">
          {/* Category + Date */}
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className={`text-xs font-body capitalize ${colorClass}`}
            >
              {categoryKey}
            </Badge>
            <time className="text-xs font-body text-muted-foreground">
              {formatDate(post.publishedAt)}
            </time>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
            {excerpt}
          </p>

          {/* Read More */}
          <div className="mt-4 flex items-center gap-1.5 text-xs font-body text-muted-foreground group-hover:text-accent transition-colors">
            Read more
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function HomePage() {
  const { data: posts, isLoading } = useGetAllBlogPosts();

  const recentPosts = (posts && posts.length > 0 ? posts : SAMPLE_POSTS)
    .slice()
    .sort((a, b) => Number(b.publishedAt - a.publishedAt))
    .slice(0, 6);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[520px] flex items-center bg-hero-light">
        {/* Subtle teal geometric accent top-right */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "oklch(0.54 0.115 180)" }}
        />
        {/* Thin teal rule at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "oklch(0.54 0.115 180)" }}
        />
        {/* Very subtle grain */}
        <div className="absolute inset-0 hero-texture pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <p className="font-body text-xs uppercase tracking-[0.35em] text-accent mb-6">
              ✦ &nbsp; I'll find you in the dark... ✦
            </p>
            {/* Wide-tracked name */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-foreground tracking-site-name mb-2">
              Reena Doss
            </h1>
            <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
              Writer &nbsp;&nbsp; Artist &nbsp;&nbsp; Creative
            </p>
            <p className="font-body text-xl sm:text-2xl text-foreground/70 leading-relaxed mb-10 max-w-xl mx-auto italic">
              Poems, prose, lyrics, essays, art, and photographs — a curated
              anthology of a life examined through language.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/80 text-accent-foreground font-body tracking-wide"
              >
                <Link to="/blog">Explore Her Voices</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground/20 text-foreground hover:bg-foreground/5 hover:border-accent/40 font-body"
              >
                <Link to="/shop">Visit the Shop</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Callout Banners ──────────────────────────────────────────── */}
      <section className="border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ink Gladiators Press */}
            <motion.a
              href="https://www.inkgladiatorspress.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group flex items-center gap-4 p-5 bg-card rounded-lg border border-border hover:border-accent/40 hover:shadow-literary transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-0.5">
                  Her Publishing Press
                </p>
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                  Ink Gladiators Press
                </h3>
                <p className="text-xs font-body text-muted-foreground mt-0.5">
                  A press for the brave and the literary
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
            </motion.a>

            {/* Patronage */}
            <motion.a
              href="https://www.reenadoss.com/#patronage"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group flex items-center gap-4 p-5 bg-card rounded-lg border border-border hover:border-accent/40 hover:shadow-literary transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <BookHeart className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-0.5">
                  Support the Work
                </p>
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                  Patronage
                </h3>
                <p className="text-xs font-body text-muted-foreground mt-0.5">
                  Help sustain independent literary creation
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── Recent Posts ─────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-accent mb-2">
              ✦ Latest Works
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
              From the Anthology
            </h2>
          </div>
          <Button
            asChild
            variant="ghost"
            className="font-body text-sm hidden sm:flex"
          >
            <Link to="/blog" className="flex items-center gap-1.5">
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-lg p-6 space-y-3"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPosts.map((post, i) => (
              <BlogCard key={post.id.toString()} post={post} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Button asChild variant="outline" className="font-body">
            <Link to="/blog" className="flex items-center gap-2">
              View all posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Shop Preview ─────────────────────────────────────────────── */}
      <section className="border-t border-border py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">
              ✦ &nbsp; Curated
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light tracking-widest text-foreground mb-4 uppercase">
              Words · Art · Creativity
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8 italic">
              Books, prints, apparel, and digital downloads — products crafted
              from Reena's literary and artistic universe. Each item linked
              directly to the merchant.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                className="bg-accent hover:bg-accent/80 text-accent-foreground font-body"
              >
                <Link to="/shop/words">Words Shop</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-border text-foreground hover:bg-muted hover:border-accent/40 font-body"
              >
                <Link to="/shop/art">Art Shop</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-border text-foreground hover:bg-muted hover:border-accent/40 font-body"
              >
                <Link to="/shop/creativity">Creativity Shop</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
