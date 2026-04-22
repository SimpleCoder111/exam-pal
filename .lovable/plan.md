

# Rebrand: ExamFlow → ExamPal

Replace all user-visible "ExamFlow" branding with "ExamPal" across the UI, plus update browser tab title and OG metadata.

## Visible text changes

| File | Location | Change |
|---|---|---|
| `src/pages/Index.tsx` | Header logo, CTA section, footer logo, copyright | `ExamFlow` → `ExamPal` (4 spots) |
| `src/pages/Login.tsx` | Hero side logo + form-side logo | `ExamFlow` → `ExamPal` (2 spots) |
| `src/pages/Results.tsx` | Top header logo | `ExamFlow` → `ExamPal` |
| `src/components/dashboard/DashboardLayout.tsx` | Mobile + desktop sidebar logo | `ExamFlow` → `ExamPal` (2 spots) |
| `src/components/exam/ExamHeader.tsx` | In-exam header logo | `ExamFlow` → `ExamPal` |
| `src/pages/student/StudentResults.tsx` | Mock study resources `provider` field | `ExamFlow Academy` → `ExamPal Academy` (3 spots) |

## Browser metadata (`index.html`)

- `<title>` → `ExamPal`
- `<meta name="description">` → `ExamPal — secure online examination platform`
- `<meta property="og:title">` → `ExamPal`
- `<meta property="og:description">` → same description as above

## Demo / mock credentials — keep as-is

Leave the following untouched to avoid breaking existing user sessions and demo logins:
- `MOCK_USERS` emails (`admin@examflow.com`, `teacher@examflow.com`, `student@examflow.com`) in `src/contexts/AuthContext.tsx`
- localStorage keys `examflow_user` and `examflow_token` in `AuthContext.tsx` and `Login.tsx`
- Demo credentials list shown on the Login page

These are internal identifiers, not brand-facing copy. Renaming them would log every user out and require updating any backend/seed data that uses these emails.

## Out of scope

- No logo image swap (the brand uses the `BookOpen` Lucide icon, not an image asset)
- No color/theme changes
- No memory file updates (memory is internal context, not user-facing)

