# ⚠️ Archived

This package is no logner maintained. Since `astro@5.7.0`, you can directly import SVG files as Astro components. Therefore I encourage you to use official [remixicon package](https://www.npmjs.com/package/remixicon) instead, which distributes SVG files you can import directly as they will be turned to Astro components automatically.

Usage example:

```sh
npm i remixicon
```

Then in your Astro component:

```astro
---
import IconArrowDownLine from "remixicon/icons/Arrows/arrow-down-line.svg";
---

<IconArrowDownLine />
```

---

# [Remix Icons](https://remixicon.com/) for Astro

Distribution of [Remix icon](https://remixicon.com/) library for your Astro components. Individual icons can be imported as Astro components.

## Installation

```
npm i https://github.com/onvlt/remixicon-astro
```

## Usage

Import icon into your Astro component.

```astro
---
import { Download } from '@onvlt/remixicon-astro/Download'
---

<button>
	<Download />
</button>
```

## Building

If you want to rebuild Astro components by yourself, you can clone this repository, run `npm i` to install dependencies, including Remix icons SVG sources, and then run `npm build` to generate `.astro` components, which will be created in `/dist` directory.

## Attributions

Thanks to the authors of the excellent [Remix Icon](https://lucide.dev/) library.

This package was inspired by [dzeiocom/lucide-astro](https://github.com/dzeiocom/lucide-astro).
