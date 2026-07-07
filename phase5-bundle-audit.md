# Phase 5 Bundle Audit — Setu Platform

**Date:** July 8, 2026  
**Build tool:** Next.js 15.5.20 (static export, App Router)  
**Analyzer:** `@next/bundle-analyzer` + manual `.next/static/` inspection  
**Build mode:** `ANALYZE=true npm run build`

---

## Build Summary

| Metric | Value |
|--------|-------|
| Compile time | **11.8s** |
| Total static pages | **21** (all `○` static) + 2 dynamic (`ƒ`) |
| Total JS output (uncompressed) | **~2.7 MB** (all chunks) |
| First Load JS shared by all pages | **102 kB** (gzipped/parsed) |
| Largest page (First Load JS) | `/atlas` — **454 kB** |
| Smallest page (First Load JS) | `/_not-found` — **102 kB** |
| Average First Load JS (excl. atlas) | **~162 kB** |

**Pages breakdown:**

| Page | Page-Specific JS | First Load JS | Type |
|------|:-:|:-:|:----:|
| `/` (root) | 2.8 kB | 148 kB | Static |
| `/_not-found` | 124 B | 102 kB | Static |
| `/atlas` | **289 kB** | **454 kB** | Static |
| `/corporate` | 8.83 kB | 167 kB | Static |
| `/dock` | 2.35 kB | 144 kB | Static |
| `/flow` | 4.42 kB | 166 kB | Static |
| `/government` | 9.57 kB | 168 kB | Static |
| `/home` | 9.1 kB | 171 kB | Static |
| `/ngo` | 10.3 kB | 168 kB | Static |
| `/notifications` | 2.1 kB | 164 kB | Static |
| `/onboarding` | 2.56 kB | 147 kB | Static |
| `/place/[id]` | 3.08 kB | 165 kB | Dynamic |
| `/pressure/[id]` | 7.49 kB | 169 kB | Dynamic |
| `/profile` | 7.29 kB | 169 kB | Static |
| `/pulse` | 3.03 kB | 168 kB | Static |
| `/report` | 5.56 kB | 150 kB | Static |
| `/search` | 4.31 kB | 166 kB | Static |
| `/settings` | 2.23 kB | 147 kB | Static |
| `/states` | 2.11 kB | 144 kB | Static |
| `/stream` | 7.55 kB | 169 kB | Static |
| `/verifier` | 5.76 kB | 164 kB | Static |
| `/wound/[id]` | 11.8 kB | 173 kB | Dynamic |

---

## Largest Shared Chunks

These are loaded on every page. Sizes shown are **raw (uncompressed)** file size on disk. Next.js reports parsed size (gzipped) in the build output — the 102 kB "shared by all" number reflects the gzipped/parsed total.

| # | Chunk File | Raw Size | Parsed Size | Contents |
|---|-----------|:-:|:-:|----------|
| 1 | `4bd1b696-409494caf8c83275.js` | **173 KB** | 54.2 kB | **Next.js runtime core** — React, React-DOM, router, hydration, Suspense |
| 2 | `493-8ce779c8039286e5.js` | **172 KB** | 46 kB | **Shared app deps** — framer-motion layout/shared features, lucide-react core (`createLucideIcon`, `Icon`), Next.js navigation, Geist font |
| 3 | `polyfills-42372ed130431b0a.js` | **112 KB** | — | Polyfills (legacy browser support) |
| 4 | `framework-f52ebcb9f26a1e11.js` | **188 KB** | — | Pages Router framework (legacy — unused by App Router) |
| 5 | `main-2c39fef3c59030cc.js` | **128 KB** | — | Pages Router main (legacy — unused by App Router) |
| 6 | `webpack-3c3de51c5f305cda.js` | 3.4 KB | — | Webpack runtime |
| 7 | `main-app-f87b9d136bdd7e28.js` | 569 B | — | App Router entry point |

**Key insight:** The "shared by all" baseline of **102 kB** is dominated by Next.js + React runtime (~54 kB parsed) and framer-motion/lucide shared infrastructure (~46 kB parsed). The polyfills, framework, and main chunks add ~428 KB raw but are already well-optimized.

---

## Largest Page-Specific Chunks

These are loaded only when visiting the specific page. Raw sizes from `.next/static/chunks/app/`.

