# Graph Report - .  (2026-06-15)

## Corpus Check
- 113 files · ~39,787 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 99 nodes · 119 edges · 12 communities detected
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Acceptance Criteria Document|Acceptance Criteria Document]]
- [[_COMMUNITY_App Components & Actions|App Components & Actions]]
- [[_COMMUNITY_Project Architecture & Tech Stack|Project Architecture & Tech Stack]]
- [[_COMMUNITY_Product Requirements & Tests|Product Requirements & Tests]]
- [[_COMMUNITY_Superadmin Operations & Security|Superadmin Operations & Security]]
- [[_COMMUNITY_Contact Form & Email|Contact Form & Email]]
- [[_COMMUNITY_Public Layout Components|Public Layout Components]]
- [[_COMMUNITY_Utility Functions|Utility Functions]]
- [[_COMMUNITY_Shadcn UI|Shadcn UI]]
- [[_COMMUNITY_User Mapper|User Mapper]]
- [[_COMMUNITY_Audit Log Mapper|Audit Log Mapper]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]

## God Nodes (most connected - your core abstractions)
1. `Acceptance Criteria Document v1.0` - 13 edges
2. `Prime Property Platform` - 11 edges
3. `Prime Property Acceptance Criteria Document v1.0` - 11 edges
4. `Tech Stack Document v1.0` - 10 edges
5. `mapProperty (Prisma->Domain)` - 7 edges
6. `Superadmin Guide Document` - 7 edges
7. `Product Requirements Document v1.0` - 6 edges
8. `AC-7: Dashboard Internal - Property View (table, pagination, sort, status badges)` - 6 edges
9. `createProperty (Server Action)` - 5 edges
10. `DashboardPage (Agent)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AC-1 Branding & Design System` --semantically_similar_to--> `Brand & Design System (AC-1)`  [INFERRED] [semantically similar]
  startdocs/Prime_Property_Acceptance_Criteria.md → CLAUDE.md
- `AC-5 Agent Authentication & Authorization` --semantically_similar_to--> `Role & Authorization (AC-5.2)`  [INFERRED] [semantically similar]
  startdocs/Prime_Property_Acceptance_Criteria.md → CLAUDE.md
- `Database Tables: User, Property, Session, LoginAttempt, AuditLog` --semantically_similar_to--> `Prisma Database Schema`  [INFERRED] [semantically similar]
  startdocs/TECHSTACK.md → CLAUDE.md
- `Prime Property Brand Logo` --semantically_similar_to--> `Color Palette (Primary Black #1A1A1A, Accent Gold #C9A961, Accent Red #B33A3A, Neutral White #FFFFFF, Soft Gray #F5F5F5)`  [INFERRED] [semantically similar]
  startdocs/logo-prime-property.png → startdocs/Prime_Property_Acceptance_Criteria (1).pdf
- `Prime Property Platform` --references--> `Superadmin Guide Document`  [EXTRACTED]
  CLAUDE.md → docs/superadmin-guide.md

## Communities

### Community 0 - "Acceptance Criteria Document"
Cohesion: 0.12
Nodes (24): AC-10: Deliverables & Acceptance (Definition of Done), AC-1: Branding & Design System, Color Palette (Primary Black #1A1A1A, Accent Gold #C9A961, Accent Red #B33A3A, Neutral White #FFFFFF, Soft Gray #F5F5F5), Layout Principles (mobile 640px, tablet 1024px, desktop 1024px, grid 4/8/16/24/32px), Hero Section (dark background, gold CTA, tagline), AC-2: Landing Page, AC-3: About Us Page, AC-4: Contact Us Page (+16 more)

### Community 1 - "App Components & Actions"
Cohesion: 0.14
Nodes (19): createProperty (Server Action), deleteProperty (Server Action), getFeaturedProperties, getProperty, getPropertyStats, listAllProperties, listProperties, updateProperty (Server Action) (+11 more)

### Community 2 - "Project Architecture & Tech Stack"
Cohesion: 0.13
Nodes (19): Claude Code Agent Instructions, Brand & Design System (AC-1), Lokalisasi Bahasa Indonesia (AC-9.3), Phase 2 - Backend Integration, Prime Property Platform, Prisma Database Schema, Role & Authorization (AC-5.2), AC-5 Agent Authentication & Authorization (+11 more)

### Community 3 - "Product Requirements & Tests"
Cohesion: 0.12
Nodes (18): AC-10 Definition of Done, AC-1 Branding & Design System, AC-2 Landing Page, AC-3 About Us, AC-4 Contact Us, AC-6 Property Schema Data, AC-7 Dashboard Internal View, AC-9 Non-Functional Requirements (+10 more)

### Community 4 - "Superadmin Operations & Security"
Cohesion: 0.29
Nodes (8): Middleware Rate Limit & CSRF Protection, AC-8 CRUD (Superadmin Only), AC Audit Completed June 2026, Audit Log System, CRUD Properti for Superadmin, Dashboard Properti, Manajemen Admin Akun, Superadmin Guide Document

### Community 5 - "Contact Form & Email"
Cohesion: 0.67
Nodes (3): submitContact (Server Action), notifyContactMessage, sendEmail (Resend)

### Community 6 - "Public Layout Components"
Cohesion: 1.0
Nodes (2): Footer, PublicHeader

### Community 7 - "Utility Functions"
Cohesion: 1.0
Nodes (2): cn (classname utility), isValidUuid

### Community 8 - "Shadcn UI"
Cohesion: 1.0
Nodes (1): shadcn Command Component

### Community 9 - "User Mapper"
Cohesion: 1.0
Nodes (1): mapUser (Prisma->Domain)

### Community 10 - "Audit Log Mapper"
Cohesion: 1.0
Nodes (1): mapAuditLog (Prisma->Domain)

### Community 11 - "Project Documentation"
Cohesion: 1.0
Nodes (1): Next.js Project Bootstrap (create-next-app)

## Knowledge Gaps
- **35 isolated node(s):** `AgentLoginPage`, `PublicHeader`, `Footer`, `StatusBadge`, `SiapBadge` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Public Layout Components`** (2 nodes): `Footer`, `PublicHeader`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Utility Functions`** (2 nodes): `cn (classname utility)`, `isValidUuid`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shadcn UI`** (1 nodes): `shadcn Command Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Mapper`** (1 nodes): `mapUser (Prisma->Domain)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Audit Log Mapper`** (1 nodes): `mapAuditLog (Prisma->Domain)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Documentation`** (1 nodes): `Next.js Project Bootstrap (create-next-app)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Prime Property Platform` connect `Project Architecture & Tech Stack` to `Product Requirements & Tests`, `Superadmin Operations & Security`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `Acceptance Criteria Document v1.0` connect `Product Requirements & Tests` to `Project Architecture & Tech Stack`, `Superadmin Operations & Security`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `mapProperty (Prisma->Domain)` (e.g. with `createProperty (Server Action)` and `getPropertyStats`) actually correct?**
  _`mapProperty (Prisma->Domain)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AgentLoginPage`, `PublicHeader`, `Footer` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Acceptance Criteria Document` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `App Components & Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `Project Architecture & Tech Stack` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._