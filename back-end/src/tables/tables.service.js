const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(table_id, reservation_id, newCapacity=0) {
  return knex("tables")
    .where({ "tables.table_id": table_id })
    .update({
      "reservation_id": reservation_id,
      "status": "occupied",
      "capacity": newCapacity,
    })
    .returning("*")
    .then((records) => {
      if (records.length > 0) {
        return records[0];
      }
    });
}

function read(table_id) {
  return knex("tables")
    .select("*")
    .where({"tables.table_id": table_id})
    .first()
}

function readReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({"reservation_id": reservation_id})
    .first()
}

async function destroy(table_id, newCapacity) {
  return knex("tables")
    .where({ "table_id": table_id })
    .update({ reservation_id: null, status: "free", capacity: newCapacity })
    .returning("*")
    .then((records) => {
      if (records.length > 0) {
        return records[0];
      }
    });
}
function updateReservation(reservation, status){
  return knex("reservations")
      .where({"reservation_id":reservation.reservation_id})
      .update({"status": status})
      .returning("*")
      .then((records) => {
          if (records.length > 0) {
            return records[0];
          }
        })
}

module.exports = {
  create,
  list,
  update,
  destroy,
  read,
  readReservation,
  updateReservation
};
