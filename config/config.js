require('dotenv').config()

module.exports = {
  "development": {
    "username": process.env.DB_DEV_USERNAME,
    "password": process.env.DB_DEV_PWD,
    "database": process.env.DB_DEV_NAME,
    "host": 'db',
    "dialect": process.env.DB_DEV_DIALECT
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_PROD_USERNAME,
    "password": process.env.DB_PROD_PASSWORD,
    "database": process.env.DB_PROD_NAME,
    "host": process.env.DB_PROD_HOST,
    "dialect": process.env.DB_PROD_DIALECT
  }
}
