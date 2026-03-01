import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import type { VoicePost } from "../backend.d";
import { useGetRootVoicePosts } from "../hooks/useQueries";

const SAMPLE_VOICES: VoicePost[] = [
  {
    id: BigInt(1),
    title: "On Identity",
    body: "Identity is not a fixed address. It is the accumulation of every language you have had to learn in order to survive, every border you crossed — visible or invisible — and every name someone else gave you before you were old enough to choose your own.",
    createdAt: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(2),
    title: "On Belonging",
    body: "Belonging is not the same as being accepted. You can be accepted into a room and still feel like a visitor. Belonging is different — it is the feeling that the room was built with you in mind, that the windows face the direction you love at the hour you love most.",
    createdAt: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(3),
    title: "On Language as Home",
    body: "Before I had a house, I had a language. Before I had a country, I had words. Language is the first home we are given — and often the last one taken from us.",
    createdAt: BigInt(Date.now() - 6 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(4),
    title: "On Grief and Writing",
    body: "Writing did not save me from grief. It did something stranger: it let me live inside it without being destroyed by it. The page became a container for what my body could not hold.",
    createdAt: BigInt(Date.now() - 9 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(5),
    title: "On the Act of Publishing",
    body: "Every time I send a poem out into the world, I am committing a small, radical act of trust — trusting that someone, somewhere, is waiting for exactly those words.",
    createdAt:
      BigInt(Date.now() - 12 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(6),
    title: "On Silence",
    body: "Silence is not the absence of something. It is a presence — heavy, shaped, particular. I have learned to read silence the way I read poems: for what is there, not for what is missing.",
    createdAt:
      BigInt(Date.now() - 15 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(7),
    title: "On Femininity and Power",
    body: "I was taught early that softness was weakness. I spent years unlearning this. Now I understand: softness is a form of radical power. It refuses the grammar of conquest.",
    createdAt:
      BigInt(Date.now() - 18 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(8),
    title: "On Reading as Resistance",
    body: "To read is to resist. Every time you open a book from a voice that has been silenced, dismissed, or denied — you are doing something political. You are choosing whose reality gets to count.",
    createdAt:
      BigInt(Date.now() - 21 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(9),
    title: "On the Body in Art",
    body: "My body has always been a site of contest — for others to define, for culture to claim. Making art with and about my body has been the most subversive thing I have ever done.",
    createdAt:
      BigInt(Date.now() - 24 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(10),
    title: "On Community in Publishing",
    body: "Independent publishing taught me that the literary world does not have to be a hierarchy. It can be a circle. When I founded Ink Gladiators Press, I wanted to build that circle.",
    createdAt:
      BigInt(Date.now() - 27 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(11),
    title: "On Craft and Intentionality",
    body: "Every word choice is a political act. You are always choosing: who gets to speak, who gets a name, who gets a body. The best writing is ruthlessly intentional about these choices.",
    createdAt:
      BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(12),
    title: "On Mental Health and the Creative Life",
    body: "Being a creative person is not a cure for suffering. But creativity has given me a vocabulary for my interior life that I could not have built any other way.",
    createdAt:
      BigInt(Date.now() - 33 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(13),
    title: "On Why Stories Matter",
    body: "Stories are not decoration. They are infrastructure. They are how communities decide what is true, what is worth keeping, and who is allowed to exist. This is why they are always contested — and why they must always be told.",
    createdAt:
      BigInt(Date.now() - 36 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
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

function VoiceCard({ voice, index }: { voice: VoicePost; index: number }) {
  const excerpt =
    voice.body.length > 180 ? `${voice.body.slice(0, 180)}…` : voice.body;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      className="group"
    >
      <Link to={`/voices/${voice.id}`} className="block h-full">
        <div className="bg-card border border-border rounded-lg p-6 h-full card-hover hover:border-accent/40 hover:shadow-literary flex flex-col">
          {/* Number + Date */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-2xl font-light text-accent/40 leading-none">
              {String(index + 1).padStart(2, "0")}
            </span>
            <time className="text-xs font-body text-muted-foreground">
              {formatDate(voice.createdAt)}
            </time>
          </div>

          {/* Decorative rule */}
          <div className="w-8 h-[1px] bg-accent/40 mb-4" />

          {/* Title */}
          <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-3 leading-snug">
            {voice.title}
          </h2>

          {/* Excerpt */}
          <p className="font-body text-sm text-muted-foreground leading-relaxed italic flex-1 line-clamp-4">
            {excerpt}
          </p>

          {/* Read CTA */}
          <div className="mt-5 flex items-center gap-2 text-xs font-body text-muted-foreground group-hover:text-accent transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            Read + View Replies
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function VoicesPage() {
  const { data: voices, isLoading } = useGetRootVoicePosts();

  const allVoices = voices && voices.length > 0 ? voices : SAMPLE_VOICES;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">
          ✦ Perspectives
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-3 tracking-wide">
          Voices
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-xl leading-relaxed italic">
          Essays, meditations, and reflections — Reena's sustained thoughts on
          writing, identity, art, and the world.
        </p>
        <div className="mt-4 w-12 h-[1.5px] bg-accent/60" />
      </motion.div>

      {/* Voices Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-lg p-6 space-y-4"
            >
              <div className="flex justify-between">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-[1px] w-8" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allVoices.map((voice, i) => (
            <VoiceCard key={voice.id.toString()} voice={voice} index={i} />
          ))}
        </div>
      )}

      {/* Load more placeholder if many */}
      {allVoices.length >= 12 && (
        <div className="text-center mt-12">
          <Button variant="outline" className="font-body">
            Load More Voices
          </Button>
        </div>
      )}
    </div>
  );
}
