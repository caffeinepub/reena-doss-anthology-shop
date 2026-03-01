import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { BlogCategory, type BlogPost } from "../backend.d";
import { useGetBlogPost } from "../hooks/useQueries";

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

const SAMPLE_POSTS: Record<string, BlogPost> = {
  "1": {
    id: BigInt(1),
    title: "The Weight of Unspoken Words",
    category: BlogCategory.poems,
    body: `In the silence between heartbeats, I find the verses that refuse to be named.
They live in the breath before the sentence, the pause that holds everything —
a universe collapsed into a comma.

I have carried you in subordinate clauses,
tucked you between semicolons where no one thinks to look.
But language is a leaking vessel
and you have been spilling out of me for years.

Now I let you run.
Now I write you open.
Now I hold nothing back
except the word for what you are —

because once I name it,
it becomes a wound with a title,
and I am not ready
for that kind of permanence.`,
    publishedAt:
      BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    authorNote: "Written at midnight when the city finally quieted down.",
  },
  "2": {
    id: BigInt(2),
    title: "When Art Speaks Louder Than Reason",
    category: BlogCategory.essays,
    body: `There is a particular kind of madness that seizes you when you stand before a painting that should mean nothing and feel everything. Art is not language — it is the thing language reaches for and never quite grasps. This is its power and its frustration. We keep trying to explain what resists explanation, to frame the unframeable, to write the paragraph that finally makes someone understand why Rothko makes you cry.

I remember the first time I stood before his chapel panels in Houston. The panels are enormous and nearly black, the room purposefully underdone, and the silence is of the kind that breathes. I was twenty-three, had just left a relationship that had remade me in unwelcome ways, and I stood there for forty minutes without meaning to.

What did I feel? That is the unanswerable question. Not sadness exactly, though grief was part of it. Not beauty, though there was beauty. Something closer to recognition — the feeling of encountering something that had been waiting for you, patient and vast, knowing you would eventually arrive.

Art does not ask you to understand it. It asks you to be present.

That is why it frightens so many people.`,
    publishedAt:
      BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
};

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const postId = BigInt(id);
  const { data: post, isLoading } = useGetBlogPost(postId);

  const displayPost = post ?? SAMPLE_POSTS[id] ?? null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <Skeleton className="h-4 w-24 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-48 w-full mt-6" />
          <div className="space-y-3 mt-6">
            {["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"].map((k) => (
              <Skeleton key={k} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!displayPost) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
          Post not found
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          This piece may have been moved or removed.
        </p>
        <Button asChild>
          <Link to="/blog">Return to Blog</Link>
        </Button>
      </div>
    );
  }

  const categoryKey = displayPost.category as unknown as string;
  const colorClass =
    categoryColors[categoryKey] ||
    "bg-muted text-muted-foreground border-border";

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-8 -ml-2 font-body text-sm text-muted-foreground hover:text-foreground"
        >
          <Link to="/blog" className="flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </Button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category + Date */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge
              variant="outline"
              className={`text-xs font-body capitalize ${colorClass}`}
            >
              {categoryKey}
            </Badge>
            <time className="text-sm font-body text-muted-foreground">
              {formatDate(displayPost.publishedAt)}
            </time>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-6">
            {displayPost.title}
          </h1>

          {/* Image */}
          {"imageUrl" in displayPost && displayPost.imageUrl && (
            <div className="rounded-lg overflow-hidden mb-8 aspect-[16/7]">
              <img
                src={
                  typeof displayPost.imageUrl === "object" &&
                  "getDirectURL" in displayPost.imageUrl
                    ? (
                        displayPost.imageUrl as { getDirectURL: () => string }
                      ).getDirectURL()
                    : ""
                }
                alt={displayPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div className="prose-literary text-foreground whitespace-pre-line leading-[1.9] font-body text-lg">
            {displayPost.body}
          </div>

          {/* Author Note */}
          {displayPost.authorNote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 border-l-2 border-accent/50 pl-5 py-1"
            >
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-1.5">
                Author's Note
              </p>
              <p className="font-body italic text-muted-foreground text-base leading-relaxed">
                {displayPost.authorNote}
              </p>
            </motion.div>
          )}

          {/* Ornamental Divider */}
          <div className="text-center py-10 text-accent/60 tracking-[0.5em] text-sm">
            ✦ ✦ ✦
          </div>

          {/* Back button */}
          <Button asChild variant="outline" className="font-body">
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </Link>
          </Button>
        </motion.article>
      </div>
    </div>
  );
}
