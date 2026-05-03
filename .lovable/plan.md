# Plan: Generate Student Page Header Banners

Create 6 flat-vector illustration banners (one per student nav item) and display each as a page header on the matching student page.

## Images to generate

Each rendered at ~1600×500 PNG, flat vector style, ExamPal teal/blue palette, white-ish background with subtle gradient, friendly and modern.

| # | Nav item | Route | Theme |
|---|---|---|---|
| 1 | Dashboard | `/student` | Student at desk with charts, progress rings, calendar |
| 2 | My Classes | `/student/classes` | Stack of subject books, classroom door, study group |
| 3 | Exams | `/student/exams` | Clipboard with checkboxes, timer/clock, pencil |
| 4 | Results | `/student/results` | Trophy, score sheet, bar chart trending up |
| 5 | Leaderboard | `/student/leaderboard` | Podium with 3 students, medals, stars |
| 6 | Settings | `/student/settings` | Gear, sliders, profile avatar, toggles |

Generation method: AI gateway (`/tmp/lovable_ai.py` skill) using `google/gemini-3-pro-image-preview` for higher quality flat illustrations.

## File locations

- Generated PNGs saved to: `src/assets/student/dashboard.png`, `classes.png`, `exams.png`, `results.png`, `leaderboard.png`, `settings.png`
- Also copied to `/mnt/documents/student-banners/` for download

## Wiring into pages

Create a small reusable component:

`src/components/student/PageHeaderBanner.tsx` — props: `image`, `title`, `subtitle`. Renders a `rounded-2xl` card with image on the right (hidden on mobile) and title/subtitle on the left, with a soft teal gradient overlay matching the brand.

Then add `<PageHeaderBanner />` at the top of each "Real" student page actually used by the router:
- `src/pages/student/StudentDashboardReal.tsx`
- `src/pages/student/StudentClassesReal.tsx` (and/or `StudentClassroomsReal.tsx` — whichever is routed)
- `src/pages/student/StudentExamsReal.tsx`
- `src/pages/student/StudentResultsReal.tsx`
- `src/pages/student/StudentLeaderboard.tsx`
- `src/pages/student/StudentSettingsReal.tsx`

I will check `src/App.tsx` first to confirm which page component is mounted on each `/student/*` route before editing.

## Out of scope

- No nav sidebar icon changes (keeps current Lucide icons).
- No landing page / Index changes.
- No copy/text changes on the pages themselves beyond the banner title/subtitle.

## QA

After generation, view each PNG to confirm: correct theme, on-brand colors, no broken text/artifacts, consistent style across all 6. Regenerate any that miss the mark before wiring.
