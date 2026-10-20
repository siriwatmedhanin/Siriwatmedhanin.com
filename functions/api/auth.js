/**
 * Cloudflare Pages Function: /api/auth
 * Initiates GitHub OAuth authentication for Decap CMS
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const clientId = env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response(
      'Error: GITHUB_CLIENT_ID is not configured in Cloudflare Pages Environment Variables.',
      {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }
    );
  }

  // GitHub authorization endpoint
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('scope', 'repo,user');

  return Response.redirect(url.toString(), 302);
}

export async function onRequestGet(context) {
  return onRequest(context);
}
