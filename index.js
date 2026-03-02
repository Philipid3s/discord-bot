require('dotenv').config();

const { Client, GatewayIntentBits, ChannelType, Partials } = require('discord.js');

const checkTransactions = require('./checkTransactions');
const {
  checkBackendAvailability,
  getDiscordUserPortfolios,
  getLastTransactions
} = require('./master');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

const TOKEN = process.env.DISCORD_TOKEN;

const usersToNotify = [
  '215348009825730560' // Julien Discord ID
  // Add more user IDs as needed
];

let transactionCheckInterval = null;
let backendRetryInterval = null;

const startTransactionChecks = (clientInstance) => {
  if (transactionCheckInterval) return;

  checkTransactions(clientInstance, usersToNotify);
  transactionCheckInterval = setInterval(() => {
    checkTransactions(clientInstance, usersToNotify);
  }, 60 * 60 * 1000);
};

const waitForBackendAndStartChecks = async (clientInstance) => {
  const result = await checkBackendAvailability();
  if (result.ok) {
    console.log('Backend is reachable. Starting transaction checks.');
    startTransactionChecks(clientInstance);
    return;
  }

  console.error(`Backend unavailable: ${result.message}`);
  if (backendRetryInterval) return;

  console.log('Retrying backend check every 60 seconds.');
  backendRetryInterval = setInterval(async () => {
    const retryResult = await checkBackendAvailability();
    if (!retryResult.ok) {
      console.error(`Backend still unavailable: ${retryResult.message}`);
      return;
    }

    console.log('Backend recovered. Starting transaction checks.');
    clearInterval(backendRetryInterval);
    backendRetryInterval = null;
    startTransactionChecks(clientInstance);
  }, 60 * 1000);
};

client.once('ready', async () => {
  console.log(`Connected as ${client.user.tag}`);
  await waitForBackendAndStartChecks(client);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const isDM = message.channel.type === ChannelType.DM;

  if (isDM) {
    if (message.content === '!hello') {
      await message.reply('Hello, this is a private message response.');
    } else {
      await message.reply('Command not recognized in DM. Try `!hello`.');
    }
    return;
  }

  if (message.content === '!ping') {
    await message.reply('Pong!');
  }

  if (message.content === '!help') {
    await message.channel.send(`
Available commands:
- \`!ping\` -> Check if the bot is online
- \`!hello\` -> DM response
- \`!alert\` -> Test DM sending
- \`!lasttransactions\` -> Show your last 24h transactions
- \`!backend\` -> Check backend API availability
- \`!help\` -> Show this help message
    `);
  }

  if (message.content === '!backend') {
    const result = await checkBackendAvailability();
    if (result.ok) {
      await message.reply('Backend API is reachable.');
    } else {
      await message.reply(`Backend API unavailable: ${result.message}`);
    }
  }

  if (message.content === '!alert') {
    try {
      await message.author.send('This is a private message.');
      console.log(`DM sent to ${message.author.tag}`);
    } catch (error) {
      console.error(`Unable to send DM to ${message.author.tag}: ${error.message}`);
      await message.channel.send(`<@${message.author.id}> I could not send you a DM. Check your settings.`);
    }
  }

  if (message.content === '!lasttransactions') {
    try {
      const discordUserId = message.author.id;
      console.log(`!lasttransactions from discord id ${discordUserId}`);
      const user = await getDiscordUserPortfolios(discordUserId);
      if (!user) {
        await message.reply('You are not authorized to use this command.');
        return;
      }

      const portfolios = user.portfolio || user.Portfolios || [];
      let countPortfolio = 0;
      let statusResponse = '';

      for (const portfolio of portfolios) {
        if (countPortfolio > 0) statusResponse += '\n';
        statusResponse += `${portfolio.Keyword}\n`;
        countPortfolio += 1;

        const transactions = await getLastTransactions(user.UserUID, portfolio.Keyword, 24);
        for (const transaction of transactions) {
          statusResponse += `${transaction.DealUID}: ${transaction.Type}, ${transaction.Volume}, ${parseFloat(parseFloat(transaction.Price).toFixed(0))}, ${transaction.Amount}\n`;
        }

        if (transactions.length === 0) {
          statusResponse += 'None\n';
        }
      }

      if (portfolios.length === 0) {
        statusResponse += 'No Portfolio\n';
      }

      if (statusResponse.length > 1900) {
        await message.reply('Too many transactions to display. Please refine your request.');
      } else {
        await message.reply(statusResponse);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      await message.reply('Internal Error');
    }
  }
});

client.login(TOKEN);
