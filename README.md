# Sasu.ai — starter web app

This is a mobile-first AI story and storyboard generator. It is a real starter application, not a fully deployed hosted service.

## What works
- Responsive Sasu.ai creation interface.
- Category, language, style, aspect ratio and duration settings.
- Server-side Gemini text generation endpoint.
- Story, character consistency guide, scene narration, individual image prompts and image-to-video prompts.
- Local browser project history and JSON export.

## What is not connected yet
- Actual image generation.
- Actual video clip generation.
- Text-to-speech audio generation.
- MP4 rendering, payments, user accounts and social publishing.

These require separate provider accounts/API access and secure integration. This project does not pretend those features are already available.

## Run locally
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Gemini API key as `GEMINI_API_KEY`.
5. Run `npm run dev`.

## Deploy
Deploy this Next.js project to a hosting provider that supports server-side routes (for example, Vercel). Add `GEMINI_API_KEY` as a server-side environment variable in the hosting dashboard. Never put the key in client-side code or commit `.env.local`.

## Android-only note
You can manage hosting and environment variables from a mobile browser, but initial project setup and troubleshooting are easier on a computer. This starter does not require Lovable credits; AI model usage is subject to the Gemini API's current free/paid quotas and terms.

## Security and production checklist
- Add authentication and per-user data isolation before public launch.
- Add rate limiting, abuse protection and request-size limits.
- Add usage metering and clear credit/refund rules.
- Store generated assets in private cloud storage with expiring download URLs.
- Add moderation and user reporting.
- Add provider-specific image, video and speech integrations only after checking current API access, cost, rights and output restrictions.
