# Business Requirements Document — insurance-monre

> **Version:** 1.0
> **Date:** 2026-07-20
> **Author:** Business Analyst (AI)
> **Status:** Approved (user instructed to proceed directly)

---

## 1. Executive Summary

insurance.monre is a modern digital insurance platform website for the Mongolian market. The site presents the company's insurance products, builds trust through a polished modern glassmorphism visual identity (light ice-blue palette, 3D shield imagery), and converts visitors into customers via a login/onboarding call-to-action. The site is managed through erxes CMS and deployed to Vercel.

## 2. Business Objectives & Success Metrics

| # | Objective | Success Metric | Target |
|---|-----------|---------------|--------|
| 1 | Present insurance platform professionally | Bounce rate | < 50% |
| 2 | Convert visitors to registered users | Login/signup clicks | Growing monthly |
| 3 | Build brand trust | Time on About page | > 60s |

## 3. Stakeholder Analysis

| Role | Name/Department | Responsibility |
|------|----------------|---------------|
| Owner | MONRE Insurance | Business decisions, content approval |
| Content admin | Marketing | CMS content updates |
| Developer | AI pipeline | Build and deploy |

## 4. Scope

### 4.1 In-scope
- Homepage with hero, about summary, contact info
- About page (/about)
- Contact page (/contact)
- Header navigation with Нүүр, Бидний тухай, Нэвтрэх (login) button
- Footer with contact info and copyright
- erxes CMS integration for pages and menus
- Vercel deployment

### 4.2 Out-of-scope
- Actual insurance purchase/checkout flow
- Claims processing
- Real authentication backend (login button links to external platform)

## 5. Target Audience & User Personas

### Primary Persona
- **Demographics:** 25–45, Mongolia (Ulaanbaatar), professionals and business owners
- **Goals:** Quickly understand the insurance offering, trust the company, log in or make contact
- **Pain Points:** Distrust of unknown insurers, complex insurance jargon
- **Tech Proficiency:** Medium-high, mobile-first users

### Secondary Persona
- **Demographics:** Corporate clients, 30–55, decision makers
- **Goals:** Evaluate company credibility and product range before partnership

## 6. Site Information Architecture & Sitemap

### 6.1 Page Hierarchy
```text
Home (/)
├── About (/about)
└── Contact (/contact)
```

### 6.2 Navigation Structure
- **Header:** Нүүр (/), Бидний тухай (/about), Холбоо барих (/contact), Нэвтрэх (login button)
- **Footer:** Нүүр, Бидний тухай, Холбоо барих, phone, website, copyright
- **Mobile:** Hamburger menu with same items

## 7. Functional Requirements

### 7.1 Section-specific Requirements

#### Hero
- **Purpose:** Immediate brand impact and value proposition
- **Content:** Platform name, tagline, 3D shield visual
- **CTA:** Нэвтрэх / Дэлгэрэнгүй
- **Interactions:** Subtle floating 3D/glass animation

#### About
- **Purpose:** Build trust, explain the company
- **Content:** Company mission, values, stats
- **CTA:** Contact or login

#### Contact
- **Purpose:** Let visitors reach the company
- **Content:** Phone (976-7011-6240), website (insure.gerege.mn style), address, form
- **CTA:** Submit inquiry

### 7.2 E-commerce Requirements
None.

### 7.3 Content Management Requirements
All page content and navigation menus managed via erxes CMS (cpPages, cpMenus) in Mongolian.

### 7.4 Multi-language Requirements
Mongolian (mn) only.

### 7.5 User Account & Authentication
Login button in header links to external insurance platform; no on-site auth.

### 7.6 Search & Filtering
Not required.

## 8. Non-functional Requirements

### 8.1 Performance
- Page load time: < 3 seconds
- LCP: < 2.5s, CLS: < 0.1

### 8.2 SEO
- Semantic HTML, meta titles/descriptions, Mongolian content indexing

### 8.3 Accessibility
- WCAG 2.1 AA contrast, keyboard navigation, focus indicators

### 8.4 Security
- HTTPS via Vercel, no client-side secrets beyond public CMS token

### 8.5 Browser & Device Support
- Modern Chrome/Safari/Firefox/Edge, mobile-first responsive

## 9. Design Direction

### 9.1 Visual Style
Modern glassmorphism: translucent panels, soft depth, 3D shield/protection imagery, light and airy surfaces with deep navy accents. Improved evolution of the provided INSURE PLATFORM screenshots.

### 9.2 Color Palette
- Primary: Ice blue / royal blue (#2563EB range)
- Secondary: Deep navy (#0A1B3D range)
- Accent: Bright cyan-sky (#38BDF8 range)
- Neutral: White, pale blue-white gradients (#F0F6FF)

### 9.3 Typography
Modern geometric sans-serif; Cyrillic-first support (Mongolian content), bold display headings.

### 9.4 Imagery & Photography
3D glass renders of shields, charts, abstract blue waves; no stock photography of people required.

## 10. CTA Strategy & Conversion Goals

| Location | CTA Text | Destination | Goal |
|----------|----------|------------|------|
| Header | Нэвтрэх | Login platform | User acquisition |
| Hero | Нэвтрэх / Дэлгэрэнгүй | Login / About | Conversion |
| Footer | Холбоо барих | /contact | Lead capture |

## 11. Success Metrics & Acceptance Criteria

### 11.1 Quantitative Metrics
- Build passes, deployed live on Vercel
- CMS pages and menus verified via GraphQL

### 11.2 Qualitative Criteria
- Visual fidelity to approved design direction
- Trustworthy, premium feel

## 12. Assumptions & Constraints

### Assumptions
- Login button destination URL provided later or linked to existing platform
- Content will be seeded in Mongolian by the pipeline

### Constraints
- Single language (mn)
- Business template only, no e-commerce

## 13. References & Appendices

### 13.1 Reference Documents
- User-provided screenshots: light blue glassmorphism INSURE PLATFORM hero, dark navy MONRE INSURANCE hero

### 13.2 Competitor Analysis

| Competitor | URL | Strengths | Weaknesses |
|-----------|-----|-----------|------------|
| insure.gerege.mn | https://insure.gerege.mn | Clean blue style | Static, less immersive |

### 13.3 Glossary

| Term | Definition |
|------|-----------|
| CMS | erxes content management system |
| Hero | Top visual section of homepage |
