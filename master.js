const axios = require("axios");

const getDiscordUserPortfolios = async (discordUID) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_discord_user_portfolios', { DiscordUID: discordUID });
        let userPortfolios = [];
        if (response.status === 200) {
            userPortfolios = response.data;
        }
        return userPortfolios[0];
    } catch (error) {
        console.error('Error fetching user and portfolios:', error.message);
        return null;
    }
};

const getDiscordUsersPortfolios = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_discord_users_portfolios');
        let users = [];
        if (response.status === 200) {
            users = response.data;
        }
        return users;
    } catch (error) {
        console.error('Error fetching users and portfolios:', error.message);
        return [];
    }
};

const getDeals = async (userUID, keyword) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_deals', {
            UserUID: userUID,
            Keyword: keyword
        });
        let deals = [];
        if (response.status === 200) {
            deals = response.data;
        }
        return deals;
    } catch (error) {
        console.error('Error fetching deals:', error.message);
        return [];
    }
};

const getDealsValuation = async (userUID, keyword) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_deals_valuation', {
            UserUID: userUID,
            Keyword: keyword
        });
        let deals = [];
        if (response.status === 200) {
            deals = response.data;
        }
        return deals;
    } catch (error) {
        console.error('Error fetching last errors:', error.message);
        return [];
    }
};

const getLastTransactions = async (userUID, keyword, hours) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_last_transactions', {
            UserUID: userUID,
            Keyword: keyword,
            Hours: hours
        });
        let transactions = [];
        if (response.status === 200) {
            transactions = response.data;
        }
        return transactions;
    } catch (error) {
        console.error('Error fetching last transactions:', error.message);
        return [];
    }
};

const getDealsTotalVolume = async (userUID, keyword) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_deals_total_volume', {
            UserUID: userUID,
            Keyword: keyword
        });
        let record = {};
        if (response.status === 200) {
            record = response.data;
        }
        return record;
    } catch (error) {
        console.error('Error fetching last valuation:', error.message);
        return [];
    }
};

const getDealsTotalAmount = async (userUID, keyword) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_deals_total_amount', {
            UserUID: userUID,
            Keyword: keyword
        });
        let record = {};
        if (response.status === 200) {
            record = response.data;
        }
        return record;
    } catch (error) {
        console.error('Error fetching last valuation:', error.message);
        return [];
    }
};

const getDealsTotalSoldAmount = async (userUID) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/get_deals_total_sold_amount', {
            UserUID: userUID
        });
        let record = {};
        if (response.status === 200) {
            record = response.data;
        }
        return record;
    } catch (error) {
        console.error('Error fetching last valuation:', error.message);
        return [];
    }
};

module.exports = {
    getDiscordUserPortfolios,
    getDiscordUsersPortfolios,
    getDeals,
    getDealsValuation,
    getLastTransactions,
    getDealsTotalVolume,
    getDealsTotalAmount,
    getDealsTotalSoldAmount
};