| Page | Chunk File | Raw Size | Key Dependencies |
|------|-----------|:-:|-----------------|
| `/government` | `government/page-7eb3f294cf91618b.js` | **44 KB** | ~15 lucide icons, custom components |
| `/corporate` | `corporate/page-273b1dfd2c0f4ff7.js` | **38 KB** | ~12 lucide icons, table/chart components |
| `/ngo` | `ngo/page-819ca1bfca3553fe.js` | **36 KB** | ~10 lucide icons, progress rings, forms |
| `/home` | `home/page-b0d797adf3c94f5c.js` | **29 KB** | ~8 lucide icons, hero components, stats grid |
| `/stream` | `stream/page-f0b1635bdeea6554.js` | **23 KB** | lucide icons, feed components |
| `/profile` | `profile/page-ff8a1cb30448bc6a.js` | **22 KB** | lucide icons, user card components |
| `/atlas` | `atlas/page-d763f6d0fdbe2e8b.js` | **19 KB** | (atlas page itself is small — the 1 MB maplibre chunk is separate) |
| `/analytics` | `analytics/page-e82fc3d842bfe560.js` | **18 KB** | Inline SVG charts, lucide icons |
| `/flow` | `flow/page-d9212774a16f033c.js` | **16 KB** | Process flow visualizations |
| `/search` | `search/page-24d77437a6bfbd6b.js` | **11 KB** | Search input, lucide icons |
| `/wound/[id]` | `wound/[id]/page-*.js` | ~11 KB | Wound detail card, timeline |

**Critical finding:** The `/atlas` page has a modest 19 KB page-specific JS chunk, but it also pulls in the **1,032 KB** `05f6971a-1d0adca93dde31a1.js` chunk containing **maplibre-gl**. This means visiting `/atlas` requires loading **1 MB of map library code** that is not used anywhere else.

---

## Big Dependency Analysis

### 1. maplibre-gl (~1,008 KB raw / ~350 KB gzipped)

| Aspect | Detail |
|--------|--------|
| **node_modules size** | 44 MB |
| **Raw chunk size** | **1,032 KB** (`05f6971a-1d0adca93dde31a1.js`) |
| **Used on** | Only `/atlas` page |
| **Import pattern** | Static `import maplibregl from 'maplibre-gl'` in atlas/page.tsx |
| **Impact** | **454 KB First Load JS** on `/atlas` (vs. ~162 KB average for other pages) |
| **Savings potential** | ~350 KB gzipped off every non-atlas page |

**Recommendation:** Dynamic import with `next/dynamic`. Atlas is the only page that needs it, so it should never be loaded elsewhere. Currently webpack puts it in a standalone chunk (good), but it's still downloaded eagerly on page load.

### 2. framer-motion (~118 KB raw chunk)

| Aspect | Detail |
|--------|--------|
| **node_modules size** | 3.8 MB |
| **Raw chunk size** | **118 KB** (chunk `921-c0106ded4e32b7e2.js`) |
| **Used on** | All pages (layout-level animations, entrance animations) |
| **Import pattern** | Static `import { motion } from 'framer-motion'` in layout and all pages |
| **Impact** | Included in shared baseline (part of the 46 KB parsed 493 chunk) |
| **Savings potential** | Already consolidated — minimal savings possible without major refactor |

**Recommendation:** Accept as baseline. It's already tree-shaken well and shared across all pages. Could investigate `motion()` factory as a lighter alternative in the future, but not a priority.

### 3. lucide-react (~36 MB node_modules)

| Aspect | Detail |
|--------|--------|
| **node_modules size** | 36 MB (thousands of icon files) |
| **Per-page impact** | **~1–3 KB parsed** per page (only imported icons are bundled) |
| **Tree-shaking** | Working correctly — webpack only bundles explicitly imported icons |
| **Most icon-heavy pages** | `/government` (~15 icons), `/corporate` (~12 icons), `/ngo` (~10 icons) |

**Recommendation:** Already well tree-shaken. Each page only bundles the icons it imports. No action needed unless we identify unused icon imports.

### 4. recharts (~5.2 MB node_modules)

| Aspect | Detail |
|--------|--------|
| **node_modules size** | 5.2 MB |
| **Source imports** | **ZERO** — not imported in any app source file |
| **Impact** | **None on bundle** — not bundled because it's not imported |
| **Savings potential** | Remove from `package.json` to reduce install size and prevent accidental imports |

**Recommendation:** **Remove from package.json.** This is dead weight. The analytics dashboard uses inline SVG instead.

### 5. @base-ui/react (~19 MB node_modules)

| Aspect | Detail |
|--------|--------|
| **node_modules size** | 19 MB |
| **Source imports** | **ZERO** — not imported in any app source file |
| **Impact** | **None on bundle** — not bundled |
| **Savings potential** | Remove from `package.json` |

**Recommendation:** **Remove from package.json.** No components from @base-ui are used anywhere.

### 6. Other Unused Dependencies

