// ---------------------------------------------------------------------------
// Cloudflare Worker backstop for the daily edition.
// Fires on Cloudflare's clock and pokes the GitHub workflow via
// repository_dispatch. Deploy: wrangler deploy workers/cron-worker.js
// Set secrets: wrangler secret put GITHUB_TOKEN (repo scope), then
// wrangler secret put GITHUB_REPO (e.g. "Onassian/onassian")
// ---------------------------------------------------------------------------

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(triggerWorkflow(env));
  },
};

async function triggerWorkflow(env) {
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'onassian-cron-worker',
    },
    body: JSON.stringify({ event_type: 'daily-edition' }),
  });
  console.log('Workflow dispatched:', res.status);
}
