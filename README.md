# FarmerLog AI

You log field tasks with dirt on your hands. This is the simple tool for that. Log a planting, and you can optionally ask an AI for companion planting suggestions based on your notes. It runs on Cloudflare Workers with zero dependencies.

## Why
Most farm software imposes a complex workflow, locks your data, or charges a recurring fee. This was built for daily use on a small vegetable farm. There is no product roadmap. It is a logging tool that you control.

## How It Works
1.  You fork this repository and deploy it to your own Cloudflare Worker.
2.  You add your planting logs, task notes, and harvest records. All data stays in your Worker's KV storage.
3.  If you add an AI API key via a Cloudflare Secret, you can ask for companion planting advice. Your farm data is not sent to any AI service unless you explicitly use the query box.

The entire application is a single source file under 300 lines that you can review.

## Start
1.  **Fork** this repository.
2.  Run `npx wrangler deploy` to deploy to your Cloudflare account.
3.  To enable the AI companion, set your API key as a secret: `npx wrangler secret put AI_API_KEY`.

A working dashboard will be ready in under two minutes.

Live example: [farmerlog-ai.casey-digennaro.workers.dev](https://farmerlog-ai.casey-digennaro.workers.dev)

## What You Can Do
*   Log plantings, field tasks, and harvest yields.
*   Add observational notes on weather and soil conditions.
*   Query an optional AI assistant (supports DeepSeek, Moonshot, and others) for companion planting ideas.
*   Use the touch-optimized interface on a phone in the field.
*   Your data persists in your own Cloudflare KV store.

**A specific limitation:** This is a single-page web app. Your browser tab must stay open to retain unsaved edits; there is no offline caching or automatic background sync.

## Building On It
Fork and adapt it for your own farm, crops, and climate. If you make a generally useful improvement, consider a pull request. Please maintain compatibility with the Cocapn Fleet protocol.

## License
MIT License

Superinstance and Lucineer (DiGennaro et al.)

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>