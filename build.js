import { nodeResolve } from "@rollup/plugin-node-resolve";
import { rollup } from "rollup";
import { swc } from "rollup-plugin-swc3";

/** GAS向けに export 構文を除去するプラグイン */
function gasPlugin() {
	return {
		name: "gas",
		renderChunk(code) {
			return {
				code: code
					.replace(
						/^export\s+(?=(?:async\s+)?function|class|const|let|var)/gm,
						"",
					)
					.replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, "")
					.replace(/^export\s+default\s+/gm, ""),
				map: null,
			};
		},
	};
}

const bundle = await rollup({
	input: "src/index.ts",
	plugins: [
		nodeResolve(),
		swc({
			jsc: {
				target: "es2019",
				parser: {
					syntax: "typescript",
				},
			},
			sourceMaps: false,
		}),
		gasPlugin(),
	],
});

await bundle
	.write({
		file: "build/index.js",
		format: "es",
	})
	.catch(() => process.exit(1));
