import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ImagePlus,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import {
  BlogCategory,
  type BlogPost,
  type Cause,
  CauseCategory,
  type Feature,
  FulfillmentType,
  type Product,
  type Publication,
  PublicationType,
  ShopCategory,
  type VoicePost,
} from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateBlogPost,
  useCreateCause,
  useCreateFeature,
  useCreateProduct,
  useCreatePublication,
  useCreateVoicePost,
  useDeleteBlogPost,
  useDeleteCause,
  useDeleteFeature,
  useDeleteProduct,
  useDeletePublication,
  useDeleteVoicePost,
  useGetAllBlogPosts,
  useGetAllCauses,
  useGetAllFeatures,
  useGetAllProducts,
  useGetAllPublications,
  useGetRootVoicePosts,
  useIsCallerAdmin,
  useUpdateBlogPost,
  useUpdateCause,
  useUpdateFeature,
  useUpdateProduct,
  useUpdatePublication,
  useUpdateVoicePost,
} from "../hooks/useQueries";

// ── Option Arrays ────────────────────────────────────────────────

const BLOG_CATEGORIES = [
  { value: BlogCategory.poems, label: "Poems" },
  { value: BlogCategory.quotes, label: "Quotes" },
  { value: BlogCategory.art, label: "Art" },
  { value: BlogCategory.lyrics, label: "Lyrics" },
  { value: BlogCategory.essays, label: "Essays" },
  { value: BlogCategory.prose, label: "Prose" },
  { value: BlogCategory.letters, label: "Letters" },
  { value: BlogCategory.photographs, label: "Photographs" },
];

const SHOP_CATEGORIES = [
  { value: ShopCategory.words, label: "Words" },
  { value: ShopCategory.art, label: "Art" },
  { value: ShopCategory.creativity, label: "Creativity" },
];

const FULFILLMENT_TYPES = [
  { value: FulfillmentType.external_pod, label: "Print-on-Demand (External)" },
  { value: FulfillmentType.digital_download, label: "Digital Download" },
];

const PUBLICATION_TYPES = [
  { value: PublicationType.anthologies, label: "Anthologies" },
  { value: PublicationType.solo, label: "My Solo Books" },
  { value: PublicationType.collaboration, label: "Collaboration Books" },
];

const CAUSE_CATEGORIES = [
  { value: CauseCategory.earth, label: "Earth" },
  { value: CauseCategory.humanity, label: "Humanity" },
  { value: CauseCategory.mental_health, label: "Mental Health" },
];

// ── Image Upload Helper ──────────────────────────────────────────

