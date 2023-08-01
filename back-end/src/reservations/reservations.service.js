const knex = require("../db/connection")

function list(date){
    return knex("reservations")
        .select("*")
        .where({"reservation_date":date})
        .andWhereNot({"status": "finished"})
        .orderBy("reservation_time")
}
function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0])
}
function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({"reservation_id": reservation_id})
    .first()

}

function findTable(reservation_id) {
  const resNum = Number(reservation_id); // Convert the reservation_id to a number
  return knex("tables")
    .select("*")
    .where({ "reservation_id": resNum })
    .first()
    .then((table) => {
      return table;
    })
    .catch((error) => {
      throw error; // Rethrow the error to be caught by the caller
    });
}



function cancelled(reservation_id) {
  return knex("reservations")
    .where({ "reservation_id": reservation_id })
    .update({ status: "cancelled" })
    .returning("*")
    .then((records) => {
      if (records.length > 0) {
        return records[0];
      }
    });
}

  
function update(reservation){
  return knex("reservations")
      .where({"reservation_id":reservation.reservation_id})
      .update({...reservation})
      .returning("*")
      .then((records) => {
          if (records.length > 0) {
            return records[0];
          }
        })
}
function finishTable(reservation_id, newCapacity){
  return knex("tables")
      .where({"reservation_id":reservation_id})
      .update({ reservation_id: null, status: "free", capacity: newCapacity})
      .returning("*")
      .then((records) => {
        if (records.length > 0) {
          return records[0];
        }
      });
}


function search(mobile_number) {
return knex("reservations")
    .whereRaw(
    "translate(mobile_number, '() -', '') like ?",
    `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


module.exports = {
    list,
    create,
    read,
    search,
    cancelled,
    update,
    finishTable,
    findTable
}