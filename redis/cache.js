const redis = require('redis');

// Création d'une instance Redis
const client = redis.createClient({
    url: 'redis://redis-cache:6379' 
});

(async () => {
    try {
      await client.connect();
      console.log('Connected to Redis server');
    } catch (error) {
      console.error('Redis error:', error);
      process.exit(1); // Arrêtez l'application en cas d'erreur de connexion
    }
})();

// Gestionnaires d'événements pour SIGINT et SIGTERM
process.on('SIGINT', () => {
    client.quit();
    console.log('Closing Redis connection');
    process.exit(0);
});
  
process.on('SIGTERM', () => {
    client.quit();
    console.log('Closing Redis connection');
    process.exit(0);
});

/**
 * Fonction pour récupérer les données en cache Redis
 * @param {string} key - Clé à récupérer en cache
 * @returns {Promise<Object|null>} - Retourne les données si elles existent, sinon null
 */
const getCache = async (key) => {
    try {
        console.log('key', key);
        const cachedData = await client.get(key)
        if (cachedData) {
            console.log('Data retrieved from cache');
            const parsedData = JSON.parse(cachedData);
            if (Array.isArray(parsedData)) {
              return parsedData;
            } else {
              console.error('Invalid cached data format');
              return null;
            }
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
    try {
        const cacheTime = time || 60; // Temps de cache par défaut en secondes
        const setData = await client.setEx(key, cacheTime, JSON.stringify(data));
        if(setData){
            console.log('Data cached');
        }
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

