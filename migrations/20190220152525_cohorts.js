
exports.up = function(knex, Promise) {
  return knex.schema.createTable('cohorts', tbl => {
    tbl.increments();
    tbl.text('name').notNullable().unique();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cohorts');
};
