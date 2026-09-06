import { isUnifiedProcessor } from "@astrojs/markdown-remark";
import chartKitDocsRemark from "./remark-strip-duplicate-title.mjs";

export const chartKitMarkdownPatches = () => ({
  name: "chart-kit-markdown-patches",
  hooks: {
    "config:setup"({ addIntegration }) {
      addIntegration({
        name: "chart-kit-docs-remark",
        hooks: {
          "astro:config:setup"({ config }) {
            const processor = config.markdown.processor;
            if (!isUnifiedProcessor(processor)) {
              throw new Error(
                "Chart Kit previews require the unified Markdown processor."
              );
            }
            processor.options.remarkPlugins.push(chartKitDocsRemark);
          }
        }
      });
    }
  }
});
