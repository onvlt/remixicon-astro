import * as fs from "node:fs/promises";
import * as path from "node:path";

const DIST_DIR = "icons";

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
 * @param {string} str
 * @returns {string}
 */
function toComponentName(str) {
	// JavaScript identifiers must not start with digit,
	// so we prepend 'icon-' prefix to the component name.
	const name = /^\d+/.test(str) ? `icon-${str}` : str;
	return toPascalCase(name);
}

/**
 * @param {string} svg
 * @returns {string}
 */
function transformSvgToAstroComponent(svg) {
	const body = svg
		.trim()
		.replace(/^<svg .+?>(.+)<\/svg>$/, "$1")
		.replaceAll("><", ">\n<");
	return `---
import { default as IconRoot, type Props as IconRootProps } from './_IconRoot.astro';

export type Props = IconRootProps;
---

<IconRoot {...Astro.props}>
	${body}
</IconRoot>
`;
}

async function run() {
	console.log("Generating Astro components...");
	await fs.rm(path.join(DIST_DIR, "[!{_}]*.astro"), { recursive: true, force: true });

	for await (const entry of fs.glob("node_modules/remixicon/icons/*/*.svg")) {
		const svg = await fs.readFile(entry);
		const astro = transformSvgToAstroComponent(svg.toString());
		const componentName = toComponentName(path.basename(entry, ".svg"));
		await fs.writeFile(path.join(DIST_DIR, `${componentName}.astro`), astro);
	}
}

try {
	await run();
	process.exit(0);
} catch (e) {
	console.error("Error occured while building icons", e);
	process.exit(1);
}
