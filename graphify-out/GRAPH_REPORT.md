# Graph Report - src  (2026-06-15)

## Corpus Check
- Corpus is ~20,773 words - fits in a single context window. You may not need a graph.

## Summary
- 355 nodes · 501 edges · 28 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.81)
- Token cost: 0 input · 360,891 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin & Audit Management|Admin & Audit Management]]
- [[_COMMUNITY_Property Filters & Form UI|Property Filters & Form UI]]
- [[_COMMUNITY_shadcn Primitives & cn()|shadcn Primitives & cn()]]
- [[_COMMUNITY_Admin Server Actions|Admin Server Actions]]
- [[_COMMUNITY_Property Server Actions|Property Server Actions]]
- [[_COMMUNITY_UI Component Exports|UI Component Exports]]
- [[_COMMUNITY_Auth & Login Flow|Auth & Login Flow]]
- [[_COMMUNITY_Data Mapping & Pages|Data Mapping & Pages]]
- [[_COMMUNITY_Status Badges & Formatting|Status Badges & Formatting]]
- [[_COMMUNITY_Property Listing Components|Property Listing Components]]
- [[_COMMUNITY_Dialog & Delete Confirm|Dialog & Delete Confirm]]
- [[_COMMUNITY_Contact Form & Rate Limit|Contact Form & Rate Limit]]
- [[_COMMUNITY_Header & Logout|Header & Logout]]
- [[_COMMUNITY_Contact Submission|Contact Submission]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 31 edges
2. `cn() class merge util` - 21 edges
3. `Prisma client singleton` - 18 edges
4. `requireSuperadmin()` - 14 edges
5. `getCurrentUser()` - 11 edges
6. `requireSuperadmin()` - 10 edges
7. `formatRupiah()` - 9 edges
8. `loginAction()` - 8 edges
9. `getCurrentUser()` - 8 edges
10. `Input()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `DashboardLayout()` --calls--> `getCurrentUser()`  [INFERRED]
  app\agent\dashboard\layout.tsx → lib\auth.ts
- `PropertyDetailPage()` --calls--> `getCurrentUser()`  [INFERRED]
  app\agent\dashboard\[id]\page.tsx → lib\auth.ts
- `EditPropertyPage()` --calls--> `getProperty()`  [INFERRED]
  app\agent\dashboard\[id]\edit\page.tsx → lib\actions\properties.ts
- `handleSubmit()` --calls--> `loginAction()`  [INFERRED]
  app\agent\login\page.tsx → lib\actions\auth.ts
- `handleConfirm()` --calls--> `deleteProperty()`  [INFERRED]
  components\property\DeletePropertyDialog.tsx → lib\actions\properties.ts

## Hyperedges (group relationships)
- **Login authentication + lockout flow** — authaction_loginAction, ratelimit_checkLockout, session_createSession, db_prisma [EXTRACTED 0.85]
- **Superadmin property mutation + audit logging** — properties_updateProperty, auth_requireSuperadmin, properties_diffProperty, types_AuditLog [EXTRACTED 0.85]
- **Prisma row to serializable domain mapping** — mappers_mapProperty, mappers_mapUser, mappers_mapAuditLog, db_prisma [INFERRED 0.75]
- **Agent dashboard pages under DashboardLayout** — dashboardlayout_DashboardLayout, dashboardpage_DashboardPage, adminspage_AdminManagementPage, auditlogpage_AuditLogPage, createpage_CreatePropertyPage, detailpage_PropertyDetailPage, editpage_EditPropertyPage [INFERRED 0.85]
- **Auth gating via getCurrentUser across protected pages** — auth_getCurrentUser, dashboardlayout_DashboardLayout, adminspage_AdminManagementPage, auditlogpage_AuditLogPage, detailpage_PropertyDetailPage, loginpage_AgentLoginPage, auth_loginAction [INFERRED 0.85]
- **Public pages under PublicLayout** — publiclayout_PublicLayout, page_LandingPage, aboutpage_AboutPage, contactpage_ContactPage, layout_PublicHeader [INFERRED 0.85]
- **Dashboard Property Listing Composition** — dashboardlistingclient_dashboardlistingclient, propertyfilters_propertyfilters, propertytable_propertytable, filterchips_filterchips [EXTRACTED 0.95]
- **Luxury Public Landing Sections** — areasshowcase_areasshowcase, propertytypes_propertytypes, processsteps_processsteps, testimonials_testimonials, featuredcard_featuredcard [INFERRED 0.85]
- **Property Status & Readiness Badges Shared Across Listing UIs** — statusbadge_statusbadge, statusbadge_siapbadge, propertytable_propertytable, propertycard_propertycard [EXTRACTED 0.95]
- **Radix overlay/portal primitives** — dialog_Dialog, sheet_Sheet, popover_Popover, dropdownmenu_DropdownMenu, select_Select, tooltip_Tooltip [INFERRED 0.85]
- **class-variance-authority variant primitives** — badge_Badge, button_Button, tabs_Tabs [EXTRACTED 1.00]
- **Radix form-control primitives** — checkbox_Checkbox, radiogroup_RadioGroup, switch_Switch, label_Label [INFERRED 0.75]

## Communities

### Community 0 - "Admin & Audit Management"
Cohesion: 0.06
Nodes (50): AdminActions, AdminAddDialog, createAdmin() action, getSuperadmin (action), listAdmins() action, resetAdminPassword() action, toggleAdminActive() action, AdminManagementPage (+42 more)

### Community 1 - "Property Filters & Form UI"
Cohesion: 0.05
Nodes (19): countActiveFilters(), filtersToParams(), submit(), toInput(), FormControl(), FormMessage(), Input(), Label() (+11 more)

### Community 2 - "shadcn Primitives & cn()"
Cohesion: 0.06
Nodes (6): cn(), Checkbox(), CommandGroup(), CommandItem(), Popover(), PopoverTrigger()

### Community 3 - "Admin Server Actions"
Cohesion: 0.11
Nodes (21): createAdmin(), errMsg(), getSuperadmin(), listAdmins(), resetAdminPassword(), toggleAdminActive(), listAuditLogs(), AdminActions() (+13 more)

### Community 4 - "Property Server Actions"
Cohesion: 0.1
Nodes (18): buildOrderBy(), buildWhere(), createProperty(), diffProperty(), errMsg(), getFeaturedProperties(), getProperty(), getPropertyStats() (+10 more)

### Community 5 - "UI Component Exports"
Cohesion: 0.14
Nodes (22): Badge, Button, Card, Checkbox, Command, Dialog, DropdownMenu, Form (+14 more)

### Community 6 - "Auth & Login Flow"
Cohesion: 0.16
Nodes (13): clientIp(), getMe(), loginAction(), logoutAction(), handleLogout(), checkLockout(), clearFailedAttempts(), recordLoginAttempt() (+5 more)

### Community 7 - "Data Mapping & Pages"
Cohesion: 0.11
Nodes (21): Enum options & ID labels (single source of truth), DashboardPage (listing), PropertyDetailPage, EditPropertyPage, Decimal/BigInt/Date→serializable conversion, mapProperty() Prisma→domain, LandingPage (public home), buildWhere() Prisma filter builder (+13 more)

### Community 8 - "Status Badges & Formatting"
Cohesion: 0.22
Nodes (7): SiapBadge(), StatusBadge(), formatDimensi(), formatRupiah(), formatRupiahRingkas(), formatTanggal(), formatTanggalWaktu()

### Community 9 - "Property Listing Components"
Cohesion: 0.23
Nodes (14): updateProperty (server action), DashboardListingClient, FeaturedCard, FilterChips, MultiSelect, PropertyCard, PropertyFilterState (type), PropertyFilters (+6 more)

### Community 10 - "Dialog & Delete Confirm"
Cohesion: 0.24
Nodes (5): deleteProperty(), AdminAddDialog(), handleConfirm(), Dialog(), DialogTrigger()

### Community 11 - "Contact Form & Rate Limit"
Cohesion: 0.36
Nodes (6): submitContact(), handleSubmit(), validate(), checkContactRateLimit(), handleSubmit(), validate()

### Community 12 - "Header & Logout"
Cohesion: 0.5
Nodes (4): logoutAction (server action), DashboardHeader, Logo, PublicHeader

### Community 13 - "Contact Submission"
Cohesion: 1.0
Nodes (3): submitContact (server action), ContactForm, ContactFormLux

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (2): loginAction (action), AgentLoginPage

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (2): ContactPage, ContactFormLux

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (2): LuxButton, LuxLink

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (2): deleteProperty (server action), DeletePropertyDialog

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (1): proxy matcher config (/agent/:path*)

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (1): formatTanggal() (WIB)

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): AboutPage

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (1): StatCard

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): Footer

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (1): AreasShowcase

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (1): ProcessSteps

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (1): PropertyTypes

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): Testimonials

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (1): Toaster (Sonner)

## Knowledge Gaps
- **48 isolated node(s):** `proxy matcher config (/agent/:path*)`, `Optimistic cookie check (full auth in server)`, `useAuth hook`, `ForbiddenError class`, `Enum options & ID labels (single source of truth)` (+43 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 18`** (2 nodes): `loginAction (action)`, `AgentLoginPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `ContactPage`, `ContactFormLux`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `LuxButton`, `LuxLink`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `deleteProperty (server action)`, `DeletePropertyDialog`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `proxy matcher config (/agent/:path*)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `formatTanggal() (WIB)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `AboutPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `StatCard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `Footer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `AreasShowcase`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `ProcessSteps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `PropertyTypes`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `Testimonials`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `Toaster (Sonner)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `shadcn Primitives & cn()` to `Property Filters & Form UI`, `Admin Server Actions`, `Property Server Actions`, `Auth & Login Flow`, `Status Badges & Formatting`, `Dialog & Delete Confirm`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `Status Badges & Formatting` to `Property Server Actions`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Input()` connect `Property Filters & Form UI` to `shadcn Primitives & cn()`, `Dialog & Delete Confirm`, `Contact Form & Rate Limit`, `Auth & Login Flow`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `requireSuperadmin()` (e.g. with `listAdmins()` and `getSuperadmin()`) actually correct?**
  _`requireSuperadmin()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getCurrentUser()` (e.g. with `DashboardLayout()` and `PropertyDetailPage()`) actually correct?**
  _`getCurrentUser()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `proxy matcher config (/agent/:path*)`, `Optimistic cookie check (full auth in server)`, `useAuth hook` to the rest of the system?**
  _48 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin & Audit Management` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._