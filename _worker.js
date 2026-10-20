/**
 * Cloudflare Pages Advanced Worker: _worker.js
 * Handles Decap CMS GitHub OAuth authentication routes (/api/auth & /api/callback)
 * and falls back to serving static assets via env.ASSETS.fetch(request).
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    // ---- Handle CORS Preflight ----
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

    // ---- 1. /api/auth Endpoint ----
    if (pathname === '/api/auth') {
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

      // Redirect user to GitHub OAuth login
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('scope', 'repo,user');

      return Response.redirect(authUrl.toString(), 302);
    }

    // ---- 2. /api/callback Endpoint ----
    if (pathname === '/api/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        return renderResponse('error', {
          message: 'ไม่พบรหัสยืนยันตัวตน (Authorization Code) จาก GitHub',
        });
      }

      const clientId = env.GITHUB_CLIENT_ID;
      const clientSecret = env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return renderResponse('error', {
          message: 'ยังไม่ได้ตั้งค่า GITHUB_CLIENT_ID หรือ GITHUB_CLIENT_SECRET ใน Cloudflare Pages',
        });
      }

      try {
        // Exchange code for GitHub access token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': 'Siriwatmedhanin-DecapCMS-OAuth',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
          }),
        });

        const data = await tokenRes.json();

        if (data.error || !data.access_token) {
          return renderResponse('error', {
            message: data.error_description || data.error || 'ไม่สามารถขอ Access Token จาก GitHub ได้',
          });
        }

        const accessToken = data.access_token;

        // Fetch user profile from GitHub
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'Siriwatmedhanin-DecapCMS-OAuth',
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (!userRes.ok) {
          return renderResponse('error', {
            message: 'ไม่สามารถตรวจสอบข้อมูลบัญชี GitHub ของคุณได้',
          });
        }

        const githubUser = await userRes.json();
        const username = (githubUser.login || '').trim().toLowerCase();

        // Check against whitelist (default: siriwatmedhanin)
        const allowedUsers = (env.ALLOWED_GITHUB_USERS || 'siriwatmedhanin')
          .split(',')
          .map((u) => u.trim().toLowerCase())
          .filter(Boolean);

        let isAuthorized = allowedUsers.includes(username);

        // If not in whitelist, verify repository write/admin permission
        if (!isAuthorized) {
          try {
            const repoRes = await fetch(
              `https://api.github.com/repos/siriwatmedhanin/Siriwatmedhanin.com/collaborators/${username}/permission`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'User-Agent': 'Siriwatmedhanin-DecapCMS-OAuth',
                  Accept: 'application/vnd.github.v3+json',
                },
              }
            );

            if (repoRes.ok) {
              const permData = await repoRes.json();
              if (permData.permission === 'admin' || permData.permission === 'write') {
                isAuthorized = true;
              }
            }
          } catch (e) {
            // Keep isAuthorized false
          }
        }

        // Reject unauthorized users
        if (!isAuthorized) {
          return renderResponse('error', {
            message: `ไม่อนุญาตให้เข้าใช้งาน: บัญชี GitHub @${githubUser.login} ไม่มีสิทธิ์เข้าถึงระบบ CMS นี้ (Access Denied)`,
          });
        }

        // Send token to Decap CMS
        return renderResponse('success', {
          token: accessToken,
          provider: 'github',
        });
      } catch (err) {
        return renderResponse('error', {
          message: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ GitHub',
        });
      }
    }

    // ---- 3. Fallback to Static Assets ----
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};

function renderResponse(status, content) {
  const contentStr = JSON.stringify(content);
  const isSuccess = status === 'success';

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <title>${isSuccess ? 'ยืนยันตัวตนสำเร็จ' : 'การเข้าถึงถูกปฏิเสธ'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #fafafa;
      color: #333;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: white;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      max-width: 420px;
    }
    .status-icon {
      font-size: 40px;
      margin-bottom: 16px;
    }
    .error-msg {
      color: #c53030;
      font-weight: 500;
      font-size: 15px;
      line-height: 1.5;
    }
    .success-msg {
      color: #276749;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="status-icon">${isSuccess ? '✅' : '⛔'}</div>
    <div class="${isSuccess ? 'success-msg' : 'error-msg'}">
      ${isSuccess ? 'ยืนยันตัวตนสำเร็จ กำลังเปิดระบบ CMS...' : content.message}
    </div>
  </div>
  <script>
    (function () {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:github:${status}:${contentStr}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    status: isSuccess ? 200 : 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
