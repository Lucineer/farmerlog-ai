# FarmerLog AI

You keep farm records, but spreadsheets forget context and commercial software locks you out. This is an alternative: a single-file application that logs crops, weather impacts, and harvests. It runs on your own infrastructure, connects to your own AI keys, and follows the open Cocapn Fleet protocol.

**Live instance:** https://farmerlog-ai.casey-digennaro.workers.dev

---

### Why it exists
Farm management software is often built for large-scale operations. This provides a practical, modifiable tool for smaller-scale growers. You retain all data and control. Modify it for your specific fields, livestock, or seasons.

---

## How it works
- **No accounts or telemetry.** It operates anonymously.
- **Fork-first.** Deploy your own instance. The entire application is one source file.
- **Zero dependencies.** Runs on Cloudflare Workers with sub-100ms cold starts.
- **Fleet-native.** Works standalone or interoperates with other Cocapn vessels.

---

## Features
- **Crop & Livestock Logging** – Record plantings, herds, field rotations, and daily tasks.
- **Weather Impact Notes** – Log weather events and their observed effects on your fields.
- **Yield History** – Track harvest data across seasons to identify patterns.
- **Optional AI Chat** – Use your own LLM API key (DeepSeek, Moonshot, DeepInfra, or SiliconFlow).
- **Touch-Optimized UI** – A clean interface usable on a phone in the field.
- **Fleet Protocol** – Implements standard health, setup, and API endpoints.

**One limitation:** It requires an internet connection to run; offline sync is not included.

---

## Quick Start
1. **Fork** this repository.
2. **Deploy** with one command:  
   `npx wrangler deploy`
3. **Optionally, add an AI key** via Cloudflare Secrets (e.g., `DEEPSEEK_API_KEY`) to enable the chat assistant.

Visit your deployed worker’s URL. The dashboard is immediately functional.

---

## Contributing
Fork the repository, adapt it for your needs, and submit a pull request if you wish to contribute improvements. Follow the Cocapn Fleet protocol to maintain compatibility.

---

## License
MIT License

Superinstance & Lucineer (DiGennaro et al.)

---

<div>
  <a href="https://the-fleet.casey-digennaro.workers.dev">Fleet</a> · 
  <a href="https://cocapn.ai">Cocapn</a>
</div>