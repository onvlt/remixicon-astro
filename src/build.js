import { readFile, writeFile, mkdir, glob } from "node:fs/promises";
import { existsSync } from "node:fs";
import * as path from "node:path";

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
	if (!existsSync(DIST_DIR)) {
		await mkdir(DIST_DIR);
	}

	for await (const entry of glob("node_modules/remixicon/icons/*/*.svg")) {
		const svg = await readFile(entry);
		const astro = transformSvgToAstroComponent(svg.toString());
		const componentName = toPascalCase(path.basename(entry, ".svg"));
		await writeFile(path.join(DIST_DIR, `${componentName}.astro`), astro);
	}
}

run();
