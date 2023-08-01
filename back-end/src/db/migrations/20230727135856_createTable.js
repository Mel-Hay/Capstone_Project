exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.string("table_name").notNullable();
      table.integer("capacity").notNullable();
      table.string("status").defaultTo("free")
      table.integer("reservation_id").unsigned()
      table.foreign("reservation_id").references("reservation_id").inTable('reservations').onDelete('SET NULL')
      table.timestamps(true, true);
      
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("tables");
  };
