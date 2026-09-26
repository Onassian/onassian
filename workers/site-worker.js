// Simple Worker to serve the pre-built static site
// Handles SPA routing: serves index.html for all routes

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve static assets directly
    if (path.startsWith('/assets/') || 
        path.startsWith('/img/') || 
        path.match(/\.(css|js|png|jpg|jpeg|webp|ico|svg|woff|woff2|ttf|eot)$/)) {
      return fetch(request);
    }

    // For all other routes, serve index.html (SPA fallback)
    const indexUrl = new URL('/index.html', request.url);
    return fetch(indexUrl);
  }
};
