import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 / Turbopack waehlt sonst den Eltern-Ordner als Workspace-Root,
  // wenn dort mehrere Geschwister-Projekte liegen (C:\projekte\webseiten\*).
  // Folge: CSS-Module wie tailwindcss werden aus dem Eltern-node_modules
  // gesucht und der Build bricht ab. Siehe webseiten/CLAUDE.md Abschnitt 15.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
