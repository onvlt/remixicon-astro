import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";

const DIST_DIR = "dist";

/**
 * @param {string} str
 * @returns {string}
 */
function toPascalCase(str) {
	return str
		.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
		.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
		.join("");
}

/**
 * @param {string} svg
 * @returns {string}
 */
function transformSvgToAstroComponent(svg) {
	const body = svg
		.replace(/^<svg (.+?)>/, "<svg $1 {...Astro.props}>")
		.replaceAll("><", ">\n<");
	return `---
import type { HTMLAttributes } from 'astro/types';

type Props = HTMLAttributes<'svg'>;
---
${body}`;
}

async function run() {
	await fs.rm(DIST_DIR, { recursive: true, force: true });
	await fs.mkdir(DIST_DIR);

	const indexLines = [];

	for await (const entry of fs.glob("node_modules/remixicon/icons/*/*.svg")) {
		const svg = await fs.readFile(entry);
		const astro = transformSvgToAstroComponent(svg.toString());
		const componentName = toPascalCase(path.basename(entry, ".svg"));
		await fs.writeFile(path.join(DIST_DIR, `${componentName}.astro`), astro);
		indexLines.push(
			`export { default as ${componentName} } from "./${componentName}.astro"`,
		);
	}

	await fs.writeFile(
		path.join(DIST_DIR, "index.js"),
		indexLines.join("\n") + "\n",
	);
}

try {
	await run();
	process.exit(0);
} catch (e) {
	console.error("Error occured while building icons", e);
	process.exit(1);
}
