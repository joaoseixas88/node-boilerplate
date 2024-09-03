import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./server.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  minify: true,
  minifyWhitespace: true,
});
