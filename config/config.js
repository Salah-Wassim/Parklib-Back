require('dotenv').config()

module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "parklib_db_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "parklib_db_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
//   "production": {
//     "username": process.env.DB_PROD_USERNAME,
//     "password": process.env.DB_PROD_PWD,
//     "database": process.env.DB_PROD_NAME,
//     "host": process.env.DB_PROD_HOST,
//     "dialect": process.env.DB_PROD_DIALECT
//   }
}