| Package | node_modules size | Used? |
|---------|:-:|:-----:|
| `shadcn` | ~small | **No** |
| `clsx` | ~small | **No** |
| `class-variance-authority` | ~small | **No** |
| `tailwind-merge` | ~small | **No** |
| `tw-animate-css` | ~small | **No** |

These likely remain from an initial setup or scaffolding but are not imported in application code.

---

## Concrete Reduction Plan

### Priority 1: Dynamically Import maplibre-gl (🔴 High Impact)

**Problem:** maplibre-gl (~350 KB gzipped) is bundled eagerly with the /atlas page.

**Solution:** Replace static import with client-side dynamic import in `app/atlas/page.tsx`:

```tsx
// BEFORE:
import maplibregl from 'maplibre-gl';

// AFTER:
const maplibregl = await import('maplibre-gl');
// wrapped in useEffect + useState for SSR safety
```

Or use `next/dynamic` for the map component:
```tsx
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <div className="card" style={{ height: 400 }}>Loading map…</div>,
});
```

**Estimated savings:** **~350 KB** gzipped First Load JS on all pages except /atlas. First Load JS on /atlas drops from 454 KB → **~104 KB** (shared baseline only).

**Implementation effort:** ~30 minutes. Break out the map logic into a separate component, wrap in `dynamic()` with `ssr: false`.

---

### Priority 2: Remove Unused Dependencies (🟡 Medium Impact)

**Problem:** 6 packages are in `package.json` but not imported anywhere.

**Solution:** Remove from `dependencies`:

```bash
npm uninstall recharts @base-ui/react shadcn clsx class-variance-authority tailwind-merge tw-animate-css
```

**Estimated savings:**
- **Bundle:** none (already not bundled)
- **Install size:** ~**25 MB** reduced `node_modules` size
- **Install time:** faster `npm ci` / `npm install`
- **Lock file:** cleaner, less audit noise

**Implementation effort:** ~5 minutes.

---

### Priority 3: Audit and Reduce lucide-react Icon Imports (🟡 Medium Impact)

**Problem:** Some pages import 10–15 icons. A few may be unused or could use fewer icons.

**Solution:** Run a per-page icon usage audit:

| Page | Icons Imported | Estimated Overhead |
|------|---------------|:-:|
| `/government` | 15+ | ~3 KB parsed |
| `/corporate` | 12+ | ~2.5 KB parsed |
| `/ngo` | 10+ | ~2 KB parsed |
| `/home` | 8+ | ~1.5 KB parsed |

**Estimated savings:** **~10–20 KB** total if 5–10 unused icon imports are removed across the app. Low-hanging fruit per page is small, but cumulatively meaningful.

**Implementation effort:** ~30 minutes (manual audit or ESLint rule).

---

### Priority 4: Remove Legacy Pages Router Chunks (🟢 Low Impact)

**Problem:** `framework-f52ebcb9f26a1e11.js` (188 KB) and `main-2c39fef3c59030cc.js` (128 KB) are legacy Pages Router bundles that App Router apps still include for `/pages/` fallback.

**Solution:** Check if `pages/_app.tsx` or `pages/_error.tsx` are actually needed. If not, delete the `pages/` directory and these chunks may be eliminated.

