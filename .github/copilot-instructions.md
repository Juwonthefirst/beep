## Purpose

This file gives an AI coding agent the concrete, repo-specific knowledge needed to be productive quickly in `beep`.

Read this before editing code: it highlights architecture, runtime flows, and conventions observed in the codebase.

## Big picture

- **Framework & app model:** This is a Next.js (App Router) project (Next 16). Routes are inside `src/app` and use nested `layout.tsx` files and route-group folders that start with parentheses (for example, `(auth)` and `(main)`).
- **Server vs Client split:** Many files are server components by default. Files that run in the browser explicitly use `"use client"` (see providers and client components). Server-only functions use `"use server"` (see `src/utils/actions.ts`).
- **State & data flow:** Global data is provided via React providers in layouts: `QueryProvider` (React Query) and `ChatSocketProvider` (websocket connection). Layouts enforce authentication by checking cookies (see `src/app/(main)/layout.tsx`) and will `redirect` when not authenticated.

## Key subsystems and integration points

- **HTTP proxy API routes**: `src/app/api/[...path]/route.ts` proxies requests to the backend using `src/utils/request-client.ts`. It injects an access token (via `getORfetchAccessToken`) and returns JSON responses — treat these routes as the canonical server-client request bridge.
- **Authentication & tokens**: Server code reads cookies via `next/headers` (e.g., `cookies()` in layouts and server actions). Token refresh and fetch helper functions live under `src/utils/helpers/*.ts` and `src/utils/actions.ts` exposes higher-level server actions (login, signup, getAccessToken).
- **Websockets**: The WebSocket classes live in `src/utils/websocket-handlers.ts`. `ChatSocket` and `NotificationSocket` encapsulate reconnect logic, pending messages, and message dispatch. The client provider is `src/components/providers/chat-socket.provider.tsx` — it calls `chatSocket.connect()` on mount and waits until the connection state is `connected` or `reconnected` before rendering children.
- **React Query**: The app uses `@tanstack/react-query` with a `QueryProvider` wrapper in `src/components/providers/query.provider.tsx` (used in `(main)/layout.tsx`). Use React Query patterns when fetching and caching client data.

## Project-specific conventions and patterns

- **Route grouping:** The app router uses parentheses to create logical route groups: e.g., `src/app/(auth)` for auth flows and `src/app/(main)` for the authenticated UI. Providers are attached at layout boundaries inside those folders.
- **Providers in layouts:** Cross-cutting concerns (queries, sockets, notifications) are attached via layout wrappers. When adding global providers, prefer adding them to the appropriate `layout.tsx` rather than sprinkling across components.
- **Server actions & `request-client`**: All server-side HTTP calls that need cookies or CSRF tokens use server helpers and `request-client`. Client-side fetches should use the provided API proxy routes when they require auth tokens handled by the server.
- **Client vs Server files:** Files using browser APIs or WebSocket must include `"use client"`. A good example is `src/components/providers/chat-socket.provider.tsx` which is a client component that instantiates `ChatSocket`.
- **Environment variables:** Websocket URL is read from `process.env.NEXT_PUBLIC_WEBSOCKET_URL` (used by `ChatSocket`). Ensure environment is configured for local dev and deployment.

## Build / dev / test workflows (concrete commands)

- Develop locally: `pnpm dev` (package.json `dev` uses `next dev -H 0.0.0.0`).
- Build for production: `pnpm build` then `pnpm start` (uses `next build` and `next start`).
- Lint: `pnpm lint` (runs `eslint`).
- Package manager: `pnpm` is used and present in lockfile (`pnpm-lock.yaml`); other package managers will also work but `pnpm` is preferred.

## Files to consult (quick-read list)

- Layouts & routing: `src/app/layout.tsx`, `src/app/(main)/layout.tsx`, `src/app/(auth)/layout.tsx`.
- Providers: `src/components/providers/query.provider.tsx`, `src/components/providers/chat-socket.provider.tsx`.
- Websocket logic: `src/utils/websocket-handlers.ts`.
- Server actions/helpers: `src/utils/actions.ts`, `src/utils/helpers/server-helper.ts`.
- API proxy: `src/app/api/[...path]/route.ts` and specific routes such as `src/app/api/username/[username]/exists/route.ts`.
- HTTP client: `src/utils/request-client.ts` (see how headers and CSRF tokens are composed).

## How to approach edits as an AI agent (practical rules)

- Preserve server/client boundaries. If you modify a server-only file, do not add browser-only APIs — prefer `"use client"` in new client components.
- When adding network calls from client components that require auth, prefer calling the internal `/api/*` proxy routes so the server can attach tokens.
- When touching websocket behavior, update both `src/utils/websocket-handlers.ts` and the provider (`chat-socket.provider.tsx`) — provider controls connect lifecycle and rendering while the handler contains protocol details.
- Add environment variable usage to `next.config.ts` only if needed; prefer reading `process.env.NEXT_PUBLIC_*` at runtime for client-accessible vars.

## Examples (copyable snippets from repo)

- Check auth in layout (server component):

```ts
const cookieStore = await cookies();
if (!cookieStore.has("refresh_token")) redirect("/login");
```

- Websocket connect (client provider):

```ts
chatSocket.onConnectionStateChange = (s) => setConnectionState(s);
chatSocket.connect();
```

## When you need more context

- Ask the human for the backend API base URL and env variables if not present in CI/host.
- If a runtime token/secret is required and not committed, request secure access from maintainers.

---

If anything here is unclear or you want me to expand examples for specific files, tell me which area and I'll iterate.
