# quiet-reference

> Sanctuary for truth, restraint, and emotional clarity

A static poetry and writing site built with Jekyll, styled with CSS, and deployed via IPFS and GitHub Pages.

Live at [quietreference.xyz](https://quietreference.xyz)

## Overview

quiet-reference is a minimal personal site hosting original poems, fragments, letters, and a foundation page. It prioritizes restraint in both content and design — no frameworks, no noise.

**Content collections:**
- `poems/` — individual poems as standalone HTML pages
- `fragments/` — short-form writing
- `letters/` — unsent letters
- `about.html`, `foundation.html`, `manifest.html` — static pages

**Tech stack:**
- Jekyll for static site generation
- LESS/CSS for styling
- Browserify for JS bundling
- IPFS for decentralized deployment
- GitHub Actions for CI/CD

## Local development

```bash
# Install dependencies
bundle install
npm install

# Build and serve
jekyll serve --watch
```

## Build

```bash
jekyll build        # outputs to _site/
npm run build:css   # compile LESS → static/css
```

## Deploy

```bash
npm run deploy      # jekyll build + ipfs add -r _site
```

Or push to `main` — GitHub Actions handles the Jekyll build and deployment automatically.

## Structure

```
├── poems/          # poem pages
├── layouts/        # HTML templates
├── static/         # compiled assets
├── assets/         # images, favicon
├── _site/          # build output (gitignored)
├── _config.yml     # Jekyll config
└── Makefile        # task runner
```
