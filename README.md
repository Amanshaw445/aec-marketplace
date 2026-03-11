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



MIT — free to use and modify for educational purposes.

---

<p align="center">Built with ❤️ for Academic Exchange Center </p>
