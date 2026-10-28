# bhvr 🦫

![cover](https://cdn.stevedylan.dev/ipfs/bafybeievx27ar5qfqyqyud7kemnb5n2p4rzt2matogi6qttwkpxonqhra4)

A full-stack TypeScript monorepo starter with shared types, using Bun, Hono, Vite, and React.

## Why bhvr?

While there are plenty of existing app building stacks out there, many of them are either bloated, outdated, or have too much of a vendor lock-in. bhvr is built with the opinion that you should be able to deploy your client or server in any environment while also keeping type safety.

## Features

- **Full-Stack TypeScript**: End-to-end type safety between client and server
- **Shared Types**: Common type definitions shared between client and server
- **Monorepo Structure**: Organized as a workspaces-based monorepo with Turbo for build orchestration
- **Modern Stack**:
  - [Bun](https://bun.sh) as the JavaScript runtime and package manager
  - [Hono](https://hono.dev) as the backend framework
  - [Vite](https://vitejs.dev) for frontend bundling
  - [React](https://react.dev) for the frontend UI
  - [Turbo](https://turbo.build) for monorepo build orchestration and caching

## Project Structure

```
.
├── client/               # React frontend
├── server/               # Hono backend
├── shared/               # Shared TypeScript definitions
│   └── src/types/        # Type definitions used by both client and server
├── package.json          # Root package.json with workspaces
└── turbo.json            # Turbo configuration for build orchestration
```

### Server

bhvr uses Hono as a backend API for its simplicity and massive ecosystem of plugins. If you have ever used Express then it might feel familiar. Declaring routes and returning data is easy.

```
server
├── bun.lock
├── package.json
├── README.md
├── src
│   └── index.ts
└── tsconfig.json
```

```typescript src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', async (c) => {

  const data: ApiResponse = {
    message: "Hello BHVR!",
    success: true
  }

  return c.json(data, { status: 200 })
})

export default app
```

If you wanted to add a database to Hono you can do so with a multitude of Typescript libraries like [Supabase](https://supabase.com), or ORMs like [Drizzle](https://orm.drizzle.team/docs/get-started) or [Prisma](https://www.prisma.io/orm)

### Client

bhvr uses Vite + React Typescript template, which means you can build your frontend just as you would with any other React app. This makes it flexible to add UI components like [shadcn/ui](https://ui.shadcn.com) or routing using [React Router](https://reactrouter.com/start/declarative/installation).

```
client
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

```typescript src/App.tsx
import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { ApiResponse } from 'shared'
import './App.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()

  async function sendRequest() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`)
      const res: ApiResponse = await req.json()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/stevedylandev/bhvr" target="_blank">
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="card">
        <button onClick={sendRequest}>
          Call API
        </button>
        {data && (
          <pre className='response'>
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
      <p className="read-the-docs">
        Click the beaver to learn more
      </p>
    </>
  )
}

export default App
```

### Shared

The Shared package is used for anything you want to share between the Server and Client. This could be types or libraries that you use in both environments.

```
shared
├── package.json
├── src
│   ├── index.ts
│   └── types
│       └── index.ts
└── tsconfig.json
```

Inside the `src/index.ts` we export any of our code from the folders so it's usable in other parts of the monorepo

```typescript
export * from "./types"
```

By running `bun run dev` or `bun run build` it will compile and export the packages from `shared` so it can be used in either `client` or `server`

```typescript
import { ApiResponse } from 'shared'
```

## Getting Started

### Quick Start

You can start a new bhvr project using the [CLI](https://github.com/stevedylandev/create-bhvr)

```bash
bun create bhvr
```

### Installation

```bash
# Install dependencies for all workspaces
bun install
```

### Development

```bash
# Run all workspaces in development mode with Turbo
bun run dev

# Or run individual workspaces directly
bun run dev:client    # Run the Vite dev server for React
bun run dev:server    # Run the Hono backend
```

### Building

```bash
# Build all workspaces with Turbo
bun run build

# Or build individual workspaces directly
bun run build:client  # Build the React frontend
bun run build:server  # Build the Hono backend
```

### Additional Commands

```bash
# Lint all workspaces
bun run lint

# Type check all workspaces
bun run type-check

# Run tests across all workspaces
bun run test
```

### Deployment

Deplying each piece is very versatile and can be done numerous ways, and exploration into automating these will happen at a later date. Here are some references in the meantime.

**Client**
- [Orbiter](https://orbiter.host)
- [GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [Netlify](https://vite.dev/guide/static-deploy.html#netlify)
- [Cloudflare Pages](https://vite.dev/guide/static-deploy.html#cloudflare-pages)

**Server**
- [Cloudflare Worker](https://gist.github.com/stevedylandev/4aa1fc569bcba46b7169193c0498d0b3)
- [Bun](https://hono.dev/docs/getting-started/bun)
- [Node.js](https://hono.dev/docs/getting-started/nodejs)

## The card PWA

`card.lbdluxe.com` is an installable web app: a digital business card that lives on the home screen and opens with no browser bars, works with no signal, and hands over a scannable QR code.

### How the pieces fit together

| Piece | Where | What it does |
| --- | --- | --- |
| `client/public/manifest.webmanifest` | static | The installable app's name, icons, colours and shortcuts |
| `client/public/sw.js` | static | The service worker — caches the shell and the card data |
| `client/src/lib/pwa.ts` | source | Registers the worker and wraps the install prompt |
| `client/src/components/pages/card/install-button.tsx` | source | The "Add to Home Screen" button |
| `client/src/components/pages/card/card-qr.tsx` | source | The full-screen QR code |

The worker is **only registered on the card host**. A service worker is scoped to its origin, so `lbdluxe.com`, `links.lbdluxe.com` and `shop.lbdluxe.com` are untouched — they serve the manifest and the worker file inertly.

### Precaching the build output

Vite's output filenames carry a content hash, so the worker cannot know them ahead of time. The `pwa-precache` plugin in `client/vite.config.ts` works out which files the card actually needs — the ones the built HTML references, plus the card route's code-split chunk and everything either of them imports — and injects that list into `dist/sw.js` at build time.

Without it the card has no JavaScript the first time it is opened offline, and only ever shows the loading screen.

### Regenerating the icons

The icons are generated from the monogram in `client/index.html` so they can never drift from what the site boots with:

```bash
cd client
bun run icons
```

This writes `client/public/icons/{icon-192,icon-512,maskable-512,apple-touch-icon-180}.png`.

### Caching rules

| Request | Strategy | Offline |
| --- | --- | --- |
| Navigations | Network first, cached `/card` as the fallback | Yes |
| `/assets/*`, `/fonts/*`, `/icons/*` | Cache first (the filenames are content hashed) | Yes |
| `GET /cms/business-card` | Network first, cached response as the fallback | Yes |
| Images from the CMS | Stale while revalidate, but only when the size is knowable | Usually — the card falls back to its own gradient and initials |

Cross-origin images are served from S3 without CORS headers, so the browser hands the worker an opaque response whose size it cannot read. Caching those would let one oversized photo fill the device's quota, so they are left to the browser's own HTTP cache and the card falls back to its placeholder artwork when they are missing.

### Notes

- `/sw.js` is served with `no-store` in `client/public/_headers`. A cached worker is how updates silently fail to reach apps that are already installed.
- Bump `VERSION` in `client/public/sw.js` when the caching rules change. It namespaces the caches and the old ones are dropped on activate.
- The card keeps a copy of its own data in `localStorage` under `card.cache.v1`, so it still renders if the browser has no service worker at all.

## Type Sharing

Types are automatically shared between the client and server thanks to the shared package and TypeScript path aliases. You can import them in your code using:

```typescript
import { ApiResponse } from 'shared/types';
```

## Learn More

- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Hono Documentation](https://hono.dev/docs)
- [Turbo Documentation](https://turbo.build/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
