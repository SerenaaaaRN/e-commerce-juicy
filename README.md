# Juicy Game

![Hero Screenshot](/public/hero_view.png)

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Validation:** Zod

## Screenshots

|                Dashboard Admin                 |
| :--------------------------------------------: |
| ![Admin Dashboard](/public/dashboard_view.png) |

# Struktur Project

```text
src/
├───app
│   ├───(admin)
│   │   └───dashboard
│   │       └───products
│   │           ├───create
│   │           └───[id]
│   │               └───edit
│   ├───(auth)
│   │   ├───auth
│   │   │   └───callback
│   │   └───login
│   └───(store)
│       └───products
│           └───[slug]
├───components
│   ├───admin
│   │   └───products
│   │       └───form-sections
│   ├───atoms
│   ├───layout
│   └───store
├───hooks
├───lib
│   ├───data
│   └───validation
├───types
└───utils
    └───supabase
```
