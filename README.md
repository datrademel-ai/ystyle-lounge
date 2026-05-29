# Y Style Lounge — Deployment Guide

## Stack
- **Frontend**: React + Vite
- **Database + Auth**: Supabase (free tier)
- **Hosting**: Cloudflare Pages (free)
- **Domain**: Cloudflare Registrar (recommended)

---

## Step 1 — Supabase Setup

1. Go to https://supabase.com → New Project
   - Name: `ystyle-lounge`
   - Region: `Southeast Asia (Singapore)` ← closest to Melbourne
   - Generate a strong DB password and save it

2. Once created → **SQL Editor** → paste and run `supabase-schema.sql`

3. Go to **Settings → API** and copy:
   - Project URL
   - anon/public key

4. Create `.env` file (copy from `.env.example`):
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

---

## Step 2 — GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit — Y Style Lounge"
git remote add origin https://github.com/YOUR_USERNAME/ystyle-lounge.git
git push -u origin main
```

---

## Step 3 — Cloudflare Pages

1. Go to https://dash.cloudflare.com → **Pages → Create a project**
2. Connect your GitHub repo
3. Build settings:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Environment variables** → add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Deploy → Cloudflare gives you a free `*.pages.dev` URL immediately

---

## Step 4 — Domain (Cloudflare Registrar)

1. Go to https://dash.cloudflare.com → **Registrar → Register Domain**
2. Search `ystylelounge.com.au` (~AUD $20/year via a .au registrar)
   - Note: `.com.au` requires an ABN — use Crazy Domains or VentraIP
   - Alternative: `ystylelounge.com` via Cloudflare Registrar (~USD $10/year)
3. In Cloudflare Pages → Custom Domains → add your domain
4. DNS is auto-configured if domain is on Cloudflare

---

## Step 5 — Create Admin User

1. Go to your live site → Account section → Register
2. Use your admin email and password
3. Go to Supabase Dashboard → **Authentication → Users**
4. Click your user → **Edit** → User Metadata → set:
   ```json
   {"role": "admin"}
   ```
5. Admin panel is at: `https://yourdomain.com/admin`

---

## Local Development

```bash
cd ystyle
npm install
cp .env.example .env
# Fill in .env with your Supabase credentials
npm run dev
# Opens at http://localhost:5173
```

---

## File Structure

```
ystyle/
├── index.html
├── vite.config.js
├── wrangler.toml
├── supabase-schema.sql
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/
    │   └── supabase.js
    ├── components/
    │   ├── Nav.jsx
    │   ├── Services.jsx
    │   ├── Prices.jsx
    │   ├── Booking.jsx
    │   ├── Member.jsx
    │   └── Misc.jsx
    └── pages/
        ├── Home.jsx
        ├── AdminLogin.jsx
        └── AdminDashboard.jsx
```

---

## Updating Content

| What to change | File |
|---|---|
| Services & prices | `src/components/Services.jsx`, `src/components/Prices.jsx` |
| Opening hours | `src/components/Misc.jsx` → `Hours()` |
| Contact details | `src/components/Misc.jsx` → `Contact()` |
| Testimonials | `src/components/Misc.jsx` → `Testimonials()` |
| Available time slots | `src/components/Booking.jsx` → `ALL_SLOTS` |
| Closed days | `src/components/Booking.jsx` → `CLOSED_DAYS` |

Every `git push` to `main` → Cloudflare auto-redeploys in ~60 seconds.