function ImageUploadField({
  label,
  onImageSelected,
  currentUrl,
}: {
  label: string;
  onImageSelected: (blob: ExternalBlob | null) => void;
  currentUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        console.log(`Upload: ${pct}%`);
      });
      const url = URL.createObjectURL(new Blob([bytes], { type: file.type }));
      setPreview(url);
      onImageSelected(blob);
    } catch (_err) {
      toast.error("Failed to process image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-body text-sm">{label}</Label>
      {preview && (
        <div className="w-full h-32 rounded overflow-hidden bg-muted">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-body text-xs gap-1.5"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ImagePlus className="w-3.5 h-3.5" />
          )}
          {uploading
            ? "Processing…"
            : preview
              ? "Change Image"
              : "Upload Image"}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="font-body text-xs text-muted-foreground"
            onClick={() => {
              setPreview(null);
              onImageSelected(null);
            }}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Blog Post Form ───────────────────────────────────────────────

interface BlogFormState {
  title: string;
  category: BlogCategory;
  body: string;
  imageUrl: ExternalBlob | null;
  authorNote: string;
}

const defaultBlogForm: BlogFormState = {
  title: "",
  category: BlogCategory.poems,
  body: "",
  imageUrl: null,
  authorNote: "",
};

function BlogPostForm({
  initial,
  onSubmit,
  isPending,
  onClose,
}: {
  initial?: BlogFormState;
  onSubmit: (data: BlogFormState) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<BlogFormState>(initial ?? defaultBlogForm);
  const set = (key: keyof BlogFormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Enter post title"
          className="font-body"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Category *</Label>
        <Select
          value={form.category as unknown as string}
          onValueChange={(v) => set("category", v as BlogCategory)}
        >
          <SelectTrigger className="font-body">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BLOG_CATEGORIES.map((c) => (
              <SelectItem
                key={c.value as unknown as string}
                value={c.value as unknown as string}
                className="font-body"
              >
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Body *</Label>
        <Textarea
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="Write your post here…"
          className="font-body min-h-[180px] resize-y"
          required
        />
      </div>
      <ImageUploadField
        label="Featured Image (optional)"
        onImageSelected={(blob) => set("imageUrl", blob)}
      />
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Author Note (optional)</Label>
        <Input
          value={form.authorNote}
          onChange={(e) => set("authorNote", e.target.value)}
          placeholder="A brief note about this piece"
          className="font-body"
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="font-body"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="font-body">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving…" : "Save Post"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ── Product Form ─────────────────────────────────────────────────

interface ProductFormState {
  title: string;
  shopCategory: ShopCategory;
  description: string;
  imageUrl: ExternalBlob | null;
  price: string;
  externalUrl: string;
  fulfillmentType: FulfillmentType;
}

const defaultProductForm: ProductFormState = {
  title: "",
  shopCategory: ShopCategory.words,
  description: "",
  imageUrl: null,
  price: "",
  externalUrl: "",
  fulfillmentType: FulfillmentType.external_pod,
};

function ProductForm({
  initial,
  onSubmit,
  isPending,
  onClose,
}: {
  initial?: ProductFormState;
  onSubmit: (data: ProductFormState) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProductFormState>(
    initial ?? defaultProductForm,
  );
  const set = (key: keyof ProductFormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.price.trim() ||
      !form.externalUrl.trim()
    ) {
      toast.error("All fields except image are required.");
      return;
    }
    if (!form.imageUrl) {
      toast.error("Please upload a product image.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-sm">Title *</Label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Product name"
            className="font-body"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-sm">Price *</Label>
          <Input
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="e.g. $18.99"
            className="font-body"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-sm">Category *</Label>
          <Select
            value={form.shopCategory as unknown as string}
            onValueChange={(v) => set("shopCategory", v as ShopCategory)}
          >
            <SelectTrigger className="font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHOP_CATEGORIES.map((c) => (
                <SelectItem
                  key={c.value as unknown as string}
                  value={c.value as unknown as string}
                  className="font-body"
                >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-sm">Fulfillment *</Label>
          <Select
            value={form.fulfillmentType as unknown as string}
            onValueChange={(v) => set("fulfillmentType", v as FulfillmentType)}
          >
            <SelectTrigger className="font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FULFILLMENT_TYPES.map((f) => (
                <SelectItem
                  key={f.value as unknown as string}
                  value={f.value as unknown as string}
                  className="font-body"
                >
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">External URL (Buy Link) *</Label>
        <Input
          value={form.externalUrl}
          onChange={(e) => set("externalUrl", e.target.value)}
          placeholder="https://…"
          className="font-body"
          type="url"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Description *</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the product…"
          className="font-body min-h-[100px] resize-y"
          required
        />
      </div>
      <ImageUploadField
        label="Product Image *"
        onImageSelected={(blob) => set("imageUrl", blob)}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="font-body"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="font-body">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving…" : "Save Product"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ── Publication Form ─────────────────────────────────────────────

interface PublicationFormState {
  title: string;
  publicationType: PublicationType;
  description: string;
  coverImage: ExternalBlob | null;
  externalUrl: string;
  year: string;
}

const defaultPublicationForm: PublicationFormState = {
  title: "",
  publicationType: PublicationType.anthologies,
  description: "",
  coverImage: null,
  externalUrl: "",
  year: new Date().getFullYear().toString(),
};

function PublicationForm({
  initial,
  onSubmit,
  isPending,
  onClose,
}: {
  initial?: PublicationFormState;
  onSubmit: (data: PublicationFormState) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PublicationFormState>(
    initial ?? defaultPublicationForm,
  );
  const set = (key: keyof PublicationFormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.externalUrl.trim() ||
      !form.year.trim()
    ) {
      toast.error("Title, description, URL, and year are required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Publication title"
          className="font-body"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-sm">Type *</Label>
          <Select
            value={form.publicationType as unknown as string}
            onValueChange={(v) => set("publicationType", v as PublicationType)}
          >
            <SelectTrigger className="font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PUBLICATION_TYPES.map((t) => (
                <SelectItem
                  key={t.value as unknown as string}
                  value={t.value as unknown as string}
                  className="font-body"
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-sm">Year *</Label>
          <Input
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            placeholder="2024"
            className="font-body"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">External URL *</Label>
        <Input
          value={form.externalUrl}
          onChange={(e) => set("externalUrl", e.target.value)}
          placeholder="https://…"
          className="font-body"
          type="url"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Description *</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Brief description of the publication…"
          className="font-body min-h-[100px] resize-y"
          required
        />
      </div>
      <ImageUploadField
        label="Cover Image (optional)"
        onImageSelected={(blob) => set("coverImage", blob)}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="font-body"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="font-body">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving…" : "Save Publication"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ── Feature Form ─────────────────────────────────────────────────

interface FeatureFormState {
  name: string;
  description: string;
  imageUrl: ExternalBlob | null;
  externalUrl: string;
}

const defaultFeatureForm: FeatureFormState = {
  name: "",
  description: "",
  imageUrl: null,
  externalUrl: "",
};

function FeatureForm({
  initial,
  onSubmit,
  isPending,
  onClose,
}: {
  initial?: FeatureFormState;
  onSubmit: (data: FeatureFormState) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FeatureFormState>(
    initial ?? defaultFeatureForm,
  );
  const set = (key: keyof FeatureFormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.externalUrl.trim()
    ) {
      toast.error("Name, description, and URL are required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Name *</Label>
        <Input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Community or publication name"
          className="font-body"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">External URL *</Label>
        <Input
          value={form.externalUrl}
          onChange={(e) => set("externalUrl", e.target.value)}
          placeholder="https://…"
          className="font-body"
          type="url"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Description *</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What did they feature and how?"
          className="font-body min-h-[100px] resize-y"
          required
        />
      </div>
      <ImageUploadField
        label="Logo / Image (optional)"
        onImageSelected={(blob) => set("imageUrl", blob)}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="font-body"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="font-body">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving…" : "Save Feature"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ── Cause Form ───────────────────────────────────────────────────

interface CauseFormState {
  name: string;
  causeCategory: CauseCategory;
  description: string;
  imageUrl: ExternalBlob | null;
  externalUrl: string;
}

const defaultCauseForm: CauseFormState = {
  name: "",
  causeCategory: CauseCategory.earth,
  description: "",
  imageUrl: null,
  externalUrl: "",
};

function CauseForm({
  initial,
  onSubmit,
  isPending,
  onClose,
}: {
  initial?: CauseFormState;
  onSubmit: (data: CauseFormState) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CauseFormState>(initial ?? defaultCauseForm);
  const set = (key: keyof CauseFormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.externalUrl.trim()
    ) {
      toast.error("Name, description, and URL are required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Name *</Label>
        <Input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Organisation or community name"
          className="font-body"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-sm">Category *</Label>
          <Select
            value={form.causeCategory as unknown as string}
            onValueChange={(v) => set("causeCategory", v as CauseCategory)}
          >
            <SelectTrigger className="font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAUSE_CATEGORIES.map((c) => (
                <SelectItem
                  key={c.value as unknown as string}
                  value={c.value as unknown as string}
                  className="font-body"
                >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-sm">External URL *</Label>
          <Input
            value={form.externalUrl}
            onChange={(e) => set("externalUrl", e.target.value)}
            placeholder="https://…"
            className="font-body"
            type="url"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Description *</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the cause or organisation…"
          className="font-body min-h-[100px] resize-y"
          required
        />
      </div>
      <ImageUploadField
        label="Logo / Image (optional)"
        onImageSelected={(blob) => set("imageUrl", blob)}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="font-body"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="font-body">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving…" : "Save Cause"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ── Voice Post Form ──────────────────────────────────────────────

interface VoiceFormState {
  title: string;
  body: string;
  parentId: string;
}

const defaultVoiceForm: VoiceFormState = {
  title: "",
  body: "",
  parentId: "",
};

function VoicePostForm({
  initial,
  onSubmit,
  isPending,
  onClose,
}: {
  initial?: VoiceFormState;
  onSubmit: (data: VoiceFormState) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<VoiceFormState>(initial ?? defaultVoiceForm);
  const set = (key: keyof VoiceFormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Voice post title"
          className="font-body"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">Body *</Label>
        <Textarea
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="Write your voice post here…"
          className="font-body min-h-[180px] resize-y"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-sm">
          Parent Post ID (optional — for sub-posts)
        </Label>
        <Input
          value={form.parentId}
          onChange={(e) => set("parentId", e.target.value)}
          placeholder="Leave blank for a top-level post, or enter ID of parent post"
          className="font-body"
        />
        <p className="text-xs text-muted-foreground font-body">
          Leave blank to create a main voice post. Enter a parent post's numeric
          ID to create a reply/sub-post.
        </p>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="font-body"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="font-body">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving…" : "Save Voice Post"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ── Delete Confirm Dialog ────────────────────────────────────────

function DeleteConfirm({
  title,
  onConfirm,
}: {
  title: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="font-body gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">
            Delete Item
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body">
            Are you sure you want to delete "{title}"? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="font-body bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  const { data: posts, isLoading: postsLoading } = useGetAllBlogPosts();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const { data: publications, isLoading: publicationsLoading } =
    useGetAllPublications();
  const { data: features, isLoading: featuresLoading } = useGetAllFeatures();
  const { data: causes, isLoading: causesLoading } = useGetAllCauses();
  const { data: voices, isLoading: voicesLoading } = useGetRootVoicePosts();

  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createPublication = useCreatePublication();
  const updatePublication = useUpdatePublication();
  const deletePublication = useDeletePublication();
  const createFeature = useCreateFeature();
  const updateFeature = useUpdateFeature();
  const deleteFeature = useDeleteFeature();
  const createCause = useCreateCause();
  const updateCause = useUpdateCause();
  const deleteCause = useDeleteCause();
  const createVoice = useCreateVoicePost();
  const updateVoice = useUpdateVoicePost();
  const deleteVoice = useDeleteVoicePost();

  // Dialog state
  const [blogCreateOpen, setBlogCreateOpen] = useState(false);
  const [blogEditPost, setBlogEditPost] = useState<BlogPost | null>(null);
  const [productCreateOpen, setProductCreateOpen] = useState(false);
  const [productEditItem, setProductEditItem] = useState<Product | null>(null);
  const [pubCreateOpen, setPubCreateOpen] = useState(false);
  const [pubEditItem, setPubEditItem] = useState<Publication | null>(null);
  const [featCreateOpen, setFeatCreateOpen] = useState(false);
  const [featEditItem, setFeatEditItem] = useState<Feature | null>(null);
  const [causeCreateOpen, setCauseCreateOpen] = useState(false);
  const [causeEditItem, setCauseEditItem] = useState<Cause | null>(null);
  const [voiceCreateOpen, setVoiceCreateOpen] = useState(false);
  const [voiceEditItem, setVoiceEditItem] = useState<VoicePost | null>(null);

  // ── Auth Guards ─────────────────────────────────────────────────
  if (!identity) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold mb-3">
          Admin Access Required
        </h1>
        <p className="font-body text-muted-foreground max-w-sm">
          Please sign in with your admin account to access the dashboard.
        </p>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
        <p className="font-body text-muted-foreground">
          Verifying admin access…
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-3xl font-semibold mb-3">
          Access Denied
        </h1>
        <p className="font-body text-muted-foreground max-w-sm">
          Your account does not have admin privileges.
        </p>
      </div>
    );
  }

  // ── Handlers: Blog Posts ────────────────────────────────────────

  const handleCreatePost = async (data: BlogFormState) => {
    try {
      await createPost.mutateAsync({
        title: data.title,
        category: data.category,
        body: data.body,
        imageUrl: data.imageUrl,
        authorNote: data.authorNote.trim() || null,
      });
      toast.success("Post created!");
      setBlogCreateOpen(false);
    } catch {
      toast.error("Failed to create post.");
    }
  };

  const handleEditPost = async (data: BlogFormState) => {
    if (!blogEditPost) return;
    try {
      await updatePost.mutateAsync({
        id: blogEditPost.id,
        title: data.title,
        category: data.category,
        body: data.body,
        imageUrl: data.imageUrl,
        authorNote: data.authorNote.trim() || null,
      });
      toast.success("Post updated!");
      setBlogEditPost(null);
    } catch {
      toast.error("Failed to update post.");
    }
  };

  const handleDeletePost = async (id: bigint) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  // ── Handlers: Products ──────────────────────────────────────────

  const handleCreateProduct = async (data: ProductFormState) => {
    if (!data.imageUrl) return;
    try {
      await createProduct.mutateAsync({
        title: data.title,
        shopCategory: data.shopCategory,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        externalUrl: data.externalUrl,
        fulfillmentType: data.fulfillmentType,
      });
      toast.success("Product created!");
      setProductCreateOpen(false);
    } catch {
      toast.error("Failed to create product.");
    }
  };

  const handleEditProduct = async (data: ProductFormState) => {
    if (!productEditItem || !data.imageUrl) return;
    try {
      await updateProduct.mutateAsync({
        id: productEditItem.id,
        title: data.title,
        shopCategory: data.shopCategory,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        externalUrl: data.externalUrl,
        fulfillmentType: data.fulfillmentType,
      });
      toast.success("Product updated!");
      setProductEditItem(null);
    } catch {
      toast.error("Failed to update product.");
    }
  };

  const handleDeleteProduct = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  // ── Handlers: Publications ──────────────────────────────────────

  const handleCreatePublication = async (data: PublicationFormState) => {
    try {
      await createPublication.mutateAsync({
        title: data.title,
        publicationType: data.publicationType,
        description: data.description,
        coverImage: data.coverImage,
        externalUrl: data.externalUrl,
        year: data.year,
      });
      toast.success("Publication created!");
      setPubCreateOpen(false);
    } catch {
      toast.error("Failed to create publication.");
    }
  };

  const handleEditPublication = async (data: PublicationFormState) => {
    if (!pubEditItem) return;
    try {
      await updatePublication.mutateAsync({
        id: pubEditItem.id,
        title: data.title,
        publicationType: data.publicationType,
        description: data.description,
        coverImage: data.coverImage,
        externalUrl: data.externalUrl,
        year: data.year,
      });
      toast.success("Publication updated!");
      setPubEditItem(null);
    } catch {
      toast.error("Failed to update publication.");
    }
  };

  const handleDeletePublication = async (id: bigint) => {
    try {
      await deletePublication.mutateAsync(id);
      toast.success("Publication deleted.");
    } catch {
      toast.error("Failed to delete publication.");
    }
  };

  // ── Handlers: Features ──────────────────────────────────────────

  const handleCreateFeature = async (data: FeatureFormState) => {
    try {
      await createFeature.mutateAsync({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        externalUrl: data.externalUrl,
      });
      toast.success("Feature created!");
      setFeatCreateOpen(false);
    } catch {
      toast.error("Failed to create feature.");
    }
  };

  const handleEditFeature = async (data: FeatureFormState) => {
    if (!featEditItem) return;
    try {
      await updateFeature.mutateAsync({
        id: featEditItem.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        externalUrl: data.externalUrl,
      });
      toast.success("Feature updated!");
      setFeatEditItem(null);
    } catch {
      toast.error("Failed to update feature.");
    }
  };

  const handleDeleteFeature = async (id: bigint) => {
    try {
      await deleteFeature.mutateAsync(id);
      toast.success("Feature deleted.");
    } catch {
      toast.error("Failed to delete feature.");
    }
  };

  // ── Handlers: Causes ───────────────────────────────────────────

  const handleCreateCause = async (data: CauseFormState) => {
    try {
      await createCause.mutateAsync({
        name: data.name,
        causeCategory: data.causeCategory,
        description: data.description,
        imageUrl: data.imageUrl,
        externalUrl: data.externalUrl,
      });
      toast.success("Cause created!");
      setCauseCreateOpen(false);
    } catch {
      toast.error("Failed to create cause.");
    }
  };

  const handleEditCause = async (data: CauseFormState) => {
    if (!causeEditItem) return;
    try {
      await updateCause.mutateAsync({
        id: causeEditItem.id,
        name: data.name,
        causeCategory: data.causeCategory,
        description: data.description,
        imageUrl: data.imageUrl,
        externalUrl: data.externalUrl,
      });
      toast.success("Cause updated!");
      setCauseEditItem(null);
    } catch {
      toast.error("Failed to update cause.");
    }
  };

  const handleDeleteCause = async (id: bigint) => {
    try {
      await deleteCause.mutateAsync(id);
      toast.success("Cause deleted.");
    } catch {
      toast.error("Failed to delete cause.");
    }
  };

  // ── Handlers: Voices ───────────────────────────────────────────

  const handleCreateVoice = async (data: VoiceFormState) => {
    try {
      const parentId = data.parentId.trim()
        ? BigInt(data.parentId.trim())
        : null;
      await createVoice.mutateAsync({
        title: data.title,
        body: data.body,
        parentId,
      });
      toast.success("Voice post created!");
      setVoiceCreateOpen(false);
    } catch {
      toast.error("Failed to create voice post.");
    }
  };

  const handleEditVoice = async (data: VoiceFormState) => {
    if (!voiceEditItem) return;
    try {
      const parentId = data.parentId.trim()
        ? BigInt(data.parentId.trim())
        : null;
      await updateVoice.mutateAsync({
        id: voiceEditItem.id,
        title: data.title,
        body: data.body,
        parentId,
      });
      toast.success("Voice post updated!");
      setVoiceEditItem(null);
    } catch {
      toast.error("Failed to update voice post.");
    }
  };

  const handleDeleteVoice = async (id: bigint) => {
    try {
      await deleteVoice.mutateAsync(id);
      toast.success("Voice post deleted.");
    } catch {
      toast.error("Failed to delete voice post.");
    }
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-accent" />
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Admin Dashboard
          </p>
        </div>
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Manage Content
        </h1>
      </motion.div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="font-body flex-wrap h-auto gap-1">
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="causes">Causes</TabsTrigger>
          <TabsTrigger value="voices">Voices</TabsTrigger>
        </TabsList>

        {/* ── Blog Posts Tab ──────────────────────────────────────── */}
        <TabsContent value="posts" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Blog Posts ({posts?.length ?? 0})
            </h2>
            <Dialog open={blogCreateOpen} onOpenChange={setBlogCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="font-body gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Create Blog Post
                  </DialogTitle>
                </DialogHeader>
                <BlogPostForm
                  onSubmit={handleCreatePost}
                  isPending={createPost.isPending}
                  onClose={() => setBlogCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          {postsLoading ? (
            <div className="space-y-3">
              {["b1", "b2", "b3"].map((k) => (
                <div
                  key={k}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-16" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
              <p className="font-display text-lg text-muted-foreground mb-1">
                No posts yet
              </p>
              <p className="font-body text-sm text-muted-foreground/70">
                Create your first blog post using the button above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id.toString()}
                  className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-border transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground truncate">
                      {post.title}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-body text-xs capitalize shrink-0"
                  >
                    {post.category as unknown as string}
                  </Badge>
                  <div className="flex items-center gap-2 shrink-0">
                    <Dialog
                      open={blogEditPost?.id === post.id}
                      onOpenChange={(open) => !open && setBlogEditPost(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-body gap-1.5"
                          onClick={() => setBlogEditPost(post)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-display">
                            Edit Post
                          </DialogTitle>
                        </DialogHeader>
                        {blogEditPost && (
                          <BlogPostForm
                            initial={{
                              title: blogEditPost.title,
                              category: blogEditPost.category,
                              body: blogEditPost.body,
                              imageUrl: null,
                              authorNote: blogEditPost.authorNote ?? "",
                            }}
                            onSubmit={handleEditPost}
                            isPending={updatePost.isPending}
                            onClose={() => setBlogEditPost(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <DeleteConfirm
                      title={post.title}
                      onConfirm={() => handleDeletePost(post.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Products Tab ────────────────────────────────────────── */}
        <TabsContent value="products" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Products ({products?.length ?? 0})
            </h2>
            <Dialog
              open={productCreateOpen}
              onOpenChange={setProductCreateOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="font-body gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Create Product
                  </DialogTitle>
                </DialogHeader>
                <ProductForm
                  onSubmit={handleCreateProduct}
                  isPending={createProduct.isPending}
                  onClose={() => setProductCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          {productsLoading ? (
            <div className="space-y-3">
              {["p1", "p2", "p3"].map((k) => (
                <div
                  key={k}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Skeleton className="w-10 h-10 rounded" />
                  <Skeleton className="h-5 w-48" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
              <p className="font-display text-lg text-muted-foreground mb-1">
                No products yet
              </p>
              <p className="font-body text-sm text-muted-foreground/70">
                Add your first product using the button above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const imageUrl =
                  product.imageUrl &&
                  typeof product.imageUrl === "object" &&
                  "getDirectURL" in product.imageUrl
                    ? (
                        product.imageUrl as { getDirectURL: () => string }
                      ).getDirectURL()
                    : null;
                return (
                  <div
                    key={product.id.toString()}
                    className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg"
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-foreground truncate">
                        {product.title}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        {product.price}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="font-body text-xs capitalize shrink-0"
                    >
                      {product.shopCategory as unknown as string}
                    </Badge>
                    <div className="flex items-center gap-2 shrink-0">
                      <Dialog
                        open={productEditItem?.id === product.id}
                        onOpenChange={(open) =>
                          !open && setProductEditItem(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="font-body gap-1.5"
                            onClick={() => setProductEditItem(product)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-display">
                              Edit Product
                            </DialogTitle>
                          </DialogHeader>
                          {productEditItem && (
                            <ProductForm
                              initial={{
                                title: productEditItem.title,
                                shopCategory: productEditItem.shopCategory,
                                description: productEditItem.description,
                                imageUrl: null,
                                price: productEditItem.price,
                                externalUrl: productEditItem.externalUrl,
                                fulfillmentType:
                                  productEditItem.fulfillmentType,
                              }}
                              onSubmit={handleEditProduct}
                              isPending={updateProduct.isPending}
                              onClose={() => setProductEditItem(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <DeleteConfirm
                        title={product.title}
                        onConfirm={() => handleDeleteProduct(product.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── Publications Tab ────────────────────────────────────── */}
        <TabsContent value="publications" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Publications ({publications?.length ?? 0})
            </h2>
            <Dialog open={pubCreateOpen} onOpenChange={setPubCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="font-body gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Publication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Create Publication
                  </DialogTitle>
                </DialogHeader>
                <PublicationForm
                  onSubmit={handleCreatePublication}
                  isPending={createPublication.isPending}
                  onClose={() => setPubCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          {publicationsLoading ? (
            <div className="space-y-3">
              {["pu1", "pu2"].map((k) => (
                <div
                  key={k}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Skeleton className="h-5 w-48" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : !publications || publications.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
              <p className="font-display text-lg text-muted-foreground mb-1">
                No publications yet
              </p>
              <p className="font-body text-sm text-muted-foreground/70">
                Add your first publication using the button above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {publications.map((pub) => (
                <div
                  key={pub.id.toString()}
                  className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground truncate">
                      {pub.title}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {pub.year}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-body text-xs capitalize shrink-0"
                  >
                    {pub.publicationType as unknown as string}
                  </Badge>
                  <div className="flex items-center gap-2 shrink-0">
                    <Dialog
                      open={pubEditItem?.id === pub.id}
                      onOpenChange={(open) => !open && setPubEditItem(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-body gap-1.5"
                          onClick={() => setPubEditItem(pub)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-display">
                            Edit Publication
                          </DialogTitle>
                        </DialogHeader>
                        {pubEditItem && (
                          <PublicationForm
                            initial={{
                              title: pubEditItem.title,
                              publicationType: pubEditItem.publicationType,
                              description: pubEditItem.description,
                              coverImage: null,
                              externalUrl: pubEditItem.externalUrl,
                              year: pubEditItem.year,
                            }}
                            onSubmit={handleEditPublication}
                            isPending={updatePublication.isPending}
                            onClose={() => setPubEditItem(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <DeleteConfirm
                      title={pub.title}
                      onConfirm={() => handleDeletePublication(pub.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Features Tab ────────────────────────────────────────── */}
        <TabsContent value="features" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Features ({features?.length ?? 0})
            </h2>
            <Dialog open={featCreateOpen} onOpenChange={setFeatCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="font-body gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Feature
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Add Feature
                  </DialogTitle>
                </DialogHeader>
                <FeatureForm
                  onSubmit={handleCreateFeature}
                  isPending={createFeature.isPending}
                  onClose={() => setFeatCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          {featuresLoading ? (
            <div className="space-y-3">
              {["f1", "f2"].map((k) => (
                <div
                  key={k}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Skeleton className="h-5 w-48" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : !features || features.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
              <p className="font-display text-lg text-muted-foreground mb-1">
                No features yet
              </p>
              <p className="font-body text-sm text-muted-foreground/70">
                Add communities and leaders who have featured you.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {features.map((feat) => (
                <div
                  key={feat.id.toString()}
                  className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground truncate">
                      {feat.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {feat.externalUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Dialog
                      open={featEditItem?.id === feat.id}
                      onOpenChange={(open) => !open && setFeatEditItem(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-body gap-1.5"
                          onClick={() => setFeatEditItem(feat)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-display">
                            Edit Feature
                          </DialogTitle>
                        </DialogHeader>
                        {featEditItem && (
                          <FeatureForm
                            initial={{
                              name: featEditItem.name,
                              description: featEditItem.description,
                              imageUrl: null,
                              externalUrl: featEditItem.externalUrl,
                            }}
                            onSubmit={handleEditFeature}
                            isPending={updateFeature.isPending}
                            onClose={() => setFeatEditItem(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <DeleteConfirm
                      title={feat.name}
                      onConfirm={() => handleDeleteFeature(feat.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Causes Tab ──────────────────────────────────────────── */}
        <TabsContent value="causes" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Causes ({causes?.length ?? 0})
            </h2>
            <Dialog open={causeCreateOpen} onOpenChange={setCauseCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="font-body gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Cause
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">Add Cause</DialogTitle>
                </DialogHeader>
                <CauseForm
                  onSubmit={handleCreateCause}
                  isPending={createCause.isPending}
                  onClose={() => setCauseCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          {causesLoading ? (
            <div className="space-y-3">
              {["c1", "c2"].map((k) => (
                <div
                  key={k}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Skeleton className="h-5 w-48" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : !causes || causes.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
              <p className="font-display text-lg text-muted-foreground mb-1">
                No causes yet
              </p>
              <p className="font-body text-sm text-muted-foreground/70">
                Add your Earth, Humanity, or Mental Health causes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {causes.map((cause) => (
                <div
                  key={cause.id.toString()}
                  className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground truncate">
                      {cause.name}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-body text-xs capitalize shrink-0"
                  >
                    {(cause.causeCategory as unknown as string).replace(
                      "_",
                      " ",
                    )}
                  </Badge>
                  <div className="flex items-center gap-2 shrink-0">
                    <Dialog
                      open={causeEditItem?.id === cause.id}
                      onOpenChange={(open) => !open && setCauseEditItem(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-body gap-1.5"
                          onClick={() => setCauseEditItem(cause)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-display">
                            Edit Cause
                          </DialogTitle>
                        </DialogHeader>
                        {causeEditItem && (
                          <CauseForm
                            initial={{
                              name: causeEditItem.name,
                              causeCategory: causeEditItem.causeCategory,
                              description: causeEditItem.description,
                              imageUrl: null,
                              externalUrl: causeEditItem.externalUrl,
                            }}
                            onSubmit={handleEditCause}
                            isPending={updateCause.isPending}
                            onClose={() => setCauseEditItem(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <DeleteConfirm
                      title={cause.name}
                      onConfirm={() => handleDeleteCause(cause.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Voices Tab ──────────────────────────────────────────── */}
        <TabsContent value="voices" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Voice Posts ({voices?.length ?? 0})
            </h2>
            <Dialog open={voiceCreateOpen} onOpenChange={setVoiceCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="font-body gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Voice Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Create Voice Post
                  </DialogTitle>
                </DialogHeader>
                <VoicePostForm
                  onSubmit={handleCreateVoice}
                  isPending={createVoice.isPending}
                  onClose={() => setVoiceCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          {voicesLoading ? (
            <div className="space-y-3">
              {["v1", "v2", "v3"].map((k) => (
                <div
                  key={k}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Skeleton className="h-5 w-48" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : !voices || voices.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
              <p className="font-display text-lg text-muted-foreground mb-1">
                No voice posts yet
              </p>
              <p className="font-body text-sm text-muted-foreground/70">
                Create your first voice post using the button above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {voices.map((voice) => (
                <div
                  key={voice.id.toString()}
                  className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground truncate">
                      {voice.title}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      ID: {voice.id.toString()}
                      {voice.parentId !== undefined && voice.parentId !== null
                        ? ` · Reply to: ${voice.parentId.toString()}`
                        : " · Top-level"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Dialog
                      open={voiceEditItem?.id === voice.id}
                      onOpenChange={(open) => !open && setVoiceEditItem(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-body gap-1.5"
                          onClick={() => setVoiceEditItem(voice)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-display">
                            Edit Voice Post
                          </DialogTitle>
                        </DialogHeader>
                        {voiceEditItem && (
                          <VoicePostForm
                            initial={{
                              title: voiceEditItem.title,
                              body: voiceEditItem.body,
                              parentId:
                                voiceEditItem.parentId?.toString() ?? "",
                            }}
                            onSubmit={handleEditVoice}
                            isPending={updateVoice.isPending}
                            onClose={() => setVoiceEditItem(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <DeleteConfirm
                      title={voice.title}
                      onConfirm={() => handleDeleteVoice(voice.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
