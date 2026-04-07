# FarmerLog AI

You farm dirt, not spreadsheets. This is an AI companion that stays out of your way while you focus on what matters.

This is an independent vessel built for the Cocapn Fleet, designed for farmers, not agricultural software sales teams.

## Why this exists
Most farm software locks your data behind subscriptions, adds features you don't need, and requires a constant internet connection. This tool runs on edge infrastructure, puts you in control, and focuses on the tasks you actually need in the field. This core version has no subscriptions.

## Try It Now
Live demo: https://farmerlog-ai.casey-digennaro.workers.dev

No signup required. The public demo does not permanently store your data.

## What It Does
- **Crop Planning & History**: Log plantings, varieties, acreage, and field locations.
- **Weather Impact Logging**: Record frost, rain, and heat events to correlate with yields.
- **Yield Analysis**: Enter harvest data to get plain-language observations.
- **AI Chat**: Ask questions about your farm's history in plain English. Bring your own LLM API key; nothing is sent to third parties by default.
- **Field Operations Log**: Keep searchable notes for every field activity.
- **Commodity Price Tracking**: Monitor local market prices for your crops.

## How It Works
- Runs on your own Cloudflare Worker. You control the deployment and data.
- Zero runtime dependencies. Deploy it, and it will keep working.
- Follows a fork-first philosophy. Adapt it for your specific crops, livestock, or climate.
- Built for poor cell service; logic runs on the nearest edge node.

**One Honest Limitation**: While the app works with intermittent connections, the initial setup and configuration require an internet connection.

## Quick Start
1.  Fork this repository to your GitHub account.
2.  Deploy it to Cloudflare Workers: `npx wrangler deploy`.
3.  For AI features, add your preferred LLM API key via Cloudflare's Secrets. No key is needed for basic logging.

## Bring Your Own AI
Configure support for DeepSeek, Moonshot, DeepInfra, or SiliconFlow with a single environment variable. Visit `/setup` on your deployed instance for instructions.

## Architecture
FarmerLog AI implements the Cocapn Fleet protocol. All state is stored in your own Cloudflare KV namespace. There are no external service dependencies.

## Contributing
This project follows fork-first development. Fork the repository, build what you need for your operation, and open a pull request if you wish to contribute improvements back.

---

MIT License — Superinstance & Lucineer (DiGennaro et al.)

<div>
  <a href="https://the-fleet.casey-digennaro.workers.dev">Cocapn Fleet</a> · 
  <a href="https://cocapn.ai">Cocapn</a>
</div>