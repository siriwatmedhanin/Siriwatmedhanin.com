/**
 * Cloudflare Pages Function: /api/auth
 * Initiates GitHub OAuth authentication for Decap CMS
 */

export async function onRequestGet(context) {
  const { env } = context;
  const clientId = env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response('Error: GITHUB_CLIENT_ID environment variable is missing in Cloudflare Pages.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // GitHub authorization endpoint
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('scope', 'repo,user');

  return Response.redirect(url.toString(), 302);
}
