const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './01-tables.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));


exports.seed = function(knex) {
  const tableName = 'tables';

  return knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(function() {
      return knex(tableName).insert(data);
    });
};