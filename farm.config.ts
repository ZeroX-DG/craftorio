import { defineConfig } from "@farmfe/core";
import solid from "vite-plugin-solid";

export default defineConfig({
  compilation: {
    output: {
      publicPath: process.env.NODE_ENV === "production" ? "/craftorio/" : "/",
    },
  },
  vitePlugins: [
    () => ({
      vitePlugin: solid(),
      filters: ["\\.tsx$", "\\.jsx$"],
    }),
  ],
});
