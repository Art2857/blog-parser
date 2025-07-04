
exports.up = function(knex) {
  return knex.schema.createTable('posts', function(table) {
    table.increments('id').primary();
    table.string('link').notNullable();
    table.string('title').notNullable();
    table.text('descr');
    table.timestamp('date', { useTz: false });
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());


    table.index(['title']);
    table.index(['date']);
  });
};


exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
