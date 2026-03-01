import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BlogPost {
    id: bigint;
    title: string;
    body: string;
    authorNote?: string;
    publishedAt: Time;
    imageUrl?: ExternalBlob;
    category: BlogCategory;
}
export type Time = bigint;
export interface Feature {
    id: bigint;
    name: string;
    description: string;
    imageUrl?: ExternalBlob;
    externalUrl: string;
}
export interface VoicePost {
    id: bigint;
    title: string;
    body: string;
    createdAt: Time;
    parentId?: bigint;
}
export interface Publication {
    id: bigint;
    title: string;
    year: string;
    description: string;
    coverImage?: ExternalBlob;
    publicationType: PublicationType;
    externalUrl: string;
}
export interface Cause {
    id: bigint;
    name: string;
    description: string;
    imageUrl?: ExternalBlob;
    externalUrl: string;
    causeCategory: CauseCategory;
}
export interface Product {
    id: bigint;
    title: string;
    shopCategory: ShopCategory;
    createdAt: Time;
    description: string;
    imageUrl: ExternalBlob;
    fulfillmentType: FulfillmentType;
    externalUrl: string;
    price: string;
}
export interface UserProfile {
    name: string;
}
export enum BlogCategory {
    art = "art",
    letters = "letters",
    lyrics = "lyrics",
    poems = "poems",
    prose = "prose",
    quotes = "quotes",
    essays = "essays",
    photographs = "photographs"
}
export enum CauseCategory {
    earth = "earth",
    mental_health = "mental_health",
    humanity = "humanity"
}
export enum FulfillmentType {
    external_pod = "external_pod",
    digital_download = "digital_download"
}
export enum PublicationType {
    solo = "solo",
    collaboration = "collaboration",
    anthologies = "anthologies"
}
export enum ShopCategory {
    art = "art",
    creativity = "creativity",
    words = "words"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, category: BlogCategory, body: string, imageUrl: ExternalBlob | null, authorNote: string | null): Promise<bigint>;
    createCause(name: string, causeCategory: CauseCategory, description: string, imageUrl: ExternalBlob | null, externalUrl: string): Promise<bigint>;
    createFeature(name: string, description: string, imageUrl: ExternalBlob | null, externalUrl: string): Promise<bigint>;
    createProduct(title: string, shopCategory: ShopCategory, description: string, imageUrl: ExternalBlob, price: string, externalUrl: string, fulfillmentType: FulfillmentType): Promise<bigint>;
    createPublication(title: string, publicationType: PublicationType, description: string, coverImage: ExternalBlob | null, externalUrl: string, year: string): Promise<bigint>;
    createVoicePost(title: string, body: string, parentId: bigint | null): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<void>;
    deleteCause(id: bigint): Promise<void>;
    deleteFeature(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    deletePublication(id: bigint): Promise<void>;
    deleteVoicePost(id: bigint): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllCauses(): Promise<Array<Cause>>;
    getAllFeatures(): Promise<Array<Feature>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllPublications(): Promise<Array<Publication>>;
    getAllVoicePosts(): Promise<Array<VoicePost>>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getBlogPostsByCategory(category: BlogCategory): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCause(id: bigint): Promise<Cause | null>;
    getCausesByCategory(category: CauseCategory): Promise<Array<Cause>>;
    getChildVoicePosts(parentId: bigint): Promise<Array<VoicePost>>;
    getFeature(id: bigint): Promise<Feature | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByCategory(category: ShopCategory): Promise<Array<Product>>;
    getPublication(id: bigint): Promise<Publication | null>;
    getPublicationsByType(publicationType: PublicationType): Promise<Array<Publication>>;
    getRootVoicePosts(): Promise<Array<VoicePost>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVoicePost(id: bigint): Promise<VoicePost | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBlogPost(id: bigint, title: string, category: BlogCategory, body: string, imageUrl: ExternalBlob | null, authorNote: string | null): Promise<void>;
    updateCause(id: bigint, name: string, causeCategory: CauseCategory, description: string, imageUrl: ExternalBlob | null, externalUrl: string): Promise<void>;
    updateFeature(id: bigint, name: string, description: string, imageUrl: ExternalBlob | null, externalUrl: string): Promise<void>;
    updateProduct(id: bigint, title: string, shopCategory: ShopCategory, description: string, imageUrl: ExternalBlob, price: string, externalUrl: string, fulfillmentType: FulfillmentType): Promise<void>;
    updatePublication(id: bigint, title: string, publicationType: PublicationType, description: string, coverImage: ExternalBlob | null, externalUrl: string, year: string): Promise<void>;
    updateVoicePost(id: bigint, title: string, body: string, parentId: bigint | null): Promise<void>;
}
