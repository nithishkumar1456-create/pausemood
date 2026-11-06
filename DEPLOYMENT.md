# PauseMood Deployment Guide

This guide covers deploying the full-stack **PauseMood** application using **Vercel** (Frontend) and **Render** (Backend) for 100% free hosting.

---

## Architecture Overview

- **Frontend (`pausemood-app`)**: Hosted on **Vercel** (Global Edge CDN, automatic SPA rewrites, fast builds).
- **Backend (`backend`)**: Hosted on **Render** (Node.js Express Web Service).
- **Database & Auth**: Hosted on **Supabase** (Postgres + Auth).
- **Email Service**: Gmail SMTP (dispatches 6-digit OTP verification codes).

---

## Step 1: Deploy Backend to Render (Free)

1. Sign in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect:
   ```
   https://github.com/nithishkumar1456-create/pausemood
   ```
4. Configure the service:
   - **Name**: `pausemood-backend`
   - **Region**: Closest to you (e.g., Singapore, Oregon, Frankfurt)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Scroll down to **Environment Variables** and add the following keys:

   | Key | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Render default port |
   | `SUPABASE_URL` | *Your Supabase URL* | e.g. `https://xyz.supabase.co` |
   | `SUPABASE_ANON_KEY` | *Your Supabase Anon Key* | Public anon key |
   | `SUPABASE_SERVICE_ROLE_KEY`| *Your Service Role Key* | Secret service role key |
   | `CLIENT_ORIGIN` | `*` | Or your Vercel URL once deployed |
   | `SMTP_USER` | *Your Gmail Address* | For OTP email delivery |
   | `SMTP_PASS` | *Your 16-character Gmail App Password* | Google Account App Password |

6. Click **Create Web Service**.
7. Wait 1–2 minutes for the build to finish. Once live, copy your backend URL:
   ```
   https://pausemood-backend.onrender.com
   ```
   *(Verify by opening `https://pausemood-backend.onrender.com/api/health` in your browser → returns `{"status":"ok"}`)*.

---

## Step 2: Deploy Frontend to Vercel (Free)

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository:
   ```
   nithishkumar1456-create/pausemood
   ```
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select **`pausemood-app`** (Important!)
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
   - **Install Command**: `npm install` (Default)

5. Expand **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `VITE_API_URL` | `https://pausemood-backend.onrender.com` *(your Render URL from Step 1)* |

6. Click **Deploy**.
7. Vercel will build and deploy the React frontend in ~30 seconds. Your live URL will look like:
   ```
   https://pausemood-xyz.vercel.app
   ```

---

## Step 3: Connect Frontend and Backend CORS

1. Go back to your [Render Dashboard](https://dashboard.render.com).
2. Select your `pausemood-backend` service → **Environment**.
3. Update `CLIENT_ORIGIN` to your new Vercel domain:
   ```
   CLIENT_ORIGIN=https://pausemood-xyz.vercel.app
   ```
4. Click **Save Changes** (Render will automatically redeploy with the strict origin).

---

## Verification Checklist

- [ ] Visit your Vercel app URL: `https://pausemood-xyz.vercel.app`
- [ ] Landing page loads with crowd canvas hero and **"Get Started"** / **"Log In"** CTAs.
- [ ] Click **"Start Check-in"** → redirects to `/login`.
- [ ] Enter Name, Email, Password → 6-digit OTP code arrives in inbox.
- [ ] Verify OTP code → redirects immediately to `/dashboard`.
- [ ] Dashboard displays centered FlipLinks navigation and top-right mood pull-cord switch.
- [ ] Pull the cord → Dark mode applies smoothly across all pages.
- [ ] Click **Check-In** → Save a mood entry with tags and optional notes.
- [ ] Click **History** → View your 7-day emotional journey and pastel glow cards.

