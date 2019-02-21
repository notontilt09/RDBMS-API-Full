
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {
          name: 'Dan',
          cohorts_id: 1
        },
        {
          name: 'Dave',
          cohorts_id: 1
        },
        {
          name: 'Marissa',
          cohorts_id: 2
        },{
          name: 'Steve',
          cohorts_id: 2
        },{
          name: 'Shaun',
          cohorts_id: 3
        },{
          name: 'Josh',
          cohorts_id: 3
        },
      ]);
    });
};
