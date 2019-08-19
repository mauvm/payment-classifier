import config from './src/config'

// Using `export default` results in "missing client" error,
// since config = { default: config.knex } because require() is used.
module.exports = config.knex
