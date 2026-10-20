/**
 * Cloudflare Pages Function: /api/callback
 * Exchanges GitHub OAuth code for access token, strictly verifies user authorization,
 * and sends token back to Decap CMS window ONLY if authorized.
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

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return renderResponse('error', { message: 'Missing authorization code from GitHub.' });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return renderResponse('error', { message: 'GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing.' });
  }

  try {
    // 1. Exchange OAuth code for GitHub access token
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
        message: data.error_description || data.error || 'Failed to obtain access token from GitHub.',
      });
    }

    const accessToken = data.access_token;

    // 2. Fetch authenticated GitHub user details
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Siriwatmedhanin-DecapCMS-OAuth',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      return renderResponse('error', { message: 'ไม่สามารถตรวจสอบข้อมูลบัญชี GitHub ได้' });
    }

    const githubUser = await userRes.json();
    const username = (githubUser.login || '').trim().toLowerCase();

    // 3. Strict Authorization Verification:
    // Check against configured whitelist (defaulting to repository owner: 'siriwatmedhanin')
    const allowedUsersConfig = (env.ALLOWED_GITHUB_USERS || 'siriwatmedhanin')
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean);

    let isAuthorized = allowedUsersConfig.includes(username);

    // If not explicitly in the whitelist, check if the user has collaborator write/admin rights on the repo
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
          const perm = permData.permission; // 'admin', 'write', 'read', 'none'
          if (perm === 'admin' || perm === 'write') {
            isAuthorized = true;
          }
        }
      } catch (e) {
        // Keep isAuthorized false
      }
    }

    // 4. Deny access if user is not authorized
    if (!isAuthorized) {
      return renderResponse('error', {
        message: `ไม่อนุญาตให้เข้าใช้งาน: บัญชี GitHub @${githubUser.login} ไม่มีสิทธิ์เข้าถึงระบบ CMS นี้ (Access Denied: Only authorized owners can access.)`,
      });
    }

    // 5. Authorized: Deliver token to Decap CMS
    return renderResponse('success', {
      token: accessToken,
      provider: 'github',
    });
  } catch (err) {
    return renderResponse('error', { message: err.message || 'OAuth authentication process failed.' });
  }
}

export async function onRequestGet(context) {
  return onRequest(context);
}

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
