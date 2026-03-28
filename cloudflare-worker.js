// ABPS — Cloudflare Worker OAuth Proxy for Decap CMS
// Deploy at workers.cloudflare.com
// Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET as Secret environment variables

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/auth") {
    const redirectUrl = new URL("https://github.com/login/oauth/authorize");
    redirectUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
    redirectUrl.searchParams.set("scope", "repo,user");
    redirectUrl.searchParams.set("state", url.searchParams.get("state") || "");
    return Response.redirect(redirectUrl.toString(), 302);
  }

  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code
        })
      }
    );

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return new Response(`Auth error: ${tokenData.error_description}`, { status: 400 });
    }

    const message = `authorization:github:success:${JSON.stringify({
      token: tokenData.access_token,
      provider: "github"
    })}`;

    const html = `<!DOCTYPE html>
<html><head><title>Authorizing...</title></head><body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage('${message}', e.origin);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
<\/script>
<p>Authorizing, please wait...</p>
</body></html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }

  return new Response("Not found", { status: 404 });
}
