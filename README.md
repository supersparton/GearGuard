# GearGuard - Maintenance Management System

The Ultimate Maintenance Tracker for equipment and work centers.

## 📁 Project Structure

```
GearGuard/
├── src/
│   ├── components/      # UI components
│   ├── contexts/        # React contexts (Auth)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   └── integrations/    # Supabase client
├── public/              # Static assets
└── package.json
```

## 🚀 Getting Started

```bash
cd GearGuard
npm install
npm run dev
```

## 🔑 Environment Variables

Create `.env` in the GearGuard folder:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🔧 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Real-time)
- **Deployment:** Vercel

## 📜 License

MIT
