# 🛍️ AEC Marketplace

> A full-stack inter-college buy & sell marketplace built for **Academic Exchange Center ** students and external users.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-green?style=flat-square&logo=supabase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Hosting-orange?style=flat-square)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=flat-square&logo=tailwindcss)
![JavaScript](https://img.shields.io/badge/JavaScript-JSX-yellow?style=flat-square&logo=javascript)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
  - [1. Clone the Repo](#1-clone-the-repo)
  - [2. Supabase Setup](#2-supabase-setup)
  - [3. Cloudinary Setup](#3-cloudinary-setup)
  - [4. Environment Variables](#4-environment-variables)
  - [5. Run Locally](#5-run-locally)
  - [6. Admin Dashboard](#6-admin-dashboard)
- [Deploying to Vercel](#deploying-to-vercel)
- [Updating After Deployment](#updating-after-deployment)
- [SEO](#seo)
- [Database Schema](#database-schema)
- [Common Errors](#common-errors)

---

## Overview

AEC Marketplace is a mobile-first web app where **AEC students and external users** can list items for sale and connect with buyers directly via WhatsApp. No payment gateway — pure peer-to-peer contact.

Live features:
- Browse products without login
- Login via Google or Email magic link
- Sell as AEC Student or External User
- Upload product photos (Cloudinary CDN)
- Connect with seller on WhatsApp (pre-filled message)
- Like & save products
- Separate Admin Dashboard with live analytics

---

## Features

| Feature | Details |
|---------|---------|
| 🔐 Auth | Google OAuth + Email Magic Link (Supabase) |
| 🛒 Buy | Browse, search, filter by category — no login needed |
| 🏷️ Sell | Step-by-step form: profile → product upload |
| 📸 Images | Multi-image upload with client-side compression (Cloudinary) |
| 💚 WhatsApp | Pre-filled message with buyer name, type, year, department |
| ❤️ Likes | Save favourite products |
| 👤 Profiles | AEC Student (dept + year) or External User (city) |
| 📊 Admin | Analytics dashboard with charts, user table, seller table |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite (JavaScript / JSX) |
| Styling | Tailwind CSS v3 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google + Email Magic Link) |
| Image Hosting | Cloudinary (25 GB free) |
| Routing | React Router v6 |
| Admin Panel | Plain HTML + Tailwind CDN + Chart.js |
| Fonts | Plus Jakarta Sans + Inter (Google Fonts) |

> ⚠️ This project is written in **JavaScript (JSX)**, not TypeScript.

---

## Project Structure

```
AEC-Marketplace/
├── aec-marketplace/          ← React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionBar.jsx      ← Buy/Sell tab switcher
│   │   │   ├── AuthModal.jsx      ← Login popup (Google + Email)
│   │   │   ├── Navbar.jsx         ← Top bar + hamburger drawer
│   │   │   └── ProductCard.jsx    ← Product grid card
│   │   ├── context/
│   │   │   └── AuthContext.jsx    ← Global auth state
│   │   ├── lib/
│   │   │   └── supabase.js        ← All Supabase + Cloudinary calls
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       ← Product feed with search/filter
│   │   │   ├── SellPage.jsx       ← 3-step sell flow
│   │   │   ├── ProductDetailPage.jsx  ← Full product + seller info
│   │   │   ├── LikedPage.jsx      ← Saved products
│   │   │   └── MyListingsPage.jsx ← Manage own listings
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── supabase-schema.sql        ← Run this in Supabase SQL Editor
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── aec-admin/
│   └── index.html                 ← Standalone admin dashboard
│
└── README.md
```

---

## Setup Guide

### 1. Clone the Repo

```bash
git clone https://github.com/Amanshaw445/AECmarketplace.git
cd AECmarketplace/aec-marketplace
npm install
```

---

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Once created, go to **SQL Editor** → paste the full contents of `supabase-schema.sql` → click **Run**
3. Go to **Authentication → Providers**:
   - Enable **Email** → turn OFF "Confirm email" → Save
   - Enable **Google** → paste your Google OAuth Client ID & Secret → Save
4. Go to **Authentication → URL Configuration**:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: add `http://localhost:5173`
   - After deploying, also add your Vercel URL here
5. Go to **Authentication → Email Templates** → customize each template with your branding
6. Go to **Settings → API** → copy:
   - **Project URL**
   - **anon public key**

---

### 3. Cloudinary Setup

Cloudinary is used instead of Supabase Storage because it gives **25 GB free** vs Supabase's 50 MB limit.

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. On the dashboard, note your **Cloud Name**
3. Go to **Settings → Upload → Upload Presets → Add upload preset**:
   - Preset name: `aec_marketplace`
   - Signing Mode: **Unsigned** ← critical
   - Folder: `aec-marketplace`
   - Click **Save**

**Free tier limits:**

| Feature | Free |
|---------|------|
| Storage | 25 GB |
| Bandwidth | 25 GB/month |
| Transformations | 25,000/month |

Images are auto-compressed client-side to ~300 KB before upload, so 25 GB = roughly **60,000+ product photos**.

---

### 4. Environment Variables

Create a `.env` file inside `aec-marketplace/` (copy from `.env.example`):

```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=aec_marketplace
```

> ⚠️ Never commit `.env` to GitHub. It is already in `.gitignore`.

---

### 5. Run Locally

```bash
cd aec-marketplace
npm run dev
```

App runs at → **http://localhost:5173**

Other commands:

```bash
npm run build      # Build for production
npm run preview    # Preview production build locally
```

---

### 6. Admin Dashboard

1. Open `aec-admin/index.html` directly in any browser (no server needed)
2. Enter your Supabase **Project URL** and **anon key** in the banner
3. Click **Connect** — credentials are saved to localStorage for future visits

The dashboard shows:
- Total users, students, external users, sellers, products, WhatsApp clicks
- Line charts for user growth, products per day, WhatsApp clicks
- Doughnut chart for student vs external ratio
- Searchable tables for users, sellers, products

---

## Deploying to Vercel

### First-time deployment

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Click **Add New Project** → import `AECmarketplace` from your GitHub
3. Set the **Root Directory** to `aec-marketplace`
4. Under **Environment Variables**, add all 4 variables from your `.env`:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_CLOUDINARY_CLOUD_NAME
   VITE_CLOUDINARY_UPLOAD_PRESET
   ```
5. Click **Deploy** — Vercel builds and gives you a live URL like `https://aec-marketplace.vercel.app`

### After deployment — update Supabase URLs

1. Supabase → **Authentication → URL Configuration**
2. Update **Site URL** to your Vercel URL: `https://aec-marketplace.vercel.app`
3. Add it to **Redirect URLs** too
4. Click **Save**

---

## Updating After Deployment

Every time you make changes to the code, follow these steps to push to GitHub and Vercel will **auto-deploy** within 1-2 minutes.

### Workflow for every update

```bash
# 1. Make your changes in VS Code

# 2. Open terminal inside aec-marketplace folder

# 3. Check what changed
git status

# 4. Stage all changes
git add .

# 5. Commit with a clear message describing what you changed
git commit -m "fix: updated product card layout"

# 6. Push to GitHub
git push
```

Vercel watches your GitHub repo and **automatically rebuilds and redeploys** every time you push. No manual steps needed on Vercel.

### Commit message conventions (good practice)

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature added |
| `fix:` | Bug fix |
| `style:` | UI/design change |
| `docs:` | README or documentation update |
| `refactor:` | Code cleanup, no feature change |

Example:
```bash
git commit -m "feat: added product condition field to sell form"
git commit -m "fix: whatsapp link not opening on iOS"
git commit -m "style: updated navbar color to match college brand"
```

### Updating environment variables on Vercel

If you ever change your Supabase or Cloudinary keys:
1. Go to [vercel.com](https://vercel.com) → your project
2. Click **Settings → Environment Variables**
3. Edit the variable → **Save**
4. Go to **Deployments** → click the three dots on the latest deploy → **Redeploy**

---

## SEO

The following SEO setup is already included in `index.html`. Update the values to match your college:

```html
<!-- index.html -->
<title>AEC Marketplace — Buy & Sell at Academic Exchange Center </title>
<meta name="description" content="AEC Marketplace is the official buy and sell platform for Academic Exchange Center  students. Find laptops, books, electronics and more from fellow students." />
<meta name="keywords" content="AEC Marketplace, Academic Exchange Center , buy sell college, student marketplace, college second hand" />
<meta name="author" content="Academic Exchange Center " />

<!-- Open Graph (WhatsApp / Facebook previews) -->
<meta property="og:title" content="AEC Marketplace" />
<meta property="og:description" content="Buy & sell within Academic Exchange Center  community." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://aec-marketplace.vercel.app" />
<meta property="og:image" content="https://aec-marketplace.vercel.app/og-image.png" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AEC Marketplace" />
<meta name="twitter:description" content="Buy & sell within Academic Exchange Center  community." />
```

### How to add this to your project

Open `aec-marketplace/index.html` and replace the `<head>` section with:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO -->
  <title>AEC Marketplace — Buy & Sell at Academic Exchange Center </title>
  <meta name="description" content="AEC Marketplace is the official buy and sell platform for Academic Exchange Center  students. Find laptops, books, electronics and more from fellow students." />
  <meta name="keywords" content="AEC Marketplace, Academic Exchange Center , buy sell college, student marketplace Tamil Nadu" />
  <meta name="author" content="Academic Exchange Center " />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://aec-marketplace.vercel.app" />

  <!-- Open Graph -->
  <meta property="og:title" content="AEC Marketplace — Buy & Sell at Academic Exchange Center " />
  <meta property="og:description" content="Buy & sell within the Academic Exchange Center  community. Students and external sellers welcome." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://aec-marketplace.vercel.app" />
  <meta property="og:image" content="https://aec-marketplace.vercel.app/og-image.png" />
  <meta property="og:site_name" content="AEC Marketplace" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AEC Marketplace" />
  <meta name="twitter:description" content="Buy & sell within Academic Exchange Center  community." />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.png" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
```

### SEO tips for better Google ranking

1. **Add a sitemap** — create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aec-marketplace.vercel.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

2. **Add robots.txt** — create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://aec-marketplace.vercel.app/sitemap.xml
```

3. **Create an OG image** — make a 1200×630 px image with your marketplace logo and save it as `public/og-image.png`

---

## Database Schema

```sql
users          → id, username, email, contact_number, whatsapp_number,
                 user_type (student/external), department, year,
                 city, occupation, created_at

products       → id, seller_id, name, description, price, category,
                 images (array of Cloudinary URLs), is_active, created_at

likes          → id, user_id, product_id, created_at

whatsapp_clicks → id, user_id, product_id, seller_id, created_at
```

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `ERR_NAME_NOT_RESOLVED` | `.env` not filled in or Vite not restarted | Fill in `.env`, restart with `npm run dev` |
| `relation users does not exist` | SQL schema not run | Run `supabase-schema.sql` in Supabase SQL Editor |
| Magic link opens page but not logged in | Redirect URL not set in Supabase | Add your URL in Authentication → URL Configuration |
| Images not uploading | Cloudinary preset not set to Unsigned | Set Signing Mode to **Unsigned** in Cloudinary |
| `new row violates row-level security` | RLS policies missing | Re-run the full `supabase-schema.sql` |
| Google login not working | OAuth redirect URI wrong | Add `https://your-project.supabase.co/auth/v1/callback` in Google Cloud Console |
| Vercel build fails | Missing env variables | Add all 4 env vars in Vercel → Settings → Environment Variables |

---

## License

MIT — free to use and modify for educational purposes.

---

<p align="center">Built with ❤️ for Academic Exchange Center </p>
