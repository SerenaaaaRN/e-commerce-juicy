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
│       ├───cart
│       └───products
│           └───[slug]
├───components
│   ├───admin
│   ├───atoms
│   └───layout
├───hooks
├───lib
│   └───validation
├───modules
│   ├───auth
│   │   └───components
│   ├───cart
│   │   ├───components
│   │   └───services
│   ├───dashboard
│   │   ├───components
│   │   └───services
│   ├───products
│   │   ├───components
│   │   │   └───form-sections
│   │   └───services
│   └───store
│       └───components
├───types
└───utils
    └───supabase
```
