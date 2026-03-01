import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import type { VoicePost } from "../backend.d";
import { useGetChildVoicePosts, useGetVoicePost } from "../hooks/useQueries";

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReplyCard({
  reply,
  index,
}: {
  reply: VoicePost;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-card border border-border rounded-lg p-5 hover:border-accent/30 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-3.5 h-3.5 text-accent/60 shrink-0" />
        <time className="text-xs font-body text-muted-foreground">
          {formatDate(reply.createdAt)}
        </time>
      </div>
      <h3 className="font-display text-base font-semibold text-foreground mb-2 leading-snug">
        {reply.title}
      </h3>
      <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
        {reply.body}
      </p>
    </motion.div>
  );
}

export default function VoicePostPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const postId = id ? BigInt(id) : null;

  const { data: post, isLoading: postLoading } = useGetVoicePost(postId);
  const { data: replies, isLoading: repliesLoading } =
    useGetChildVoicePosts(postId);

  if (postLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <Skeleton className="h-4 w-28 mb-8" />
        <Skeleton className="h-3 w-20 mb-3" />
        <Skeleton className="h-10 w-4/5 mb-2" />
        <Skeleton className="h-3 w-24 mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
          Voice Not Found
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          This post may have been removed or the link may be incorrect.
        </p>
        <Button asChild variant="outline" className="font-body">
          <Link to="/voices">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Voices
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <Link
          to="/voices"
          className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-accent transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Voices
        </Link>
      </motion.div>

      {/* Post */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">
          ✦ Voice
        </p>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>

        <time className="font-body text-sm text-muted-foreground block mb-8">
          {formatDate(post.createdAt)}
        </time>

        <div className="w-12 h-[1.5px] bg-accent/60 mb-8" />

        <div className="prose-literary text-foreground/85 whitespace-pre-line leading-relaxed">
          {post.body}
        </div>
      </motion.article>

      {/* Replies / Sub-posts */}
      {(replies && replies.length > 0) || repliesLoading ? (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-4 h-4 text-accent" />
            <h2 className="font-display text-xl font-semibold text-foreground">
              {repliesLoading
                ? "Loading replies…"
                : `Replies (${replies?.length ?? 0})`}
            </h2>
          </div>

          <div className="w-full h-[1px] bg-border mb-6" />

          {repliesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((k) => (
                <div
                  key={k}
                  className="bg-card border border-border rounded-lg p-5 space-y-2"
                >
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {replies?.map((reply, i) => (
                <ReplyCard key={reply.id.toString()} reply={reply} index={i} />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
