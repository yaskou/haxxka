import esbuild from "esbuild";

await esbuild.build({
  bundle: true,
  entryPoints: ["./src/index.ts"],
  format: "esm",
  outdir: "./dist",
  packages: "external",
  platform: "node",
});
