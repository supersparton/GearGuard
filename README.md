# 🛡️ GearGuard: The Ultimate Maintenance Tracker

**GearGuard** is a smart Maintenance Management System (CMMS) designed to bridge the gap between **Assets** (Machines, Work Centers), **Teams** (Technicians), and **Requests** (Work Orders).

Built for the **MERN/Vite Stack**, it features role-based dashboards, drag-and-drop Kanban boards, and intelligent workflow routing.

---

## 🚀 Key Features

### 1. 🧠 Smart Dashboards
- **Manager View:** A high-level command center with KPI cards (Critical Equipment, Technician Load), Analytics, and a Master Kanban Board.
- **Technician View:** A focused workspace showing only assigned tasks and specific "My Work" queues.

### 2. 🏭 Dual-Target Asset Management
- **Equipment Tracking:** Manage individual machines (e.g., "Samsung Monitor", "CNC Drill") with serial numbers and categories.
- **Work Center Tracking:** Manage physical locations (e.g., "Assembly Line 1") for area-based maintenance.
- **Context-Aware History:** "Smart Buttons" on asset pages instantly filter maintenance history for that specific machine.

### 3. 🔧 Advanced Request Workflow
- **Conditional Logic Forms:** The "New Request" engine dynamically switches fields based on whether the target is an **Asset** or a **Work Center**.
- **Kanban Board:** Drag-and-drop interface powered by `@dnd-kit` to move tickets from `New` → `In Progress` → `Repaired`.
- **Auto-Routing:** Automatically assigns the correct "Maintenance Team" (e.g., IT vs. Mechanics) based on the asset category.

### 4. 📅 Preventive Maintenance
- **Calendar Integration:** Schedule routine checkups (`Preventive`) that automatically appear on the integrated calendar.
- **Overdue Tracking:** Visual alerts (Red Strips) for requests that have passed their scheduled date.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 (TypeScript) + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **State Management:** TanStack React Query
- **Form Handling:** React Hook Form + Zod (Validation)
- **Drag & Drop:** @dnd-kit
- **Charts:** Recharts
- **Backend/Auth:** Supabase (PostgreSQL)

---

## 📂 Project Structure

```bash
GearGuard/
├── src/
│   ├── components/
│   │   ├── dashboard/    # KPI Cards, Charts
│   │   ├── kanban/       # Drag-and-drop Board components
│   │   ├── requests/     # Modal Forms (Complex Logic)
│   │   ├── equipment/    # Asset forms
│   │   └── ui/           # shadcn/ui primitives
│   ├── contexts/         # AuthContext (Role-based access)
│   ├── hooks/            # Custom hooks (useRequests, useEquipment)
│   ├── pages/            # Main Route Views
│   └── integrations/     # Supabase Client
└── public/
