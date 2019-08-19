import dotenv from 'dotenv'

dotenv.config()

const paymentCategories = String(process.env.PAYMENT_CATEGORIES)
  .split(',')
  .map(category => category.trim())
  .filter(Boolean)

if (paymentCategories.length === 0) {
  throw new Error('Specify PAYMENT_CATEGORIES in .env!')
}

export default {
  knex: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    migrations: {
      directory: 'migrations',
    },
  },
  bunq: {
    clientDataFile: __dirname + '/../.bunq-js-client-data.json',
    environment: 'PRODUCTION',
    deviceName: process.env.BUNQ_DEVICE_NAME,
    apiKey: process.env.BUNQ_API_KEY,
    encryptionKey: process.env.BUNQ_ENCRYPTION_KEY,
    permittedIPs: String(process.env.BUNQ_PERMITTED_IPS)
      .split(',')
      .filter(Boolean),
  },
  paymentCategories,
}
