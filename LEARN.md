# 📁 Smriti AI – Project Structure & How It Works

Smriti AI is an all-in-one intelligent learning assistant that helps users organize, process, and revise learning resources using AI, quizzes, and reminders. Below is a detailed breakdown of the project's file structure and how each part contributes to the overall system.

---

## 1. **Top-Level Structure**

```
smriti-ai/
│
├── app/                # Main Next.js application (pages, API routes, layouts)
├── components/         # Reusable React components (UI, dashboard, landing, etc.)
├── contexts/           # React context providers (e.g., SidebarContext)
├── hooks/              # Custom React hooks for data fetching and logic
├── lib/                # Server-side utilities (AI, cloud, DB, etc.)
├── prisma/             # Database schema and migrations (Prisma ORM)
├── public/             # Static assets (images, icons, etc.)
├── scripts/            # Utility scripts (e.g., database backfill)
├── screenshots/        # Project screenshots
├── testimonals/        # Testimonial data
├── types/              # TypeScript type definitions
├── utils/              # Client-side utility functions
├── README.md           # Project overview and instructions
├── LEARN.md            # (You are here) In-depth file structure and architecture
├── CONTRIBUTING.md     # Contribution guidelines
├── Contributors data.md # Contributors data file
├── CODE_OF_CONDUCT.md  # Code of conduct
├── LICENSE             # Project license
├── middleware.ts       # Next.js middleware
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── next.config.ts      # Next.js configuration
├── eslint.config.mjs   # ESLint configuration
└── postcss.config.mjs  # PostCSS configuration
```

---

## 2. **Key Folders Explained**

### **/app/**

