# Discord Bot

A Discord bot for portfolio and transaction notifications.

## Features

- Sends direct messages (DM) to users about new transactions every 5 minutes
- Responds to commands:
  - `!ping` – Check if the bot is online
  - `!hello` – Get a DM reply from the bot
  - `!alert` – Test DM sending
  - `!help` – List available commands
  - `!lasttransactions` – Get your last 24h transactions

## Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/discord-bot.git
   cd discord-bot
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file at the root of the project:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   ```

4. **Start the bot**
   ```sh
   npm start
   ```

## Configuration

- Add your Discord user IDs to the `usersToNotify` array in `index.js` to receive transaction notifications.
- The bot expects a backend API for portfolio and transaction data (see `master.js`).

## File Structure

- `index.js` – Main bot logic and command handling
- `checkTransactions.js` – Periodic transaction checking and DM notification
- `master.js` – API calls for user portfolios and transactions
- `.env` – Environment variables (not tracked by git)
- `.gitignore` – Files and folders to exclude from git

## Security

- **Never share your `.env` file or bot token.**
- The `.env` file is excluded from git by default.