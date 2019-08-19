import createKnex from 'knex'
import config from './config'

export default createKnex(config.knex)
