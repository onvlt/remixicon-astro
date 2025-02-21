# [Remix Icons](https://remixicon.com/) for Astro

Distribution of [Remix icon](https://remixicon.com/) library for your Astro components. Individual icons can be imported as Astro components.

## Installation

```
npm i @onvlt/remixicon-astro
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
