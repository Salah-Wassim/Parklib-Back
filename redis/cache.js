const redis = require('redis');

// Création d'une instance Redis
const client = redis.createClient({
    url: 'redis://redis-cache:6379' 
});

client.on('error', function (err) {
    console.log("client error")
    console.error('Redis error: ' + err);
    client.disconnect();
    setTimeout(client.connect(), 15000);
});

/**
 * Fonction pour récupérer les données en cache Redis
 * @param {string} key - Clé à récupérer en cache
 * @returns {Promise<Object|null>} - Retourne les données si elles existent, sinon null
 */
const getCache = async (key) => {
    try {
        if (!client.connect()) {
            console.log("!client")
            await new Promise((resolve, reject) => {
                client.once('connect', resolve);
                client.once('error', reject);
            });
        }
        console.log('key', key);
        const cachedData = await client.get(key)
        if (cachedData) {
            console.log('Data retrieved from cache');
            await client.disconnect()
            return JSON.parse(cachedData);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Redis error: ' + error);
        client.disconnect();
        await client.connect();
        throw error;
    }
}

/**
 * Fonction pour stocker les données en cache Redis
 * @param {string} key - Clé à utiliser pour stocker les données en cache
 * @param {Object} data - Données à stocker en cache
 * @param {number} time - Durée de vie du cache en secondes
 * @returns {Promise<void>}
 */
const setCache = async (key, data, time) => {
    console.log("setCache")
    try {
        if (client.status === "end") {
            await client.connect()
        }
        const cacheTime = time || 600; // Temps de cache par défaut en secondes
        await client.set(key, JSON.stringify(data), 'EX', cacheTime);
        console.log('Data cached');
        await client.disconnect();
        console.log("client disconnect");
    } catch (error) {
        console.error('Redis error: ' + error);
        await client.disconnect();
        await client.connect();
        throw error;
    }
}

module.exports = {
    getCache,
    setCache
};

