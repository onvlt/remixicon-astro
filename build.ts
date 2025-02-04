import * as fs from "node:fs/promises";
import * as path from "node:path";

const DIST_DIR = "icons";

function toPascalCase(str: string): string {
	const matches = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
	if (!matches) {
		return str;
	}
	return matches.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join("");
}

function toComponentName(str: string): string {
	// if icon name starts with number, we need to add some prefix
	// (I chose "icon-" prefix), because JavaScript identifiers cannot start with digit.
	const name = /^\d+/.test(str) ? `icon-${str}` : str;
	return toPascalCase(name);
}

function transformSvgToAstroComponent(svg: string): string {
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
