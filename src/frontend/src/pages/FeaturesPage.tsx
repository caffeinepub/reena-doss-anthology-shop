import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Feature } from "../backend.d";
import { useGetAllFeatures } from "../hooks/useQueries";

const SAMPLE_FEATURES: Feature[] = [
  {
    id: BigInt(1),
    name: "Literary Hub",
    description:
      "Featured as an emerging voice in contemporary South Asian poetry, with an interview on craft and identity.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(2),
    name: "The Poetry Foundation",
    description:
      "Poem published and spotlighted in their weekly curated selections.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(3),
    name: "Asian American Writers Workshop",
    description:
      "Workshop leader and featured contributor in their annual publication.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(4),
    name: "Words Without Borders",
    description:
      "Featured translator and contributor bridging literary voices across languages.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(5),
    name: "Ploughshares",
    description:
      "Essays and poems selected for their special issue on diaspora and belonging.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(6),
    name: "Rattle Poetry",
    description:
      "Selected for Rattle's poet of the week feature with a spotlight on her work.",
    externalUrl: "https://www.reenadoss.com",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group bg-card border border-border rounded-lg p-6 card-hover hover:border-accent/40 hover:shadow-literary flex flex-col"
    >
      {/* Logo / Icon */}
      <div className="mb-4">
        {feature.imageUrl ? (
          <img
            src={feature.imageUrl.getDirectURL()}
            alt={feature.name}
            className="w-12 h-12 rounded object-contain"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
        {feature.name}
      </h3>

      <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">
        {feature.description}
      </p>

      <Button
        asChild
        size="sm"
        variant="outline"
        className="mt-4 font-body text-xs gap-1.5 self-start border-border hover:border-accent/40 hover:text-accent"
      >
        <a href={feature.externalUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-3 h-3" />
          Visit
        </a>
      </Button>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const { data: features, isLoading } = useGetAllFeatures();

  const allFeatures =
    features && features.length > 0 ? features : SAMPLE_FEATURES;

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
          ✦ Recognition
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-3 tracking-wide">
          Features
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-xl leading-relaxed italic">
          Communities, publications, and leaders who have spotlighted Reena's
          work and voice.
        </p>
        <div className="mt-4 w-12 h-[1.5px] bg-accent/60" />
      </motion.div>

      {/* Features Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-lg p-6 space-y-3"
            >
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-8 w-20 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allFeatures.map((feature, i) => (
            <FeatureCard
              key={feature.id.toString()}
              feature={feature}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
