import { RenderMode, ServerRoute } from '@angular/ssr';

// Disable server-side prerendering during development to avoid
// mismatches and stale values on the dashboard. Render everything
// purely on the client instead.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
