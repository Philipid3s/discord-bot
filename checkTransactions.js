const axios = require("axios");
const { 
    getDiscordUsersPortfolios,
    getLastTransactions
} = require('./master');

/**
 * @param {import('discord.js').Client} client
 * @param {string[]} usersToNotify - Array of Discord user IDs
 */
module.exports = async function checkTransactions(client, usersToNotify) {
    console.log("Checking for new transactions created...");
    try {
        // Get Users
        const users = await getDiscordUsersPortfolios();
        for (const user of users) {
            let countTransaction = 0;
            let environment = user.BinanceTest ? "testnet" : "live";
            let statusResponse = "Last Transactions created in 1 hour:\n";

            // Get Portfolios
            for (const portfolio of user.Portfolios) {
                let countTransactionTemp = 0;
                let statusResponseTemp = `\n${portfolio.Keyword}\n`;

                // Get Last Transactions
                const transactions = await getLastTransactions(user.UserUID, portfolio.Keyword, 1);
                for (const transaction of transactions) {
                    countTransactionTemp += 1;
                    statusResponseTemp += `${transaction.DealUID}: ${transaction.Type}, ${transaction.Volume}, ${parseFloat(parseFloat(transaction.Price).toFixed(0))}, ${transaction.Amount}\n`;
                }
                if (countTransactionTemp > 0) {
                    statusResponse += statusResponseTemp;
                    countTransaction += countTransactionTemp;
                }
            }

            // Send User Notification (Discord DM)
            if (countTransaction > 0) {
                // Map your user.TelegramUID to Discord user ID as needed
                // Here, we assume user.DiscordUID exists and is in usersToNotify
                const discordUserId = user.discord_id;
                if (usersToNotify.includes(discordUserId)) {
                    try {
                        const discordUser = await client.users.fetch(discordUserId);
                        await discordUser.send(statusResponse);
                        console.log(`Alert sent to Discord user ${discordUser.tag}`);
                    } catch (error) {
                        console.error(`Failed to send alert to Discord user ${discordUserId}:`, error);
                    }
                } else {
                    console.log(`Discord user ID ${discordUserId} not in usersToNotify`);
                }
            } else {
                console.log(`No new transaction for ${user.discord_name || user.discord_id}`);
            }
        }
    } catch (error) {
        console.error('Error fetching last transactions:', error.message);
    }
};