const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './00-reservations.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));


exports.seed = function(knex) {
  const tableName = 'reservations';

  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function() {
      return knex(tableName).insert(data);
    });
};
