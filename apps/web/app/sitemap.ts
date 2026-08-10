import type { MetadataRoute } from "next";
import { listItems } from "./registry";
import { REGISTRY_URL } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${REGISTRY_URL}/`, priority: 1 },
    { url: `${REGISTRY_URL}/components`, priority: 0.9 },
    { url: `${REGISTRY_URL}/docs`, priority: 0.8 },
    { url: `${REGISTRY_URL}/docs/installation`, priority: 0.8 },
    { url: `${REGISTRY_URL}/docs/theming`, priority: 0.7 },
    { url: `${REGISTRY_URL}/docs/mcp`, priority: 0.8 },
    ...listItems().map((i) => ({ url: `${REGISTRY_URL}/components/${i.name}`, priority: 0.6 })),
  ];
}
