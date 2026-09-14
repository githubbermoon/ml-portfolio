import path from "node:path";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/_components/**/*.webc"],
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp", "jpeg"],
    widths: ["auto", 480, 960, 1600],
    outputDir: "../../public/experiments/a-measure-of-days/img",
    urlPath: "/experiments/a-measure-of-days/img/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "100vw",
    },
    filenameFormat(id, src, width, format) {
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}w.${format}`;
    },
    sharpOptions: {
      animated: true,
      limitInputPixels: false,
    },
  });

  const markdown = markdownIt({ html: true, typographer: true })
    .use(markdownItAnchor, { permalink: markdownItAnchor.permalink.ariaHidden({ placement: "after" }) });
  eleventyConfig.setLibrary("md", markdown);

  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });
  eleventyConfig.ignores.add("src/fonts/**");
  eleventyConfig.addWatchTarget("src/scss/**/*");
  eleventyConfig.addWatchTarget("src/js/**/*");

  return {
    pathPrefix: "/experiments/a-measure-of-days/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "../../public/experiments/a-measure-of-days",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
