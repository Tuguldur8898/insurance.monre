# UX Research Document — insurance-monre

> **Version:** 1.0
> **Date:** 2026-07-20
> **Author:** UX Researcher (AI)
> **Based on:** business-requirements.md v1.0

---

## 1. Research Overview

### 1.1 Objectives
- Design a trustworthy, modern insurance platform site that converts visitors to login/contact
- Mobile-first experience for Mongolian users

### 1.2 Methodology
- Document analysis (BRD, site.config.json)
- Visual reference analysis (user-provided screenshots)

### 1.3 Scope
- Homepage, About page, Contact page, global header/footer

### 1.4 Key Findings Summary
1. **Trust is the primary job:** visuals must feel premium and secure (shield, glass, depth)
2. **Single primary action:** Нэвтрэх (login) must be visible in header and hero at all times
3. **Minimal navigation:** 3 items keep cognitive load near zero

## 2. User Personas

### Persona 1: Батбаяр — Urban professional

#### Demographics & Context
- **Age Range:** 28–40
- **Location:** Ulaanbaatar
- **Occupation:** Office worker / small business owner
- **Tech Proficiency:** Medium-high
- **Primary Device:** Smartphone

#### Behavioral Patterns
- **Usage Frequency:** Visits once to evaluate, returns to log in
- **Task Priorities:** Understand offering, trust brand, log in
- **Decision Factors:** Visual professionalism, clear contact info
- **Pain Points:** Cluttered insurer sites, jargon
- **Motivations:** Protect assets/family digitally

#### Goals & Needs
- **Primary Goals:** Evaluate and access the insurance platform
- **Success Criteria:** Finds login within 5 seconds

#### Quote
> "Энэ компанид итгэж болох уу гэдгийг эхний 5 секундэд мэдмээр байна."

### Persona 2: Corporate decision maker
- 35–55, evaluates credibility for partnership; scans About page and contact details.

## 3. Customer Journey Mapping

### Stage 1: Discovery
- **Touchpoints:** Social link, search, referral
- **User Actions:** Lands on homepage hero
- **Emotions:** Curious, skeptical
- **Opportunities:** Strong hero with shield visual + tagline builds instant trust

### Stage 2: Consideration
- **Touchpoints:** About section/page
- **User Actions:** Scrolls, reads mission/values
- **Emotions:** Evaluating
- **Opportunities:** Stats and values presented in glass cards

### Stage 3: Conversion
- **Touchpoints:** Header Нэвтрэх button, hero CTA, contact page
- **User Actions:** Clicks login or submits contact
- **Emotions:** Decisive
- **Opportunities:** High-contrast primary blue button always visible

### Stage 4: Retention
- **Touchpoints:** Return visits to log in
- **Opportunities:** Persistent header login button

## 4. Information Architecture & Sitemap

### 4.1 Content Hierarchy
```text
Home (/)
├── Hero (brand + CTA)
├── About summary
├── Contact strip (phone, web)
About (/about)
Contact (/contact)
```

### 4.2 Navigation Design
- **Primary Navigation:** Нүүр · Бидний тухай · Холбоо барих · [Нэвтрэх button]
- **Footer Navigation:** Same links + phone + website + copyright
- **Mobile Navigation:** Hamburger overlay with all items

### 4.3 Content Organization Principles
- Single-column storytelling on mobile; generous whitespace
- Primary CTA repeated at each scroll depth

## 5. Wireframe Guidance

### 5.1 Global Layout Structure
- **Header:** Fixed, glass/blur on scroll, logo left, nav right, login button far right
- **Footer:** Dark navy, two columns (links, contact), bottom bar copyright
- **Content Width:** Max 1200px
- **Grid System:** 12-col desktop, stacked mobile

### 5.2 Section Layouts

#### Hero
- **Layout Type:** Full-viewport, text left / 3D shield right (desktop), stacked (mobile)
- **Component Types:** Display heading, tagline, CTA button pair, floating glass orbs
- **Responsive Behavior:** Shield scales down, text centers on mobile

#### About summary
- **Layout Type:** 3 glass stat/value cards row
- **Responsive Behavior:** Stacks to single column

#### Contact strip
- **Layout Type:** Icon + info chips (phone, web) horizontally
- **Responsive Behavior:** Stacks vertically

### 5.3 Content Priority
1. **Homepage:** Hero → trust signals → about summary → contact → footer

### 5.4 Component Patterns
- **Cards:** Rounded-2xl glass with blur and soft blue shadow
- **Buttons:** Primary solid blue rounded-full; secondary ghost with border
- **Forms:** Large rounded inputs with labels above

## 6. Accessibility Requirements

### 6.1 WCAG 2.1 Level AA Compliance

| Requirement | Implementation | Priority |
|-------------|---------------|----------|
| Color Contrast | 4.5:1 text on glass backgrounds | High |
| Focus Indicators | Visible blue ring on all interactive elements | High |
| Keyboard Navigation | Full tab order through nav and forms | High |
| Alt Text | All decorative 3D marked decorative, content images described | High |
| Motion Sensitivity | Respect prefers-reduced-motion for floating animations | Medium |

### 6.3 Mobile Accessibility
- Touch targets ≥ 44px, login button full-width on mobile menu

## 7. Responsive Design Strategy

| Breakpoint | Width | Layout Changes |
|-----------|-------|----------------|
| Mobile | 375px | Stacked, hamburger nav |
| Tablet | 768px | Two-column where applicable |
| Desktop | 1280px | Full split hero, multi-column cards |

### 7.4 Performance Budget
- Mobile: < 1MB initial load; Desktop: < 2MB

## 8. Interaction & Motion Design

### 8.1 Animation Principles
Soft, slow, premium — floating glass elements, fade-up reveals on scroll. Motion level 3.

### 8.2 Micro-interactions

| Element | Trigger | Animation | Duration |
|---------|---------|-----------|----------|
| Login button | Hover | Glow/scale 1.03 | 200ms |
| Glass cards | Hover | Lift + deeper shadow | 250ms |
| Shield visual | Continuous | Gentle float/rotate | 6s loop |
| Sections | Scroll into view | Fade up 24px | 600ms |

### 8.4 Scroll Behaviors
Smooth scroll; header gains blur background after 40px.

## 9. Content Strategy & UX Writing

### 9.1 Tone of Voice
Modern, confident, trustworthy Mongolian; short sentences, no jargon.

### 9.3 CTA Copy Guidelines
- Primary: "Нэвтрэх", "Эхлэх"
- Secondary: "Дэлгэрэнгүй", "Холбоо барих"

## 10. Usability Testing Plan
- Scenario: find login in < 5s; find phone number in < 10s
- Success: 90%+ task completion

## 11. Competitive UX Analysis

| Competitor | Strengths | Weaknesses | Opportunities |
|-----------|-----------|------------|---------------|
| Gerege Insure | Recognizable blue brand | Flat, static | Deeper glassmorphism, motion, 3D |

## 12. Success Metrics & KPIs
- UX: task success for login/contact discovery
- Technical: LCP < 2.5s, CLS < 0.1

## 14. Assumptions & Constraints
- Single language (mn); login links externally
- Design based on user-provided screenshots, elevated

## 15. Next Steps
Proceed to Pencil design (Step 3.5) with glassmorphism ice-blue direction.
