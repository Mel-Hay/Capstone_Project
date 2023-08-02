const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

const requiredFields = [
  "reservation_date",
  "reservation_time",
  "first_name",
  "last_name",
  "mobile_number",
  "people",
];

async function list(req, res, next) {
  const mobileNumber = req.query.mobile_number;
  if (mobileNumber) {
    const data = await service.search(mobileNumber);
    res.json({ data });
  } else {
    const today = new Date().toISOString().split("T")[0];
    const date = req.query.date || today; 
    try {
      
      const data = await service.list(date);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

async function update(req, res, next) {
  try { 
    const data = req.body.data || req.body;
    const {reservation_id} = req.params; 
    data.reservation_id = reservation_id
    let result;
    
    if(data.status==="cancelled"){
      const reservation = await service.read(reservation_id)

      if(reservation.status==="seated"){
        const table = await service.findTable(reservation_id)
        const newCapacity = reservation.people + table.capacity
        await service.finishTable(reservation_id, newCapacity)
      }

      result = await service.cancelled(reservation_id);
      res.status(200).json({data: result})

    } else {
      result = await service.update(data); 
      res.status(200).json({ data: result });
    }

  } catch (error) {
    next(error);
  }
}


async function validateUpdate(req, res, next){
try{
  //Getting the data from the request body
    const data = req.body.data || req.body;

    if(data.status ==="cancelled"){
      return next()
    }

    if (data.status){
      if(data.status !=="finished" && data.status !=="seated"  && data.status !=="booked"){
        const error = new Error(`The status of your reservation is ${data.status}.`);
        error.status = 400;
        throw error;
      }
    }  
  // grabbing the reservation_id from the parameters 
    const {reservation_id} = req.params
  //Must Have data
    if(!data){
      let error = new Error(`Must have valid data.`);
      error.status = 400;
      throw error;
    }
  //Must have reservation_id
    if(!reservation_id){
      let error = new Error(`Must have valid ${reservation_id}.`);
      error.status = 400;
      throw error;
    }
  //Grabbing reservation so I can get its current status and check
    const reservation = await service.read(reservation_id)
    if (!reservation) {
      const error = new Error(`${reservation_id} is not a valid reservation Id.`);
      error.status = 404;
      throw error;
    }
    if (reservation.status==="finished") {
      const error = new Error(`Sorry this reservation is already finished.`);
      error.status = 400;
      throw error;
    }
    
    next()
}catch(error){
  next(error)
}
}

async function read(req, res, next) {
  try {
    const { reservation_id } = req.params;
    const data = await service.read(reservation_id);
    if (!data) {
      const error = new Error(`${reservation_id} is not a valid reservation Id.`);
      error.status = 404;
      throw error;
    }
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = req.body.data || req.body;  
    const result = await service.create(data); // Create a new reservation
    res.status(201).json({ data: result }); // Return created reservation
  } catch (error) {
    next(error);
  }
}

async function validateCreate(req, res, next){
  try{
    const data = req.body.data || req.body;
    if(!data){
      let error = new Error(`Must have valid data.`);
      error.status = 400;
      throw error;
    }

    await validateReservationFields(data); // Validate data
    const {reservation_date, reservation_time, people, status} = data

    if(status ==="seated" || status ==="finished"){
      let error = new Error(`The status cannot be '${status}'`);
      error.status = 400;
      throw error;
    }
    const date = new Date(reservation_date);
    const dayOfWeek = date.getUTCDay();
  
    if (Number.isNaN(dayOfWeek)) {
      let error = new Error(`reservation_date is not a date`);
      error.status = 400;
      throw error;
    }
    if (typeof(people) !=="number") {
      let error = new Error(`people is not a number.`);
      error.status = 400;
      throw error;
    }

    const currentDate = new Date();
  
    let [hours, minutes] = reservation_time.split(":").map(Number);
    let [year, month, day] = reservation_date.split("-").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      let error = new Error(`reservation_time is not a time`);
      error.status = 400;
      throw error;
    }

    if(Number(people)<1){
      let error = new Error(`Must have at least 1 for a reservation.`);
      error.status = 400;
      throw error;
    }

    if (dayOfWeek === 2) {
      // 0 is Sunday, 2 is Tuesday
      let error = new Error("Sorry, we are closed on Tuesdays");
      error.status = 400;
      throw error;
    }
    if(process.env.PRODUCTION === 'true'){
      const reservationDateTime = new Date(
        year,
        month-1,
        day,
        hours+5,
        minutes
      );
      if (currentDate.getTime()>reservationDateTime.getTime()) {
        let error = new Error(`The reservation must be set for a date in the future.`);
        error.status = 400;
        throw error;
      } 
    }else{
      const reservationDateTime = new Date(
        year,
        month-1,
        day,
        hours,
        minutes
      );
      if (currentDate.getTime()>reservationDateTime.getTime()) {
        let error = new Error(`The reservation must be set for a date in the future.`);
        error.status = 400;
        throw error;
      } 
    
    }

   
    // Convert the time to minutes for easier comparison
    const timeInMinutes = hours * 60 + minutes;
    // Define the acceptable range in minutes
    const startOfService = 10 * 60 + 30; // 10:30 AM
    const endOfService = 21 * 60 + 30; // 9:30 PM
    // Check if the time falls within the acceptable range
    if (timeInMinutes < startOfService || timeInMinutes > endOfService) {
      let error = new Error(
        "Reservations are only accepted from 10:30 AM to 9:30 PM"
      );
      error.status = 400;
      throw error;
    }
    next()
  } catch(error){
    next(error)
  }
}

async function validateReservationFields(reservation) {
  // Check each required field
  for (let field of requiredFields) {
    if (!reservation[field]) {
      let error = new Error(`Missing required field: ${field}`);
      error.status = 400;
      throw error;
    }
  }
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(validateCreate), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(validateCreate), asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(update)]
};