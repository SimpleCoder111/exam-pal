# AI Agent Instructions for ExamPal

## Project Overview
ExamPal is a React-based exam platform built with Vite, TypeScript, and shadcn/ui. It's a Lovable-generated project for conducting timed exams with question navigation, answer tracking, and results calculation.

## Tech Stack & Key Dependencies
- **Runtime**: React 18 + TypeScript
- **Build Tool**: Vite (dev server on port 8080)
- **Routing**: React Router (3 main routes: /, /exam, /results)
- **State Management**: React Query (TanStack) for server state
- **UI Framework**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Styling**: Tailwind CSS with custom fonts (Crimson Pro for headings, Plus Jakarta Sans for body)
- **Backend API**: Express backend at `http://localhost:7000/getQuestionBankBySubject`

## Architecture & Data Flow

### Core Pages (src/pages/)
- **Index**: Landing/subject selection page
- **Exam**: Main exam interface with timer (30 min default), question display, and answer tracking
- **Results**: Shows score, answers review, and performance breakdown

### Component Structure (src/components/)
- **exam/**: ExamHeader, QuestionCard, QuestionNavigator - specialized exam UI components
- **ui/**: 40+ shadcn/ui primitive components (Button, Card, Badge, Dialog, etc.) - **never delete or modify**
- **NavLink**: Custom navigation component

### Data Flow
1. `Exam.tsx` loads questions via `useQuestions()` hook with `subjectId` from URL params
2. `useQuestions()` fetches from backend API, transforms ApiQuestion → Question interface
3. Answers stored in `answers` object: `{ [questionId]: selectedOptionIndex }`
4. On submit, score calculated by comparing answers against `question.correctAnswer`
5. Navigation to `/results` with state containing score, answers, and questions

### Critical Patterns

**Answer Transformation**: API returns `optionLists` array; we extract text (`optionText`) and find correct answer index via `findIndex(opt => opt.isCorrect)`. Never lose the correct answer mapping.

**Type Interfaces**: Use separate `ApiQuestion`/`ApiOption` (API contract) and `Question` (internal format) - conversion happens in `useQuestions()` only.

**Component Props**: Exam components use explicit prop interfaces with question IDs. Example: `onAnswerSelect(questionId: number, optionIndex: number)`.

**State Management**: 
- Exam state: currentQuestion index, answers dict, flagged set, timeLeft seconds, showNavigator bool
- No Redux/Zustand - keep local state in Exam.tsx, pass via props/callbacks

## Developer Workflows

### Setup & Development
```bash
npm install      # Install dependencies (uses bun.lockb)
npm run dev      # Start Vite dev server on port 8080
npm run build    # Production build
npm run lint     # ESLint check
```

### Build Configuration
- Vite alias: `@` → `./src` for clean imports
- Component tagger plugin enabled in development (Lovable integration)
- Mode detection: `development` mode enables component tagger

### Debugging
- Backend API calls in `useQuestions()` - check Network tab for `/getQuestionBankBySubject` requests
- Answer tracking: inspect `answers` state object in React DevTools
- Timer logic: useEffect in Exam.tsx with 1-second intervals, auto-submit on timeout

## Project-Specific Conventions

**CSS Classes**: Avoid custom CSS; use Tailwind utilities exclusively. Custom theme extends defined in `tailwind.config.ts` (colors, fonts). Animate directives: `animate-scale-in` for question cards.

**Import Paths**: Always use `@/` alias for src-relative imports. Avoid relative paths like `../../../`.

**File Organization**: 
- Pages in `/pages` - route components
- Reusable components in `/components` (UI primitives in subdir `/ui`)
- Hooks in `/hooks` - logic (useQuestions, custom hooks)
- `lib/utils.ts` - utility functions (cn for Tailwind class merging)

**API Integration**: 
- Base URL hardcoded: `http://localhost:7000`
- Single endpoint: `/getQuestionBankBySubject?subjectId={id}`
- Response type: `ApiResponse` with `questionData` array

**Difficulty Badge Styling**: Function `getDifficultyStyles()` in QuestionCard - maps EASY/MEDIUM/HARD to color schemes with background, text, and border tints.

## When Modifying Code

1. **Don't touch `/src/components/ui/` files** - these are shadcn/ui generated primitives
2. **Preserve answer transformation logic** - it's the bridge between API and UI
3. **Maintain type boundaries** - keep Api* types separate from internal Question type
4. **Test timer and submission flow** - exam logic has tight coupling between state updates and navigation
5. **Use Tailwind utilities** - never add CSS files for styling; extend tailwind.config.ts if needed

## Key Files to Reference
- [src/App.tsx](src/App.tsx) - routing, QueryClient setup
- [src/pages/Exam.tsx](src/pages/Exam.tsx) - exam state machine and timer logic
- [src/hooks/useQuestions.ts](src/hooks/useQuestions.ts) - API integration and data transformation
- [src/components/exam/QuestionCard.tsx](src/components/exam/QuestionCard.tsx) - question display and styling patterns
- [tailwind.config.ts](tailwind.config.ts) - theme customization
