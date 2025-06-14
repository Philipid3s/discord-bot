require('dotenv').config();

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const checkTransactions = require('./checkTransactions');
const { getDiscordUserPortfolios, getLastTransactions } = require('./master');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: ['CHANNEL']
});

const TOKEN = process.env.DISCORD_TOKEN;

const usersToNotify = [
  '215348009825730560'
];

// ✅ DM toutes les 5 min
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  setInterval(() => {
    checkTransactions(client, usersToNotify);
  }, 5 * 60 * 1000);
});

// ✅ Un seul bloc messageCreate
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  console.log('📝 Message reçu. Type de canal:', message.channel.type, 'Contenu:', message.content);

  const isDM = message.channel.type === ChannelType.DM;


  if (isDM) {
    if (message.content === '!hello') {
      await message.reply('👋 Bonjour, ceci est une réponse en message privé !');
    } else {
      await message.reply("🤖 Commande non reconnue en DM. Essaie `!hello`.");
    }
  } else {
    if (message.content === '!ping') {
      await message.reply('🏓 Pong!');
    }

    if (message.content === '!help') {
      await message.channel.send(`
📜 **Commandes disponibles :**
- \`!ping\` → Vérifie si le bot répond.
- \`!hello\` → Réponse en DM
- \`!alert\` → Teste l'envoi d’un DM
- \`!help\` → Affiche ce message
      `);
    }

    if (message.content === '!alert') {
      try {
        await message.author.send("🔒 Ceci est un message privé !");
        console.log(`✅ DM envoyé à ${message.author.tag}`);
      } catch (error) {
        console.error(`❌ Impossible d’envoyer un DM à ${message.author.tag}: ${error.message}`);
        await message.channel.send(`<@${message.author.id}> Je n’ai pas pu t’envoyer de DM. Vérifie tes paramètres.`);
      }
    }

    if (message.content === '!lasttransactions') {
    try {
      // Get User
      const user = await getDiscordUserPortfolios(message.author.id);
      if (!user) {
        await message.reply('You are not authorized to use this command.');
        return;
      }

      // Get Portfolios
      let countPortfolio = 0;
      let statusResponse = "";
      for (const portfolio of user.Portfolios) {
        if (countPortfolio > 0)
          statusResponse += "\n";
        statusResponse += `${portfolio.Keyword}\n`;
        countPortfolio += 1;

        // Get Last Transactions (24h)
        const transactions = await getLastTransactions(user.UserUID, portfolio.Keyword, 24);
        for (const transaction of transactions) {
          statusResponse += `${transaction.DealUID}: ${transaction.Type}, ${transaction.Volume}, ${parseFloat(parseFloat(transaction.Price).toFixed(0))}, ${transaction.Amount}\n`;
        }
        if (transactions.length === 0)
          statusResponse += "None\n";
      }
      console.log(statusResponse);

      // Discord messages have a 2000 character limit
      if (statusResponse.length > 1900) {
        await message.reply('Too many transactions to display. Please refine your request.');
      } else {
        await message.reply(statusResponse);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      await message.reply('Internal Error');
    }
    return;
  }
  }
});

client.login(TOKEN);
