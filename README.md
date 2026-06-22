# go/links — Frontend

A web application for managing and using internal short links, inspired by Google's internal `go/` link system. Users access short URLs like `go/handbook` or `go/jira/PROJ-123` and are instantly redirected to their destinations.

## Overview

go/links allows teams to register memorable short aliases for long or frequently-used URLs. Links are accessed by navigating to `/<slug>` on the app's domain. Admins can create and manage links through a protected form; all users can browse the link directory with click metrics.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) with TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Auth:** [Auth0](https://auth0.com/) via `@auth0/nextjs-auth0`
- **Charts:** [Recharts](https://recharts.org/)
- **UI:** [Headless UI](https://headlessui.com/), [React Icons](https://react-icons.github.io/react-icons/), [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Backend:** [golinks-backend](https://github.com/jonas1307/golinks-backend) (.NET Web API)

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- A running instance of [golinks-backend](https://github.com/jonas1307/golinks-backend)
- An Auth0 tenant configured with the appropriate application and API

### Installation

```bash
yarn install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `AUTH0_SECRET` | Long random string used to encrypt the session cookie |
| `AUTH0_BASE_URL` | Public URL of this Next.js app (e.g. `http://localhost:3000`) |
| `AUTH0_ISSUER_BASE_URL` | Auth0 domain (e.g. `https://your-tenant.auth0.com`) |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the golinks backend (e.g. `https://localhost:5001`) |

### Running

```bash
yarn dev
```

The app will be available at `http://localhost:3000`.

## Architecture

The frontend acts as a **BFF (Backend for Frontend)**. Browser-side components never talk to the backend directly for authenticated operations — all mutations go through Next.js API routes (`/api/links`, `/api/links/[id]`) that inject the Auth0 Bearer token server-side.

The one exception is the public metrics endpoint (`GET /links/metrics`), which is unauthenticated and fetched directly from the browser.

```
Browser
  ├── GET /links/metrics             → Backend (public, no auth)
  ├── POST /api/links                → Next.js proxy → Backend (with Bearer token)
  ├── PUT /api/links/[id]            → Next.js proxy → Backend (with Bearer token)
  └── DELETE /api/links/[id]        → Next.js proxy → Backend (with Bearer token)

Server-side (getServerSideProps)
  └── POST /links/register-access/[slug]  → Backend (anonymous)
```

## Link Registration

Each link has three fields:

| Field | Required | Description |
|---|---|---|
| `url` | Yes | The destination URL (must be a valid `http` or `https` URL) |
| `slug` | Yes | The short alias used to access the link (max 100 characters, must be unique) |
| `description` | No | Human-readable description of the link (max 500 characters) |

## URL Parameters

Links support **positional parameters** using the `$1`, `$2`, `$N` syntax in the destination URL. Extra path segments added after the slug at access time are substituted in order.

### Syntax

Register a link with `$1`, `$2`, etc. as placeholders in the URL:

```
slug: gh
url:  https://github.com/$1
```

Then access it with additional path segments:

```
go/gh/react          →  https://github.com/react
go/gh/vuejs          →  https://github.com/vuejs
```

### Multiple Parameters

```
slug: pr
url:  https://github.com/my-org/$1/pull/$2
```

```
go/pr/frontend/42    →  https://github.com/my-org/frontend/pull/42
go/pr/api/137        →  https://github.com/my-org/api/pull/137
```

### More Examples

| Slug | URL | Access | Redirects to |
|---|---|---|---|
| `jira` | `https://jira.company.com/browse/$1` | `go/jira/PROJ-123` | `https://jira.company.com/browse/PROJ-123` |
| `docs` | `https://docs.company.com/$1/$2` | `go/docs/api/authentication` | `https://docs.company.com/api/authentication` |
| `meet` | `https://meet.google.com/abc-defg-hij` | `go/meet` | `https://meet.google.com/abc-defg-hij` |

### Rules

- Parameters are **positional** — they are filled in the order they appear in the URL
- If a `$N` placeholder has no matching segment in the access URL, it is replaced with an empty string
- If the URL contains no `$N` placeholders, extra path segments are ignored and the user is redirected to the base URL as-is

## Permissions

| Action | Scope required |
|---|---|
| Browse links and metrics | `golinks:user` |
| Create, edit, or delete links | `golinks:admin` |

Permissions are validated on both the frontend (UI visibility) and the backend (API enforcement).

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start the development server |
| `yarn build` | Build for production |
| `yarn start` | Start the production server |
| `yarn lint` | Run ESLint |
| `yarn prettier:check` | Check code formatting |
| `yarn prettier:write` | Auto-format all TypeScript files |
