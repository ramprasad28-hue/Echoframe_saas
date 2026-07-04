# EchoFrame — Static Website

A dependency-free, multi-page static website: plain HTML5, CSS3, and vanilla JavaScript. No build step, no framework, no npm install required.

## Structure

```
echoframe-website/
├── index.html          Home / landing page
├── pricing.html         Pricing page (monthly/annual toggle)
├── integrations.html    Integrations page (category filtering)
├── login.html            Auth: log in
├── signup.html           Auth: sign up
├── dashboard.html         Static preview of the in-app dashboard (dark mode default)
├── css/
│   ├── tokens.css         Design tokens (color, type, spacing, radius, shadow, motion) as CSS variables
│   ├── base.css           Reset + base element styles
│   ├── components.css      Buttons, nav, cards, badges, forms, footer, toast
│   ├── layout.css          Layout primitives (grid, split sections, CTA band, auth shell)
│   └── pages.css           Page-specific styles (hero visual, pricing cards, integrations grid, dashboard shell)
└── js/
    └── main.js             Mobile nav, theme toggle, scroll reveal, pricing toggle,
                              integration filter, form handling, dashboard demo interactions
```

## Running it

No build step. Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.:

```
npx serve .
```

or

```
python3 -m http.server
```

## Deploying

This folder can be deployed as-is to any static host (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, GitHub Pages). There is no server-side code and no environment configuration required.

## Notes

- Dark mode is the default theme on `dashboard.html` (matches the product's in-app default); light mode is default everywhere else (marketing convention). Both are fully supported — toggle via the moon/sun icon on the dashboard, or by setting `data-theme="dark"` on the `<html>` element on any page.
- All colors, spacing, radius, and typography derive from `css/tokens.css` — no hardcoded values elsewhere in the CSS.
- Respects `prefers-reduced-motion`.
- Fonts load from Google Fonts (Inter) with a system-font fallback stack if the request fails or is blocked.
