import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('classifiers', table => {
      table.text('json')
      table.dateTime('created_at').index()
    })
    .then(() =>
      knex.raw(
        // Allow unicode characters, which are included in the LSTM JSON
        'ALTER TABLE `classifiers` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin',
      ),
    )
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('classifiers')
}
