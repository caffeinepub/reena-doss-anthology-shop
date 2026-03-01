import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { FulfillmentType, type Product, ShopCategory } from "../backend.d";
import { useGetProductsByCategory } from "../hooks/useQueries";

const CATEGORY_META: Record<
  string,
  { label: string; description: string; color: string }
> = {
  words: {
    label: "Words",
    description:
      "Poetry collections, anthologies, chapbooks, and literary prints.",
    color: "text-foreground",
  },
  art: {
    label: "Art",
    description: "Limited edition art prints, canvases, and framed works.",
    color: "text-foreground",
  },
  creativity: {
    label: "Creativity",
    description:
      "Mugs, apparel, journals, and lifestyle products with literary themes.",
    color: "text-foreground",
  },
};

const SAMPLE_PRODUCTS: Record<string, Product[]> = {
  words: [
    {
      id: BigInt(1),
      title: "Echoes in Ink — Anthology Volume I",
      shopCategory: ShopCategory.words,
      description:
        "Reena's debut poetry anthology, featuring 60 poems across four years of writing. Printed on quality paper with a linen-textured cover. Available via Amazon KDP.",
      imageUrl: {
        getDirectURL: () =>
          "/assets/generated/sample-product-book.dim_600x600.jpg",
      } as unknown as Product["imageUrl"],
      price: "$18.99",
      externalUrl: "https://rdbooks.carrd.co/",
      fulfillmentType: FulfillmentType.external_pod,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
    {
      id: BigInt(2),
      title: "Thresholds — PDF Poetry Collection",
      shopCategory: ShopCategory.words,
      description:
        "Digital PDF edition of Thresholds, a collection of 28 poems about grief, memory, and transformation. Instant download after purchase.",
      imageUrl: {
        getDirectURL: () =>
          "/assets/generated/sample-poem-book.dim_800x500.jpg",
      } as unknown as Product["imageUrl"],
      price: "$7.00",
      externalUrl: "https://rdbooks.carrd.co/",
      fulfillmentType: FulfillmentType.digital_download,
      createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
    },
    {
      id: BigInt(3),
      title: "The Grammar of Loss — Chapbook",
      shopCategory: ShopCategory.words,
      description:
        "A limited-run chapbook exploring language and grief. Saddle-stitched, 32 pages, hand-numbered edition of 150. Fulfilled by Printful.",
      imageUrl: {
        getDirectURL: () =>
          "/assets/generated/sample-product-book.dim_600x600.jpg",
      } as unknown as Product["imageUrl"],
      price: "$12.00",
      externalUrl: "https://rdbooks.carrd.co/",
      fulfillmentType: FulfillmentType.external_pod,
      createdAt: BigInt(Date.now() - 172800000) * BigInt(1_000_000),
    },
  ],
  art: [
    {
      id: BigInt(4),
      title: "Meridian — Giclee Art Print",
      shopCategory: ShopCategory.art,
      description:
        "Fine art print of the mixed media work Meridian (2023). Printed on archival matte paper, available in 8×10 and 12×16 sizes via Society6.",
      imageUrl: {
        getDirectURL: () =>
          "/assets/generated/sample-product-artprint.dim_600x600.jpg",
      } as unknown as Product["imageUrl"],
      price: "From $24.00",
      externalUrl: "https://www.reenadoss.com",
      fulfillmentType: FulfillmentType.external_pod,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
    {
      id: BigInt(5),
      title: "Ink Wash Series — Digital Artpack",
      shopCategory: ShopCategory.art,
      description:
        "Set of 12 high-resolution digital art files from the Ink Wash Series (2022–2024). Suitable for personal printing up to A2 size.",
      imageUrl: {
        getDirectURL: () => "/assets/generated/sample-art-ink.dim_800x500.jpg",
      } as unknown as Product["imageUrl"],
      price: "$15.00",
      externalUrl: "https://www.reenadoss.com",
      fulfillmentType: FulfillmentType.digital_download,
      createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
    },
  ],
  creativity: [
    {
      id: BigInt(6),
      title: '"Write Anyway" Ceramic Mug',
      shopCategory: ShopCategory.creativity,
      description:
        '11oz ceramic mug with the phrase "Write Anyway" in Reena\'s handwriting. Dishwasher safe, printed via Printful on demand.',
      imageUrl: {
        getDirectURL: () => "/assets/generated/sample-art-ink.dim_800x500.jpg",
      } as unknown as Product["imageUrl"],
      price: "$19.99",
      externalUrl: "https://www.reenadoss.com",
      fulfillmentType: FulfillmentType.external_pod,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
    {
      id: BigInt(7),
      title: "Literary Gladiator — Tote Bag",
      shopCategory: ShopCategory.creativity,
      description:
        "Heavy-duty canvas tote with Ink Gladiators Press artwork. Eco-friendly printing. Ships from Printify fulfillment centers worldwide.",
      imageUrl: {
        getDirectURL: () =>
          "/assets/generated/sample-product-artprint.dim_600x600.jpg",
      } as unknown as Product["imageUrl"],
      price: "$22.00",
      externalUrl: "https://www.inkgladiatorspress.com",
      fulfillmentType: FulfillmentType.external_pod,
      createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
    },
  ],
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const isDigital =
    product.fulfillmentType === FulfillmentType.digital_download;
  const imageUrl =
    product.imageUrl &&
    typeof product.imageUrl === "object" &&
    "getDirectURL" in product.imageUrl
      ? (product.imageUrl as { getDirectURL: () => string }).getDirectURL()
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group bg-card border border-border/60 rounded-lg overflow-hidden card-hover hover:border-accent/40 hover:shadow-literary flex flex-col"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Fulfillment badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={
              isDigital
                ? "text-xs bg-foreground/5 text-foreground/70 border-foreground/20"
                : "text-xs bg-foreground/5 text-muted-foreground border-border/60"
            }
          >
            {isDigital ? "Digital Download" : "Print-on-Demand"}
          </Badge>
        </div>

        <h3 className="font-display text-base font-semibold text-foreground mb-2 leading-snug">
          {product.title}
        </h3>

        <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
          <span className="font-display text-lg font-semibold text-foreground">
            {product.price}
          </span>
          <Button asChild size="sm" className="font-body gap-1.5">
            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopCategoryPage() {
  const { category } = useParams({ strict: false }) as { category: string };
  const shopCategory =
    category === "words"
      ? ShopCategory.words
      : category === "art"
        ? ShopCategory.art
        : category === "creativity"
          ? ShopCategory.creativity
          : null;

  const { data: products, isLoading } = useGetProductsByCategory(shopCategory);

  const meta = CATEGORY_META[category] || {
    label: category,
    description: "",
    color: "text-foreground",
  };

  const displayProducts =
    products && products.length > 0
      ? products
      : SAMPLE_PRODUCTS[category] || [];

  return (
    <div>
      {/* Header */}
      <section className="border-b border-border/50 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 font-body text-sm text-muted-foreground hover:text-foreground"
          >
            <Link to="/shop" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </Link>
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2">
              ✦ Shop
            </p>
            <h1
              className={`font-display text-4xl sm:text-5xl font-semibold mb-3 ${meta.color}`}
            >
              {meta.label}
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-xl">
              {meta.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {["p1", "p2", "p3", "p4", "p5", "p6"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border/60 rounded-lg overflow-hidden"
              >
                <Skeleton className="aspect-square w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="font-display text-2xl text-muted-foreground mb-2">
              No products yet in this category.
            </p>
            <p className="font-body text-sm text-muted-foreground/70">
              Check back soon — new items are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayProducts.map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* Fulfillment note */}
      <section className="container mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-muted/50 border border-border/40 rounded-lg p-5 max-w-2xl">
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Note:</strong> All "Buy" buttons
            open the external merchant's store in a new tab. Reena does not
            process payments directly — fulfillment is handled by the respective
            merchant (Amazon, Society6, Printful, Printify, etc.).
          </p>
        </div>
      </section>
    </div>
  );
}