- **Purpose:** Houses all Next.js pages, layouts, and API routes.
- **Structure:**
  - **(authenticated_Pages)/**: Protected routes for logged-in users.
    - **dashboard/**: Main dashboard with subfolders:
      - **page.tsx**: Main dashboard page.
      - **achievements/page.tsx**: User achievements page.
      - **analytics/page.tsx**: Analytics dashboard with error boundary.
      - **flashcard/[[...id]]/page.tsx**: Dynamic flashcard pages.
      - **interview/[[...id]]/**: Interview practice pages.
        - **page.tsx**: Interview page wrapper.
        - **interview.tsx**: Interview component logic.
      - **leaderboard/page.tsx**: Leaderboard page.
      - **quiz/[[...id]]/page.tsx**: Dynamic quiz detail pages.
    - **(resource-layout)/**: Resource management layout.
      - **folder/[id]/page.tsx**: Folder detail pages.
      - **resource/[[...id]]/page.tsx**: Dynamic resource detail pages.
      - **layout.tsx**: Resource layout wrapper.
    - **layout.tsx**: Authenticated pages layout.
    - **navbar.tsx**: Navigation bar for authenticated users.
  - **(public)/**: Public-facing pages.
    - **page.tsx**: Landing/home page.
    - **about/page.tsx**: About page.
    - **blogs/**: Blog pages.
      - **page.tsx**: Blog listing page.
      - **[slug]/page.tsx**: Individual blog post pages.
    - **contact/page.tsx**: Contact page.
    - **contributors/page.tsx**: Contributors page.
    - **privacy-policy/page.tsx**: Privacy policy page.
    - **sign-in/[[...sign-in]]/page.tsx**: Sign-in page (Clerk).
    - **sign-up/[[...sign-up]]/page.tsx**: Sign-up page (Clerk).
    - **terms-of-use/page.tsx**: Terms of use page.
    - **layout.tsx**: Public pages layout.
    - **navbar.tsx**: Navigation bar for public pages.
  - **api/**: Serverless API endpoints.
    - **achievements/route.ts**: User achievements API.
    - **analytics/route.ts**: Analytics data API.
    - **contact/route.ts**: Contact form submission.
    - **create-user/route.ts**: User creation endpoint.
    - **flashcard-export/route.ts**: Flashcard export functionality.
    - **flashcard-review/route.ts**: Flashcard review tracking.
    - **folder/**: Folder management APIs.
      - **route.ts**: Folder CRUD operations.
      - **default/route.ts**: Default folder handling.
      - **[folderId]/quiz-progress/route.ts**: Quiz progress tracking per folder.
    - **interview/**: Interview-related APIs.
      - **analytics/route.ts**: Interview analytics.
      - **generate/route.ts**: Generate interview questions.
      - **history/route.ts**: Interview history.
      - **quiz/[quizId]/route.ts**: Interview quiz endpoints.
      - **submit/route.ts**: Interview submission.
    - **leaderboard/route.ts**: Leaderboard data API.
    - **performance-data/route.ts**: Performance metrics API.
    - **quiz-result/route.ts**: Quiz result submission.
    - **reminder-message/route.ts**: Reminder message handling.
    - **resource/route.ts**: Resource CRUD operations.
    - **resource-ai/route.ts**: AI processing for resources.
    - **topic/**: Topic management APIs (deprecated/minimal).
      - **[topicId]/quiz-progress/**: Quiz progress tracking (legacy).
      - **default/**: Default topic handling (legacy).
    - **user/**: User-related APIs.
      - **experience/route.ts**: User experience/XP tracking.
      - **login/route.ts**: User login tracking.
  - **layout.tsx**: Root layout.
  - **globals.css**: Global styles.
  - **robots.ts**: Robots.txt generation.
  - **sitemap.ts**: Sitemap generation.

### **/components/**

- **Purpose:** All reusable UI and logic components.
- **Structure:**
  - **accessibility/**: Accessibility components.
    - **AccessibleProgressBar.tsx**: Accessible progress bar.
    - **AriaLiveRegion.tsx**: ARIA live region for announcements.
    - **SkipLinks.tsx**: Skip navigation links.
    - **index.ts**: Exports.
  - **auth/**: Authentication components.
    - **SignInForm.tsx**: Sign-in form.
    - **SignUpForm.tsx**: Sign-up form.
  - **AuthGate/**: Authentication gate wrapper.
    - **index.tsx**: Auth gate component.
    - **AuthGate.css**: Auth gate styles.
  - **blog/**: Blog-related components.
    - **BlogCard.tsx**: Blog post card.
  - **dashboard/**: Dashboard-specific components.
    - **actionCell.tsx**: Action cell for tables.
    - **addremindermodal.tsx**: Add reminder modal.
    - **levelCard.tsx**: User level card.
    - **loginStreakCard.tsx**: Login streak display.
    - **performanceCard.tsx**: Performance metrics card.
    - **studyreminder.tsx**: Study reminder component.
    - **topics-table.tsx**: Topics table component.
  - **flashcard/**: Flashcard components.
    - **Flashcard.tsx**: Individual flashcard component.
    - **FlashcardDeck.tsx**: Flashcard deck container.
    - **FlashcardEditor.tsx**: Flashcard editor.
  - **landing/**: Landing page components.
    - **About.tsx**: About section.
    - **AnimatedImage.tsx**: Animated image component.
    - **CTA.tsx**: Call-to-action section.
    - **Features.tsx**: Features section.
    - **Hero.tsx**: Hero section.
    - **HeroForm.tsx**: Hero form component.
    - **HowItWorks.tsx**: How it works section.
    - **openSourceBtn.tsx**: Open source button.
    - **Pricing.tsx**: Pricing section.
    - **Testimonials.tsx**: Testimonials section.
  - **magicui/**: Special UI effects and animations.
    - **confetti.tsx**: Confetti animation.
    - **dot-pattern.tsx**: Dot pattern background.
    - **marquee.tsx**: Marquee scrolling effect.
    - **number-ticker.tsx**: Animated number counter.
    - **text-animate.tsx**: Text animation effects.
  - **mermaid/**: Diagram rendering.
    - **mermaid.tsx**: Mermaid diagram component.
  - **quiz/**: Quiz components.
    - **QuizQuestion.tsx**: Quiz question component.
    - **QuizResult.tsx**: Quiz result display.
    - **QuizReview.tsx**: Quiz review component.
  - **resource/**: Resource management components.
    - **FolderModal.tsx**: Folder creation/editing modal.
    - **FolderSidebar.tsx**: Folder navigation sidebar.
  - **ui/**: Generic UI elements (shadcn/ui components).
    - **alert-dialog.tsx**: Alert dialog component.
    - **BackToTopButton.tsx**: Back to top button.
    - **badge.tsx**: Badge component.
    - **button.tsx**: Button component.
    - **card.tsx**: Card component.
    - **chart.tsx**: Chart component.
    - **checkbox.tsx**: Checkbox component.
    - **dialog.tsx**: Dialog component.
    - **dropdown-menu.tsx**: Dropdown menu.
    - **input.tsx**: Input component.
    - **label.tsx**: Label component.
    - **popover.tsx**: Popover component.
    - **progress.tsx**: Progress bar.
    - **radialcharttext.tsx**: Radial chart text.
    - **radio-group.tsx**: Radio group.
    - **select.tsx**: Select dropdown.
    - **sheet.tsx**: Sheet/sidebar component.
    - **skeleton.tsx**: Loading skeleton.
    - **sonner.tsx**: Toast notifications.
    - **switch.tsx**: Switch toggle.
    - **table.tsx**: Table component.
    - **tabs.tsx**: Tabs component.
    - **textarea.tsx**: Textarea component.
    - **tooltip.tsx**: Tooltip component.
  - **ActionButton.tsx**: Action button component.
  - **AddResourceForm.tsx**: Form for adding resources.
  - **authLeftPanel.tsx**: Auth page left panel.
  - **Contact.tsx**: Contact form component.
  - **Footer.tsx**: Footer component.

### **/lib/**

- **Purpose:** Server-side utilities and integrations.
- **Files:**
  - **prisma.ts**: Prisma client for database access.
  - **cloudinary.ts**: Cloudinary image upload/management.
  - **twilio.ts**: Twilio WhatsApp reminder integration.
  - **prepareMermaidCode.ts**: Prepares code for Mermaid diagram rendering.
  - **prompts.ts**: AI prompt templates for LLM interactions.
  - **processPrompt.ts**: Prompt processing utilities.
  - **pdfParser.ts**: PDF parsing and text extraction.
  - **blog.ts**: Blog content management utilities.
  - **contentful.ts**: Contentful CMS integration.
  - **bufferToStream.ts**: Buffer to stream conversion utilities.
  - **levelUtils.ts**: User level/XP calculation utilities.
  - **resourceService.ts**: Resource processing service.
  - **rateLimiter.ts**: API rate limiting utilities.
  - **utils.ts**: General server-side utilities.
  - **accessibility-tests.ts**: Accessibility testing utilities.

### **/prisma/**

- **Purpose:** Database schema and migrations.
- **Files:**
  - **schema.prisma**: Defines all DB models (User, Topic, Resource, Quiz, etc.).
  - **migrations/**: SQL migration files for schema changes.

### **/contexts/**

- **Purpose:** React context providers for global state management.
- **Files:**
  - **SidebarContext.tsx**: Context for sidebar state management.

### **/hooks/**

- **Purpose:** Custom React hooks for data fetching and logic.
- **Files:**
  - **useLocalStorageState.ts**: Hook for managing localStorage state.

### **/types/**

- **Purpose:** TypeScript type definitions for shared data structures.
- **Files:**
  - **index.ts**: Main type exports.
  - **blog.ts**: Blog-related types.

### **/utils/**

- **Purpose:** Client-side utility functions.
- **Files:**
  - **youtube.ts**: YouTube video helpers and utilities.
  - **generateMathCaptcha.ts**: Math captcha generation.
  - **generateMetadata.ts**: Metadata generation utilities.
  - **smooth-scroll.ts**: Smooth scrolling utilities.

### **/scripts/**

- **Purpose:** Utility scripts for database operations and maintenance.
- **Files:**
  - **backfillQuizResults.ts**: Script to backfill quiz results data.

### **/testimonals/**

- **Purpose:** Testimonial data and content.
- **Files:**
  - **reviews.ts**: Testimonial reviews data.

### **/public/**

- **Purpose:** Static assets (images, icons, etc.) served directly.

---

## 3. **How Everything Works Together**

### **User Flow**

1. **Landing & Auth:** Users land on the homepage (`app/page.tsx`), sign up or sign in (Clerk authentication).
2. **Dashboard:** Authenticated users access the dashboard to manage topics, resources, and quizzes.
3. **Resource Management:** Users add resources (YouTube, PDFs, links) to topics. Resources are processed by AI (summaries, mind maps, quizzes).
4. **Revision & Reminders:** Users receive WhatsApp reminders (via Twilio) for spaced repetition and can take quizzes to reinforce learning.
5. **Progress Tracking:** Users view performance charts and analytics on their dashboard.

### **Backend & API**

- **API Routes (`app/api/`)**: Handle various operations:
  - **User Management**: User creation, login tracking, experience/XP updates.
  - **Resource Management**: Resource CRUD, AI processing (summaries, mind maps, quizzes).
  - **Folder Management**: Folder CRUD, quiz progress tracking, default folders.
  - **Quiz System**: Quiz results, flashcard review, flashcard export.
  - **Analytics**: Performance data, interview analytics, leaderboard.
  - **Reminders**: WhatsApp reminder message handling via Twilio.
  - **Interviews**: Interview question generation, submission, history, and analytics.
  - **Achievements**: User achievement tracking.
  - **Contact**: Contact form submissions.
- **Database (Prisma + PostgreSQL):** Stores users, topics, resources, quizzes, results, flashcards, notes, achievements, and analytics.
- **AI Layer:** Uses LLMs (Gemini, OpenAI) via LangChain to generate summaries, mind maps, quizzes, and interview questions from user resources.

### **Frontend**

- **Next.js + React:** Renders all pages and components.
- **Tailwind CSS:** For styling.
- **Reusable Components:** Modular UI for rapid development and consistency.

### **Integrations**

- **Clerk:** User authentication and session management.
- **Twilio:** WhatsApp reminders and notifications.
- **Cloudinary:** Media uploads and image management.
- **Mermaid:** Diagram rendering for mind maps and visualizations.
- **Contentful:** CMS for blog content management.
- **Supabase:** Additional database services (if used).
- **LangChain:** AI/LLM orchestration framework.
- **Google Generative AI (Gemini):** Primary LLM for content generation.
- **OpenAI:** Alternative LLM provider.

---

## 4. **Key Features**

- **Resource Management**: Add and organize YouTube videos, PDFs, and links in folders.
- **AI Processing**: Automatic generation of summaries, mind maps, and quizzes from resources.
- **Flashcards**: Create, review, and export flashcards (including Anki format).
- **Quiz System**: Take quizzes, track progress, and review results.
- **Interview Practice**: AI-generated interview questions with analytics.
- **Folder Organization**: Hierarchical folder structure for organizing learning resources.
- **Analytics**: Performance tracking, leaderboard, and achievement system.
- **Reminders**: WhatsApp reminders for spaced repetition learning.
- **Level System**: User progression with XP and levels.
- **Accessibility**: WCAG-compliant components and features.

## 5. **Extensibility & Future Scope**

- **Mobile App:** Planned for iOS & Android.
- **Chat-based Assistant:** Ask questions about saved content.
- **Institute Portal:** For educational organizations.

---

## 6. **Contributing**

- The project is open source and welcomes contributions! See `README.md` and `CONTRIBUTING.md` for setup instructions and guidelines.
- Please review `CODE_OF_CONDUCT.md` before contributing.

---

**Smriti AI** is designed to be modular, extensible, and easy to contribute to. Each folder and file has a clear responsibility, making it easy for new contributors to get started.
