export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.endsWith('.html')) {
      url.pathname = url.pathname.replace(/(?:\/index)?\.html$/, '') || '/';
      return Response.redirect(url.toString(), 301);
    }
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return new Response(response.body, {status: response.status, headers});
  }
};
