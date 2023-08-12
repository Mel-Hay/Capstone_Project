const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const { as } = require("../db/connection");

async function list(req, res) {
    const data = await service.list();
    res.json({ data });
  }

  
  async function create(req, res, next) {
    const { data } = req.body || req.body.data
    if(!data){
      let error = new Error(`Missing required data`);
      error.status = 400;
      return next(error);  // return here to exit the function
    }

    try {
      
      validateTableFields(data);
      
      if (typeof data.capacity !== 'number') {
        let error = new Error(`The capacity must be a number.`);
        error.status = 400;
        throw error;
      }
      
      const createdTable = await service.create(data);
      // Wrap the result in a 'data' property and send it back.
      res.status(201).json({ data: createdTable });
      
    } catch (error) {
      next(error);
    }
}


async function update(req, res, next) {
  try {
      const { reservation_id } = req.body.data
      const { table_id } = req.params;

      const reservation = await service.readReservation(reservation_id)
      const table = await service.read(table_id)
      const capacity = table.capacity
      const people = reservation.people
      const newCapacity = capacity - people 
      const status="seated"
      await service.updateReservation(reservation, status)
      const data = await service.update(table_id, reservation_id, newCapacity)
      res.status(200).json({data})

  } catch (error) {
      next(error)
  }
}

async function validateUpdate(req, res, next){ 
  try{
    if(!req.body.data){
      let error = new Error(`Must have valid data.`);
      error.status = 400;
      throw error;
    }
      const { reservation_id } = req.body.data
      const { table_id } = req.params;

      if(!reservation_id){
        let error = new Error(`The reservation_id is missing.`);
        error.status = 400;
        throw error;
      }
      if(!table_id){
        let error = new Error(`The table_id is missing.`);
        error.status = 404;
        throw error;
      }

      const reservation = await service.readReservation(reservation_id)
      const table = await service.read(table_id)

      // Check if reservation exists
      if(!reservation) {
        let error = new Error(`No reservation found for id: ${reservation_id}`);
        error.status = 404;
        throw error;
      }

      const capacity = table.capacity
      const people = reservation.people
      const difference = capacity-people
      
      if(table.status==="occupied" ){
        let error = new Error(`This table is occupied.`);
        error.status = 400;
        throw error;
      }
      if(reservation.status ==="seated"){
        let error = new Error(`This reservation is already seated.`);
        error.status = 400;
        throw error;
      }
      if(difference<0){
        let error = new Error(`The table does not have sufficient capacity.`);
        error.status = 400;
        throw error;
      }
      next()
  }catch(error){
    next(error)
  }
   
}


async function remove(req, res, next) {
  try {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    const reservation = await service.readReservation(table.reservation_id);
    const newCapacity = table.capacity + reservation.people;
    await service.updateReservation(reservation, "finished")
    const data = service.remove(table_id, newCapacity);
    res.status(200).json({data})
  } catch (error) {
    next(error);
  }
}

async function removeValidator(req, res, next) {
  try {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if (!table) {
      let error = new Error(`The table with this id: ${table_id} does not exist.`);
      error.status = 404;
      throw error;
    }
    if (table.status !== "occupied") {
      let error = new Error(`This table is not occupied.`);
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

  async function read(req, res, next) {
    try {
      const { table_id } = req.params;
      const data = await service.read(table_id);
      if (!data) {
        const error = new Error(
          `${table_id} is not a valid table Id.`
        );
        error.status = 404;
        throw error;
      }
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }


  function validateTableFields(table){
    const requiredFields = ['capacity', 'table_name'];
    const {capacity, table_name} = table
    // Check each required field
    for (let field of requiredFields) {
      if (!table[field]) {
        let error = new Error(`Missing required field: ${field}`);
        error.status = 400;
        throw error;
      }
    }

    if(!table_name || table_name.length<2){
      let error = new Error(`table_name must be more than one character.`);
        error.status = 400;
        throw error;
    }

    if(!capacity || capacity < 1){
      let error = new Error(`The capacity must be a number and greater than zero.`);
        error.status = 400;
        throw error;
    }
  }

async function destroy(req, res, next) {
  const { table_id } = req.params;
  try {
      await service.destroy(table_id);
      res.sendStatus(204);
  } catch (error) {
      next(error);
  }
}



  
module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(create)],
  update:[asyncErrorBoundary(validateUpdate), asyncErrorBoundary(update)],
  remove:[asyncErrorBoundary(removeValidator) ,asyncErrorBoundary(remove)],
  destroy:[asyncErrorBoundary(destroy)]
};