**Estimated savings:** **~316 KB raw** (though these are already cached and not loaded on every navigation since they're separate entry points).

**Implementation effort:** ~15 minutes to verify and remove.

---

### Priority 5: Code-Split Large Page Components (🟢 Low Impact)

**Problem:** The `/government` (44 KB raw), `/corporate` (38 KB), and `/ngo` (36 KB) pages have the largest page-specific chunks because they bundle many components upfront.

**Solution:** Use `React.lazy()` or `next/dynamic` for:
- Tab content panels on `/corporate`
- Accordion sections on `/government`
- Modal/dialog components on `/ngo`

**Estimated savings:** **~10–20 KB** First Load JS per page, deferred to on-demand loading.

**Implementation effort:** ~1–2 hours across all pages.

---

## Action Priority Matrix

| Priority | Action | Bundle Savings | Install Savings | Effort |
|:--------:|--------|:-:|:-:|:------:|
| 🔴 P1 | Dynamic import maplibre-gl | **~350 KB** | — | 30 min |
| 🟡 P2 | Remove unused deps | — | **~25 MB** | 5 min |
| 🟡 P3 | Audit lucide-react imports | **~10–20 KB** | — | 30 min |
| 🟢 P4 | Remove Pages Router chunks | **~316 KB raw** | — | 15 min |
| 🟢 P5 | Code-split large components | **~10–20 KB** | — | 1–2 hr |

**Estimated total savings:** **~350–400 KB gzipped** First Load JS reduction, **~25 MB** reduced install size.

---

## Appendix: Raw Chunk Sizes

All chunks in `.next/static/chunks/`, sorted by size (raw uncompressed):

| Size | File | Notes |
|----:|------|-------|
| 1.0M | `05f6971a-1d0adca93dde31a1.js` | **maplibre-gl** — only on /atlas |
| 188K | `framework-f52ebcb9f26a1e11.js` | Pages Router framework |
| 173K | `4bd1b696-409494caf8c83275.js` | Next.js runtime + React |
| 172K | `493-8ce779c8039286e5.js` | Shared app deps (framer-motion, lucide core) |
| 128K | `main-2c39fef3c59030cc.js` | Pages Router main |
| 118K | `921-c0106ded4e32b7e2.js` | Framer-motion animation engine |
| 112K | `polyfills-42372ed130431b0a.js` | Polyfills |
| 56K | `332-5a1c8235e47184b9.js` | (page-specific shared) |
| 32K | `110-bbca196aa2c3d019.js` | (page-specific shared) |
| 12K | `144-8a5700af13317ec2.js` | (various small chunks) |
| 12K | `143-36e6d573443f3fd0.js` | (various small chunks) |
| 12K | `378-6362e42cc4bcb389.js` | (various small chunks) |
| 12K | `619-f072ac750404f9da.js` | (various small chunks) |
| 8K | `936-360582617fb102be.js` | (various small chunks) |
| 8K | `730-377d6e44c1c428ac.js` | (various small chunks) |
| 8K | `617-385c64238680b68e.js` | (various small chunks) |
| 8K | `597-2b9f78ed71583c9d.js` | (various small chunks) |
| 3.4K | `webpack-3c3de51c5f305cda.js` | Webpack runtime |
| 569B | `main-app-f87b9d136bdd7e28.js` | App Router entry |

**Total raw chunk size:** ~2.7 MB

---

## Per-Page JS Payload Sizes

These are the **First Load JS** values from the Next.js build output (gzipped/parsed, as reported by Next.js):

| Route | Page JS | Shared JS | **First Load JS** |
|-------|:-------:|:---------:|:-----------------:|
| `/` | 2.8 kB | 102 kB | **148 kB** |
| `/_not-found` | 0.1 kB | 102 kB | **102 kB** |
| `/atlas` | 289 kB | 165 kB* | **454 kB** |
| `/corporate` | 8.8 kB | 158 kB* | **167 kB** |
| `/dock` | 2.4 kB | 142 kB* | **144 kB** |
| `/flow` | 4.4 kB | 162 kB* | **166 kB** |
| `/government` | 9.6 kB | 158 kB* | **168 kB** |
| `/home` | 9.1 kB | 162 kB* | **171 kB** |
| `/ngo` | 10.3 kB | 158 kB* | **168 kB** |
| `/notifications` | 2.1 kB | 162 kB* | **164 kB** |
| `/onboarding` | 2.6 kB | 145 kB* | **147 kB** |
| `/place/[id]` | 3.1 kB | 162 kB* | **165 kB** |
| `/pressure/[id]` | 7.5 kB | 162 kB* | **169 kB** |
| `/profile` | 7.3 kB | 162 kB* | **169 kB** |
| `/pulse` | 3.0 kB | 165 kB* | **168 kB** |
| `/report` | 5.6 kB | 145 kB* | **150 kB** |
| `/search` | 4.3 kB | 162 kB* | **166 kB** |
| `/settings` | 2.2 kB | 145 kB* | **147 kB** |
| `/states` | 2.1 kB | 142 kB* | **144 kB** |
| `/stream` | 7.6 kB | 162 kB* | **169 kB** |
| `/verifier` | 5.8 kB | 159 kB* | **164 kB** |
| `/wound/[id]` | 11.8 kB | 162 kB* | **173 kB** |

\* "Shared JS" is estimated as First Load JS minus Page JS. The exact shared baseline is 102 kB, but per-page shared varies slightly depending on which additional shared chunks a page needs.

---

## Conclusion

The Setu platform's bundle is in reasonable shape for a 21-page app, but has one major problem: **maplibre-gl** (1 MB raw, ~350 KB gzipped) being loaded on every /atlas page visit as part of First Load JS. Fixing this alone would bring the /atlas page from **454 kB → ~104 kB** First Load JS.

Additional low-effort wins include removing **6 unused packages** from `package.json` and auditing lucide-react icon imports. All other dependencies are already well tree-shaken and shared efficiently.

**Top recommendation for Phase 5.5:** Dynamic import maplibre-gl → biggest bang for buck (~350 KB savings, ~30 min effort).
