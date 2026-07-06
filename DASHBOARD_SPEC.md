# Setu — Dashboard / Home — Implementation Spec

Route: `/home` | Component: `<Dashboard actor={actor} />` | One component, role-tinted, composes existing components.

## Core principle
The Dashboard is a personalized arrangement of existing components. Its job: answer "what should I look at right now?" per role. Four module playlists, one component.

## Data contract
```ts
interface HomeFeed {
  greeting: { name: string; role: Role; locationLabel: string };
  headlineStat: Stat;
  supportStats: Stat[];
  modules: HomeModule[];
}

type HomeModuleType =
  | 'your-wounds' | 'near-you' | 'trending' | 'needs-you'
  | 'your-projects' | 'matched' | 'jurisdiction' | 'activity'
  | 'mini-atlas' | 'watchlist';
```

## Layout
Desktop: two-column (main 62% + right rail 320px). Mobile: single column.

## Per-role playlists
- Citizen: your-wounds (primary), near-you, trending. Right: mini-atlas + activity.
- NGO: matched (primary), your-projects, trending. Right: mini-atlas + activity.
- Corporate: matched (primary), your-projects, activity. Right: mini-atlas + compliance.
- Government: jurisdiction (primary), activity, trending. Right: mini-atlas + SLA card.

## Rules
- Reuse existing components. Only `<ActivityRow>` is new.
- No dark boxes, no gradients, no fake charts.
- Every module has a real empty state.
- One headline number per role.
- Honest subtitles (show overdue/failures).
