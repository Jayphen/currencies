import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    !process.env.VITEST && remixCloudflareDevProxy(),
    !process.env.VITEST &&
      remix({
        ignoredRouteFiles: ["**/*.css"],
      }),
    tsconfigPaths(),
  ],
  test: {
    environment: "jsdom",
  },
});
