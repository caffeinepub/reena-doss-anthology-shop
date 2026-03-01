import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BlogCategory, type BlogPost } from "../backend.d";
import { useGetAllBlogPosts } from "../hooks/useQueries";

const ALL_CATEGORIES = [
  { key: "all", label: "All" },
  { key: BlogCategory.poems, label: "Poems" },
  { key: BlogCategory.quotes, label: "Quotes" },
  { key: BlogCategory.art, label: "Art" },
  { key: BlogCategory.lyrics, label: "Lyrics" },
  { key: BlogCategory.essays, label: "Essays" },
  { key: BlogCategory.prose, label: "Prose" },
  { key: BlogCategory.letters, label: "Letters" },
  { key: BlogCategory.photographs, label: "Photographs" },
];

const categoryColors: Record<string, string> = {
  poems: "badge-poems",
  quotes: "badge-quotes",
  art: "badge-art",
  lyrics: "badge-lyrics",
  essays: "badge-essays",
  prose: "badge-prose",
  letters: "badge-letters",
  photographs: "badge-photographs",
};

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: BigInt(1),
    title: "The Weight of Unspoken Words",
    category: BlogCategory.poems,
    body: `In the silence between heartbeats, I find the verses that refuse to be named.
They live in the breath before the sentence, the pause that holds everything —
a universe collapsed into a comma.

I have carried you in subordinate clauses,
tucked you between semicolons where no one thinks to look.
But language is a leaking vessel
and you have been spilling out of me for years.`,
    publishedAt:
      BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    authorNote: "Written at midnight when the city finally quieted down.",
  },
  {
    id: BigInt(2),
    title: "When Art Speaks Louder Than Reason",
    category: BlogCategory.essays,
    body: "There is a particular kind of madness that seizes you when you stand before a painting that should mean nothing and feel everything. Art is not language — it is the thing language reaches for and never quite grasps. This is its power and its frustration. We keep trying to explain what resists explanation, to frame the unframeable, to write the paragraph that finally makes someone understand why Rothko makes you cry.",
    publishedAt:
      BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(3),
    title: "Smoke & Gold",
    category: BlogCategory.lyrics,
    body: `Verse 1:
You came in like a sentence I never finished
All half-vowels and heavy breath
I kept the draft in a drawer marked "dangerous"
And forgot to throw it out

Chorus:
We burned like pages in the rain
Smoke and gold, we hid the pain
Your voice the match, my heart the flame
We burned so bright, we looked the same`,
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
    body: "She stood at the crossing of two lives she had never meant to live — one the daughter her mother remembered, the other the woman she had quietly become while no one was paying attention. Both were true. Neither was complete. She thought about the meridian: that invisible line on a globe where East becomes West, where yesterday becomes tomorrow, and for just a fraction of longitude, you are both and neither at once.",
    publishedAt:
      BigInt(Date.now() - 14 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(6),
    title: "Still Life with Open Window",
    category: BlogCategory.photographs,
    body: "Light does its best work when it thinks no one is watching. This photograph was taken at 5:47am, when the morning had not yet decided what it wanted to be — that liminal, golden indecision that lasts only minutes before the sun commits to its daily performance.",
    publishedAt:
      BigInt(Date.now() - 18 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(7),
    title: "Cartography of Loss",
    category: BlogCategory.poems,
    body: `There are maps for cities and for stars
but none for the territory of grief —
that vast country with no borders,
no capital, no currency but memory.

I have been navigating it anyway,
using the old methods:
the sun's position,
the ache as compass.`,
    publishedAt:
      BigInt(Date.now() - 22 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(8),
    title: "The Library at the End of All Roads",
    category: BlogCategory.art,
    body: "Mixed media work exploring the convergence of text, memory, and physical space. Ink wash over acetate sheets layered with handwritten fragments from family letters, 2019—2024. The viewer is invited to read through the layers, discovering that every story has a palimpsest beneath it.",
    publishedAt:
      BigInt(Date.now() - 28 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
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
    post.body.length > 200 ? `${post.body.slice(0, 200)}…` : post.body;
  const categoryKey = post.category as unknown as string;
  const colorClass =
    categoryColors[categoryKey] ||
    "bg-muted text-muted-foreground border-border";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link to={`/blog/${post.id}`} className="block group">
        <div className="bg-card border border-border rounded-lg p-6 card-hover hover:border-accent/40 hover:shadow-literary flex flex-col gap-3">
          <div className="flex items-center justify-between">
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

          {post.imageUrl && (
            <div className="rounded overflow-hidden aspect-[16/7]">
              <img
                src={post.imageUrl.getDirectURL()}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          )}

          <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
            {post.title}
          </h2>

          <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-line">
            {excerpt}
          </p>

          {post.authorNote && (
            <p className="text-xs font-body italic text-muted-foreground/70 border-l-2 border-accent/40 pl-3">
              {post.authorNote}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground group-hover:text-accent transition-colors mt-1">
            Read more
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogListPage() {
  const { data: posts, isLoading } = useGetAllBlogPosts();
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const categoryParam = (search as Record<string, string>)?.category ?? "all";
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const allPosts = posts && posts.length > 0 ? posts : SAMPLE_POSTS;
  const filtered =
    activeCategory === "all"
      ? allPosts
      : allPosts.filter(
          (p) => (p.category as unknown as string) === activeCategory,
        );
  const sorted = [...filtered].sort((a, b) =>
    Number(b.publishedAt - a.publishedAt),
  );

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    void navigate({
      to: "/blog",
      search: key === "all" ? {} : { category: key },
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2">
          ✦ The Anthology
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-3">
          Blog
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-xl">
          Published poems, quotes, photographs, art, lyrics, essays, and prose.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-max">
          {ALL_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-4 py-1.5 rounded-full font-body text-sm border transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat.key
                  ? "bg-accent text-accent-foreground border-accent shadow-xs"
                  : "bg-card text-foreground/60 border-border hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-lg p-6 space-y-3"
            >
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-muted-foreground mb-2">
            No posts yet in this category.
          </p>
          <p className="font-body text-sm text-muted-foreground/70">
            Check back soon or explore another category.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sorted.map((post, i) => (
              <BlogCard key={post.id.toString()} post={post} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
