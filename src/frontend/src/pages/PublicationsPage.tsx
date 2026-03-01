import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { type Publication, PublicationType } from "../backend.d";
import { useGetAllPublications } from "../hooks/useQueries";

const SAMPLE_PUBLICATIONS: Publication[] = [
  {
    id: BigInt(1),
    title: "Voices in the Margin",
    publicationType: PublicationType.anthologies,
    year: "2022",
    description:
      "A community anthology celebrating emerging voices from across South Asia and the diaspora.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(2),
    title: "The Ink Collective Vol. 3",
    publicationType: PublicationType.anthologies,
    year: "2023",
    description:
      "Fifty poets, one theme — the anthology where silence speaks louder than words.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(3),
    title: "Edges of Memory",
    publicationType: PublicationType.anthologies,
    year: "2021",
    description:
      "An anthology exploring displacement, identity, and the longing for home.",
    externalUrl: "https://www.reenadoss.com",
  },
  {
    id: BigInt(4),
    title: "Thresholds",
    publicationType: PublicationType.solo,
    year: "2020",
    description:
      "Reena's debut solo collection — poems that live at the crossing of belonging and loss.",
    externalUrl: "https://rdbooks.carrd.co/",
  },
  {
    id: BigInt(5),
    title: "Cartography of Grief",
    publicationType: PublicationType.solo,
    year: "2023",
    description:
      "A solo collection mapping the interior landscape of mourning, healing, and emergence.",
    externalUrl: "https://rdbooks.carrd.co/",
  },
  {
    id: BigInt(6),
    title: "The Grammar of Storms",
    publicationType: PublicationType.collaboration,
    year: "2022",
    description:
      "A collaborative chapbook co-written with six other poets exploring climate grief.",
    externalUrl: "https://www.inkgladiatorspress.com",
  },
  {
    id: BigInt(7),
    title: "Letters to the Unknown",
    publicationType: PublicationType.collaboration,
    year: "2021",
    description:
      "A collaborative prose-poetry collection meditating on connection across distance.",
    externalUrl: "https://www.inkgladiatorspress.com",
  },
];

function BookCard({
  pub,
  index,
}: {
  pub: Publication;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group bg-card border border-border rounded-lg overflow-hidden card-hover hover:border-accent/40 hover:shadow-literary flex flex-col"
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] bg-gradient-to-br from-muted to-card flex items-center justify-center relative overflow-hidden">
        {pub.coverImage ? (
          <img
            src={pub.coverImage.getDirectURL()}
            alt={pub.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center h-full w-full bg-gradient-to-br from-accent/5 to-muted">
            <div
              className="w-12 h-1 mb-4 rounded"
              style={{ background: "oklch(0.54 0.115 180)" }}
            />
            <p className="font-display text-sm font-light text-foreground/60 uppercase tracking-widest leading-relaxed">
              {pub.title}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-2">
              {pub.year}
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="font-body text-xs text-accent uppercase tracking-widest mb-1">
          {pub.year}
        </p>
        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
          {pub.title}
        </h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
          {pub.description}
        </p>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="mt-4 font-body text-xs gap-1.5 border-border hover:border-accent/40 hover:text-accent"
        >
          <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3" />
            View / Buy
          </a>
        </Button>
      </div>
    </motion.div>
  );
}

function SectionSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
      {[1, 2, 3, 4].map((k) => (
        <div
          key={k}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="p-5 space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-28 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  publications: Publication[];
  isLoading: boolean;
  index: number;
}

function PublicationSection({
  title,
  subtitle,
  publications,
  isLoading,
  index,
}: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-16"
    >
      <div className="mb-6">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-1">
          ✦ {subtitle}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
          {title}
        </h2>
        <div className="mt-3 w-12 h-[1.5px] bg-accent/60" />
      </div>

      {isLoading ? (
        <SectionSkeleton />
      ) : publications.length === 0 ? (
        <div className="py-12 text-center bg-muted/30 rounded-lg border border-border">
          <p className="font-display text-lg text-muted-foreground">
            Coming soon
          </p>
          <p className="font-body text-sm text-muted-foreground/70 mt-1">
            Publications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {publications.map((pub, i) => (
            <BookCard key={pub.id.toString()} pub={pub} index={i} />
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default function PublicationsPage() {
  const { data: publications, isLoading } = useGetAllPublications();

  const allPubs =
    publications && publications.length > 0
      ? publications
      : SAMPLE_PUBLICATIONS;

  const anthologies = allPubs.filter(
    (p) =>
      (p.publicationType as unknown as string) ===
      (PublicationType.anthologies as unknown as string),
  );
  const soloBooks = allPubs.filter(
    (p) =>
      (p.publicationType as unknown as string) ===
      (PublicationType.solo as unknown as string),
  );
  const collaborations = allPubs.filter(
    (p) =>
      (p.publicationType as unknown as string) ===
      (PublicationType.collaboration as unknown as string),
  );

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
          ✦ The Written Word
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-3 tracking-wide">
          Publications
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-xl leading-relaxed italic">
          A gallery of Reena Doss's published works — anthologies, solo
          collections, and collaborations.
        </p>
        <div className="mt-4 flex gap-3">
          <Badge variant="outline" className="font-body text-xs">
            {anthologies.length} Anthologies
          </Badge>
          <Badge variant="outline" className="font-body text-xs">
            {soloBooks.length} Solo Books
          </Badge>
          <Badge variant="outline" className="font-body text-xs">
            {collaborations.length} Collaborations
          </Badge>
        </div>
      </motion.div>

      {/* Sections */}
      <PublicationSection
        title="Anthologies"
        subtitle="Community Collections"
        publications={anthologies}
        isLoading={isLoading}
        index={0}
      />

      <PublicationSection
        title="My Solo Books"
        subtitle="Individual Works"
        publications={soloBooks}
        isLoading={isLoading}
        index={1}
      />

      <PublicationSection
        title="Collaboration Books"
        subtitle="Co-authored Works"
        publications={collaborations}
        isLoading={isLoading}
        index={2}
      />
    </div>
  );
}
