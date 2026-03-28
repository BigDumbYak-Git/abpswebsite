# ABPS — Angie Barton Professional Services Website

Static site built with Eleventy (11ty), Decap CMS, and hosted on Cloudflare Pages.

## Stack
| Layer | Tool |
|---|---|
| Static site generator | Eleventy v2 |
| Templating | Nunjucks |
| CMS | Decap CMS |
| CMS Auth | Cloudflare Worker OAuth proxy |
| Hosting | Cloudflare Pages |
| Forms | Formspree |

## Local Development

```bash
npm install
npm start        # preview at http://localhost:8080
```

## Build & Deploy

Every `git push` to `main` triggers an automatic Cloudflare Pages build.
**Always batch your changes into one commit.**

```bash
git add .
git commit -m "Describe your changes"
git push
```

## Before Going Live — Setup Checklist

### 1. Formspree
- Created account at formspree.io
- Create a new form
- Copy the form URL (e.g. `https://formspree.io/f/xabcdefg`)
- Paste it into `src/_data/settings/general.json` → `formspreeUrl`
- Also update it in the CMS under Site Settings

### 2. GitHub OAuth App
- GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
- Homepage URL: your Cloudflare Pages URL
- Callback URL: `https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/callback`
- Copy Client ID and Client Secret

### 3. Cloudflare Worker
- Create a Worker at workers.cloudflare.com
- Paste the OAuth proxy script (see project template docs)
- Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` as Secret variables

### 4. Update admin/config.yml
Replace the three placeholders:
```yaml
repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
base_url: https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev
site_url: https://YOUR-SITE.pages.dev
```

### 5. Cloudflare Pages Build Settings
| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `_site` |

### 6. GoDaddy DNS
Point your domain to Cloudflare Pages:
- Add a CNAME record: `www` → `YOUR-SITE.pages.dev`
- Or follow Cloudflare Pages custom domain instructions

## CMS Access

Once live: `https://your-domain.com/admin/`

Sign in with your GitHub account.
