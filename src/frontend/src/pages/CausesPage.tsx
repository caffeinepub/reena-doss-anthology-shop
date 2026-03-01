import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Globe, Heart, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { type Cause, CauseCategory } from "../backend.d";
import { useGetAllCauses } from "../hooks/useQueries";

const SAMPLE_CAUSES: Cause[] = [
  {
    id: BigInt(1),
    name: "Ink Gladiators Green",
    causeCategory: CauseCategory.earth,
    description:
      "A community initiative connecting writers and artists to environmental advocacy through storytelling.",
    externalUrl: "https://www.inkgladiatorspress.com",
  },
  {
    id: BigInt(2),
    name: "Words for the Wild",
    causeCategory: CauseCategory.earth,
    description:
      "An anthology project raising awareness for endangered ecosystems through poetry and prose.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(3),
    name: "Riverine Voices",
    causeCategory: CauseCategory.earth,
    description:
      "A collective of writers who speak for rivers, oceans, and the waterways that sustain life.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(4),
    name: "Ink Gladiators Community",
    causeCategory: CauseCategory.humanity,
    description:
      "A global literary community built on inclusion, amplifying underrepresented voices in publishing.",
    externalUrl: "https://www.inkgladiatorspress.com",
  },
  {
    id: BigInt(5),
    name: "Diaspora Writes",
    causeCategory: CauseCategory.humanity,
    description:
      "An organisation supporting diaspora writers in finding and celebrating their authentic voices.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(6),
    name: "Borders Without Words",
    causeCategory: CauseCategory.humanity,
    description:
      "Literary programs bringing stories to refugee communities and advocating for human dignity.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(7),
    name: "Healing Through Writing",
    causeCategory: CauseCategory.mental_health,
    description:
      "A founded initiative using creative writing as a tool for mental health recovery and resilience.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(8),
    name: "The Open Page Project",
    causeCategory: CauseCategory.mental_health,
    description:
      "A safe space for writers to process trauma, grief, and healing through the written word.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(9),
    name: "Verses for Wellbeing",
    causeCategory: CauseCategory.mental_health,
    description:
      "Poetry workshops and resources supporting mental wellness in communities across South Asia.",
    externalUrl: "https://www.reenadoss.com",
  },
];

const CATEGORY_CONFIG = {
  earth: {
    label: "Earth",
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  humanity: {
    label: "Humanity",
    icon: Globe,
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  mental_health: {
    label: "Mental Health",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
} as const;

function CauseCard({
  cause,
  index,
  categoryKey,
}: {
  cause: Cause;
  index: number;
  categoryKey: keyof typeof CATEGORY_CONFIG;
}) {
  const config = CATEGORY_CONFIG[categoryKey];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group bg-card border border-border rounded-lg p-6 card-hover hover:border-accent/40 hover:shadow-literary flex flex-col"
    >
      {/* Icon */}
      <div className="mb-4">
        {cause.imageUrl ? (
          <img
            src={cause.imageUrl.getDirectURL()}
            alt={cause.name}
            className="w-12 h-12 rounded object-contain"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bg}`}
          >
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
        {cause.name}
      </h3>

      <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">
        {cause.description}
      </p>

      <Button
        asChild
        size="sm"
        variant="outline"
        className="mt-4 font-body text-xs gap-1.5 self-start border-border hover:border-accent/40 hover:text-accent"
      >
        <a href={cause.externalUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-3 h-3" />
          Learn More
        </a>
      </Button>
    </motion.div>
  );
}

function CauseGrid({
  causes,
  isLoading,
  categoryKey,
}: {
  causes: Cause[];
  isLoading: boolean;
  categoryKey: keyof typeof CATEGORY_CONFIG;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {[1, 2, 3].map((k) => (
          <div
            key={k}
            className="bg-card border border-border rounded-lg p-6 space-y-3"
          >
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-8 w-24 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (causes.length === 0) {
    return (
      <div className="mt-6 py-12 text-center bg-muted/30 rounded-lg border border-border">
        <p className="font-display text-lg text-muted-foreground">
          Coming soon
        </p>
        <p className="font-body text-sm text-muted-foreground/70 mt-1">
          Communities and organisations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
      {causes.map((cause, i) => (
        <CauseCard
          key={cause.id.toString()}
          cause={cause}
          index={i}
          categoryKey={categoryKey}
        />
      ))}
    </div>
  );
}

export default function CausesPage() {
  const { data: causes, isLoading } = useGetAllCauses();

  const allCauses = causes && causes.length > 0 ? causes : SAMPLE_CAUSES;

  const earthCauses = allCauses.filter(
    (c) =>
      (c.causeCategory as unknown as string) ===
      (CauseCategory.earth as unknown as string),
  );
  const humanityCauses = allCauses.filter(
    (c) =>
      (c.causeCategory as unknown as string) ===
      (CauseCategory.humanity as unknown as string),
  );
  const mentalHealthCauses = allCauses.filter(
    (c) =>
      (c.causeCategory as unknown as string) ===
      (CauseCategory.mental_health as unknown as string),
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">
          ✦ Advocacy & Action
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-3 tracking-wide">
          Causes
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-xl leading-relaxed italic">
          Communities, organisations, and groups founded and supported by Reena
          Doss — across Earth, Humanity, and Mental Health.
        </p>
        <div className="mt-4 w-12 h-[1.5px] bg-accent/60" />
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="earth" className="space-y-2">
        <TabsList className="font-body bg-muted">
          <TabsTrigger value="earth" className="font-body text-sm gap-1.5">
            <Leaf className="w-3.5 h-3.5" />
            Earth
          </TabsTrigger>
          <TabsTrigger value="humanity" className="font-body text-sm gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Humanity
          </TabsTrigger>
          <TabsTrigger
            value="mental_health"
            className="font-body text-sm gap-1.5"
          >
            <Heart className="w-3.5 h-3.5" />
            Mental Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earth">
          <div className="pt-2">
            <p className="font-body text-sm text-muted-foreground italic">
              Environmental initiatives connecting storytelling with advocacy
              for our planet.
            </p>
            <CauseGrid
              causes={earthCauses}
              isLoading={isLoading}
              categoryKey="earth"
            />
          </div>
        </TabsContent>

        <TabsContent value="humanity">
          <div className="pt-2">
            <p className="font-body text-sm text-muted-foreground italic">
              Communities and organisations amplifying human dignity, inclusion,
              and literary access.
            </p>
            <CauseGrid
              causes={humanityCauses}
              isLoading={isLoading}
              categoryKey="humanity"
            />
          </div>
        </TabsContent>

        <TabsContent value="mental_health">
          <div className="pt-2">
            <p className="font-body text-sm text-muted-foreground italic">
              Healing through writing — spaces where words become pathways to
              wellbeing.
            </p>
            <CauseGrid
              causes={mentalHealthCauses}
              isLoading={isLoading}
              categoryKey="mental_health"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
