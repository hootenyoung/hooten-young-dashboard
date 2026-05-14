---
name: new-page
description: Scaffold a new React Router DOM 7 page/route. Activate when the user asks to "add a page", "create a route", "build the /something view", or names a new URL/path to add to the dashboard.
---

# new-page

Create a new page component and wire it into React Router 7.

## When to activate

- User asks to add / create / scaffold a page or route.
- User describes a screen by name ("the Friday review screen", "the SKU detail page").
- User says "let's add a /something route".

## Conventions to follow

1. **Location** — `src/routes/<PageName>.jsx`. One page per file.
2. **Naming** — PascalCase for the component, kebab-case for the URL path.
3. **Routing** — register the route in `src/router.jsx` (or wherever the route tree lives). Use Router 7's data router pattern (`createBrowserRouter` / `RouterProvider`).
4. **Data loading** — prefer route `loader` functions for initial data; use React state for interactive state. Don't fetch inside `useEffect` for page-load data.
5. **Layout** — pages live inside the shared `<DashboardLayout>` route; only create a new layout if the page is genuinely different (login screen, error boundary).
6. **Charts/components** — pages compose chart components from `src/components/charts/`. Don't put chart logic inline.
7. **Errors** — use Router 7's `errorElement` to render an error boundary for the route.
8. **Tests** — `src/routes/__tests__/<PageName>.test.jsx` with at least a render test inside a `MemoryRouter` or `RouterProvider`.

## Steps

1. Confirm the page name + URL path with the user.
2. Create the page component with a minimal layout (heading, breadcrumb, content area).
3. Wire the route into the router tree.
4. Create a test file with a render test.
5. Update `docs/architecture.md` via `/sync-architecture` if the route changes the surface meaningfully.
6. Report the created file paths and the new URL.

## Template

```jsx
import { Box, Typography } from "@mui/material";

/**
 * <PageName> — <one-line description of what this page does>.
 *
 * Route: <url-path>
 */
export function PageName() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: "Playfair Display, serif", mb: 3 }}>
        Page Title
      </Typography>
      {/* content */}
    </Box>
  );
}

// In src/router.jsx, add the route:
//   {
//     path: "url-path",
//     element: <PageName />,
//     errorElement: <RouteError />,
//   }
```
