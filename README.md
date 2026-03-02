# Discord Bot

A Discord bot for portfolio and transaction notifications.

## Features

- Sends direct messages (DM) about new transactions every hour
- Supports commands:
  - `!ping` - Check if the bot is online
  - `!hello` - Get a DM reply from the bot
  - `!alert` - Test DM sending
  - `!lasttransactions` - Get your last 24h transactions
  - `!help` - List available commands

## Prerequisites

- Node.js 18+
- A Discord bot token
- A running backend API reachable at `API_BASE_URL` (default `http://127.0.0.1:5001`)

### Discord Developer Portal setup

In your bot application settings:
- Enable `MESSAGE CONTENT INTENT` under Privileged Gateway Intents
- Ensure the bot is invited to your server with permissions to read/send messages

## Setup

1. Clone the repository
   ```sh
   git clone <your-repo-url>
   cd discord-bot
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Configure environment variables

   Create a `.env` file at the project root:
   ```dotenv
   DISCORD_TOKEN=your_discord_bot_token_here
   API_BASE_URL=http://127.0.0.1:5001
   ```
4. Start the bot
   ```sh
   npm start
   ```

5. Verify backend connectivity
   ```sh
   curl -X POST http://127.0.0.1:5001/get_discord_users_portfolios
   ```
   A successful response confirms the bot can reach the backend.

## Configuration

- Add Discord user IDs to `usersToNotify` in `index.js` as strings
- Backend integration is implemented in `master.js`

## Backend API contract

`master.js` expects these POST endpoints on `API_BASE_URL`:
- `/get_discord_user_portfolios`
- `/get_discord_users_portfolios`
- `/get_deals`
- `/get_deals_valuation`
- `/get_last_transactions`
- `/get_deals_total_volume`
- `/get_deals_total_amount`
- `/get_deals_total_sold_amount`

Expected payload naming is currently mixed and should be preserved unless both sides are updated together:
- Discord ID field: `discord_id`
- Portfolio arrays may appear as `portfolio` or `Portfolios`

## File Structure

- `index.js` - Main bot logic and command handling
- `checkTransactions.js` - Periodic transaction checking and DM notifications
- `master.js` - API calls for user portfolios and transactions
- `.env` - Environment variables (not tracked by git)
- `.gitignore` - Files and folders excluded from git

## Security

- Never share your `.env` file or bot token
- `.env` is excluded from git by default

## Troubleshooting

- Backend unreachable on startup:
  - The bot now checks backend availability at startup.
  - If unavailable, it logs errors and retries every 60 seconds.
- Check backend from Discord:
  - Use `!backend` in a server channel to see current backend reachability.
- DM alert command fails:
  - Make sure the user allows DMs from server members.

## License

MIT
