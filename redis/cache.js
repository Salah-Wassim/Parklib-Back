const { hostname } = require('os');
const redis = require('redis');
const {promisify} = require('util');

// Création d'une instance Redis
const client = redis.createClient({
    url: 'redis://redis-cache:6379' 
});

// Conversion des fonctions Redis en promesses
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

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
    console.log("getCache")
    try {
        if (!client.connect()) {
            console.log("!client")
            await new Promise((resolve, reject) => {
                client.once('connect', resolve);
                client.once('error', reject);
            });
        }
        console.log('key', key);
        const cachedData = await getAsync(key);
        if (cachedData) {
            console.log('Data retrieved from cache');
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
        if (client.connect()) {
            await new Promise((resolve, reject) => {
                client.once('connect', resolve);
                client.once('error', reject);
            });
        }
        const cacheTime = time || 600; // Temps de cache par défaut en secondes
        await setAsync(key, JSON.stringify(data), 'EX', cacheTime);
        console.log('Data cached');
    } catch (error) {
        console.error('Redis error: ' + error);
        client.disconnect();
        await client.connect();
        throw error;
    }
}

module.exports = {
    getCache,
    setCache
};

