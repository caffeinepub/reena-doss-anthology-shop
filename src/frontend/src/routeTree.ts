import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import CausesPage from "./pages/CausesPage";
import FeaturesPage from "./pages/FeaturesPage";
import HomePage from "./pages/HomePage";
import PublicationsPage from "./pages/PublicationsPage";
import ShopCategoryPage from "./pages/ShopCategoryPage";
import ShopPage from "./pages/ShopPage";
import VoicePostPage from "./pages/VoicePostPage";
import VoicesPage from "./pages/VoicesPage";

const rootRoute = createRootRoute({
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogListPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogPostPage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const shopCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop/$category",
  component: ShopCategoryPage,
});

const publicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/publications",
  component: PublicationsPage,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/features",
  component: FeaturesPage,
});

const causesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/causes",
  component: CausesPage,
});

const voicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/voices",
  component: VoicesPage,
});

const voicePostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/voices/$id",
  component: VoicePostPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  blogRoute,
  blogPostRoute,
  shopRoute,
  shopCategoryRoute,
  publicationsRoute,
  featuresRoute,
  causesRoute,
  voicesRoute,
  voicePostRoute,
  adminRoute,
]);

export { createRouter };
