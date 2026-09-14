import { nodeResolve } from "@rollup/plugin-node-resolve";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/js/index.js",
  output: {
    dir: "../../public/experiments/a-measure-of-days/js",
    entryFileNames: "index.js",
    chunkFileNames: "routes/[name]-[hash].js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    nodeResolve(),
    dynamicImportVars(),
    terser({ format: { comments: false } }),
  ],
};
