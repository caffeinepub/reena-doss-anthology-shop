import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type {
  BlogCategory,
  BlogPost,
  Cause,
  CauseCategory,
  Feature,
  FulfillmentType,
  Product,
  Publication,
  PublicationType,
  ShopCategory,
  UserProfile,
  VoicePost,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Blog Posts ────────────────────────────────────────────────────

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost | null>({
    queryKey: ["blogPost", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetBlogPostsByCategory(category: BlogCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts", "category", category],
    queryFn: async () => {
      if (!actor || category === null) return [];
      return actor.getBlogPostsByCategory(category);
    },
    enabled: !!actor && !isFetching && category !== null,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      category: BlogCategory;
      body: string;
      imageUrl: ExternalBlob | null;
      authorNote: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBlogPost(
        data.title,
        data.category,
        data.body,
        data.imageUrl,
        data.authorNote,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      category: BlogCategory;
      body: string;
      imageUrl: ExternalBlob | null;
      authorNote: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBlogPost(
        data.id,
        data.title,
        data.category,
        data.body,
        data.imageUrl,
        data.authorNote,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
}

// ── Products ──────────────────────────────────────────────────────

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: ShopCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor || category === null) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && category !== null,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      shopCategory: ShopCategory;
      description: string;
      imageUrl: ExternalBlob;
      price: string;
      externalUrl: string;
      fulfillmentType: FulfillmentType;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createProduct(
        data.title,
        data.shopCategory,
        data.description,
        data.imageUrl,
        data.price,
        data.externalUrl,
        data.fulfillmentType,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      shopCategory: ShopCategory;
      description: string;
      imageUrl: ExternalBlob;
      price: string;
      externalUrl: string;
      fulfillmentType: FulfillmentType;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(
        data.id,
        data.title,
        data.shopCategory,
        data.description,
        data.imageUrl,
        data.price,
        data.externalUrl,
        data.fulfillmentType,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Auth / Profile ────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ── Publications ──────────────────────────────────────────────────

export function useGetAllPublications() {
  const { actor, isFetching } = useActor();
  return useQuery<Publication[]>({
    queryKey: ["publications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublicationsByType(type: PublicationType | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Publication[]>({
    queryKey: ["publications", "type", type],
    queryFn: async () => {
      if (!actor || type === null) return [];
      return actor.getPublicationsByType(type);
    },
    enabled: !!actor && !isFetching && type !== null,
  });
}

export function useCreatePublication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      publicationType: PublicationType;
      description: string;
      coverImage: ExternalBlob | null;
      externalUrl: string;
      year: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPublication(
        data.title,
        data.publicationType,
        data.description,
        data.coverImage,
        data.externalUrl,
        data.year,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
  });
}

export function useUpdatePublication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      publicationType: PublicationType;
      description: string;
      coverImage: ExternalBlob | null;
      externalUrl: string;
      year: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePublication(
        data.id,
        data.title,
        data.publicationType,
        data.description,
        data.coverImage,
        data.externalUrl,
        data.year,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
  });
}

export function useDeletePublication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePublication(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
  });
}

// ── Features ──────────────────────────────────────────────────────

export function useGetAllFeatures() {
  const { actor, isFetching } = useActor();
  return useQuery<Feature[]>({
    queryKey: ["features"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeatures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFeature() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      imageUrl: ExternalBlob | null;
      externalUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createFeature(
        data.name,
        data.description,
        data.imageUrl,
        data.externalUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
}

export function useUpdateFeature() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      imageUrl: ExternalBlob | null;
      externalUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateFeature(
        data.id,
        data.name,
        data.description,
        data.imageUrl,
        data.externalUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
}

export function useDeleteFeature() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFeature(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
}

// ── Causes ────────────────────────────────────────────────────────

export function useGetAllCauses() {
  const { actor, isFetching } = useActor();
  return useQuery<Cause[]>({
    queryKey: ["causes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCauses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCausesByCategory(category: CauseCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Cause[]>({
    queryKey: ["causes", "category", category],
    queryFn: async () => {
      if (!actor || category === null) return [];
      return actor.getCausesByCategory(category);
    },
    enabled: !!actor && !isFetching && category !== null,
  });
}

export function useCreateCause() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      causeCategory: CauseCategory;
      description: string;
      imageUrl: ExternalBlob | null;
      externalUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCause(
        data.name,
        data.causeCategory,
        data.description,
        data.imageUrl,
        data.externalUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
  });
}

export function useUpdateCause() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      causeCategory: CauseCategory;
      description: string;
      imageUrl: ExternalBlob | null;
      externalUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCause(
        data.id,
        data.name,
        data.causeCategory,
        data.description,
        data.imageUrl,
        data.externalUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
  });
}

export function useDeleteCause() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteCause(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
  });
}

// ── Voice Posts ───────────────────────────────────────────────────

export function useGetAllVoicePosts() {
  const { actor, isFetching } = useActor();
  return useQuery<VoicePost[]>({
    queryKey: ["voicePosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVoicePosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRootVoicePosts() {
  const { actor, isFetching } = useActor();
  return useQuery<VoicePost[]>({
    queryKey: ["voicePosts", "root"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRootVoicePosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVoicePost(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<VoicePost | null>({
    queryKey: ["voicePost", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getVoicePost(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetChildVoicePosts(parentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<VoicePost[]>({
    queryKey: ["voicePosts", "children", parentId?.toString()],
    queryFn: async () => {
      if (!actor || parentId === null) return [];
      return actor.getChildVoicePosts(parentId);
    },
    enabled: !!actor && !isFetching && parentId !== null,
  });
}

export function useCreateVoicePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      body: string;
      parentId: bigint | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createVoicePost(data.title, data.body, data.parentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voicePosts"] });
    },
  });
}

export function useUpdateVoicePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      body: string;
      parentId: bigint | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateVoicePost(
        data.id,
        data.title,
        data.body,
        data.parentId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voicePosts"] });
    },
  });
}

export function useDeleteVoicePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteVoicePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voicePosts"] });
    },
  });
}
