# HANDOFF — insurance-monre

## 0. Approval Record

- Design source: user-provided screenshots (light ice-blue glassmorphism INSURE PLATFORM hero; dark navy MONRE INSURANCE hero)
- User instruction: build directly without Pencil previews ("pencil deer zurahguigeer shuud hii")
- Selected direction: **Glass Future (light ice-blue)** — improved evolution of the screenshot reference
- Locked constraints:
  - Header: logo left, nav right, solid blue "Нэвтрэх" (Login) button
  - Hero: light blue glassy 3D shield visual, "INSURE PLATFORM" style display heading + tagline
  - Contact strip: phone + website chips with blue circular icons
  - Footer: dark navy bar, copyright left, "Powered by" right
  - Language: Mongolian (mn) only
  - Sections: hero, about, contact

## 1. Frontend Build Map

Homepage section sequence:
1. Header (GlassNav, blur on scroll)
2. HeroSection — split layout, display heading + tagline left, 3D shield scene right, CTA buttons
3. Trust/stats strip (3 glass cards)
4. AboutSection — mission text + value cards
5. ContactSection — phone/website chips + CTA
6. Footer (dark navy)

Routes:
- `/[locale]` → homepage (sections above)
- `/[locale]/[slug]` → dynamic CMS page (about, contact) rendered from `cpPages`
- Header login button → external `https://insure.gerege.mn` (configurable via `NEXT_PUBLIC_LOGIN_URL`)

Components:
- `components/layout/Header.tsx` — glass nav, mobile hamburger
- `components/layout/Footer.tsx` — dark navy footer
- `components/motion/FadeIn.tsx` — scroll reveal (framer-motion + react-intersection-observer)
- `components/effects/ShieldScene.tsx` — CSS/SVG 3D glass shield with floating orbs
- `components/effects/GlassCard.tsx` — translucent panel
- `components/sections/HeroSection.tsx`, `AboutSection.tsx`, `ContactSection.tsx`, `StatsStrip.tsx`

## 2. erxes CMS Field Map

- CMS ID: `6a5d86633b8bb0044203e69d` (language: mn)
- Pages:
  - `home` — hero heading/subtitle + about summary + contact info (rendered on `/`)
  - `about` — standalone `/about` page
  - `contact` — standalone `/contact` page
- Menus:
  - header: Нүүр `/` (order 1), Бидний тухай `/about` (order 2), Холбоо барих `/contact` (order 3)
  - footer: Нүүр `/`, Бидний тухай `/about`, Холбоо барих `/contact`
- No blog. No custom post types.

## Design summary

- Visual direction: glass-future (light)
- Motion level: 3 (Expressive) — framer-motion reveals, lenis smooth scroll, CSS ambient floats
- Fonts: Geist Sans (display + body), Geist Mono — Cyrillic supported via system fallback stack
- Primary color: royal blue `#2563EB` on ice-blue `#F4F8FF` background; deep navy `#0A1B3D` footer
- Radius: 2xl cards, full buttons; Shadows: soft blue glass shadows + cyan glow accents

## Libraries

- framer-motion — reveals, hero entrance, micro-interactions
- lenis — smooth scroll
- react-intersection-observer — scroll triggers
- lucide-react — icons (Shield, Phone, Globe, Menu, X, ArrowRight)
- clsx + tailwind-merge — class utilities

## Animation rules

- Hero: staggered fadeUp (heading → tagline → CTAs), shield floats in with scaleIn, continuous gentle float loop
- Sections: FadeIn on scroll into view, 90ms stagger for card groups
- Buttons: hover scale 1.03 + glow shadow, 200ms
- Header: transparent → glass blur after 40px scroll
- `prefers-reduced-motion`: all animations collapse to instant

## Responsive behavior

- Mobile (375px): stacked hero (shield below text, centered), hamburger menu, full-width login button
- Tablet (768px): two-column stats, centered hero
- Desktop (1280px): split hero, 3-col stats, max-width 1200px container

## Accessibility notes

- Contrast ≥ 4.5:1 (navy text on ice background)
- Focus rings: `ring-2 ring-blue-600`
- Decorative 3D/SVG marked `aria-hidden`
- Reduced motion respected via `useReducedMotion`

## Content tone (mn)

Modern, confident, trustworthy. Short sentences. No jargon. CTAs: "Нэвтрэх", "Дэлгэрэнгүй", "Холбоо барих".
