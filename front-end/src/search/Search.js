import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function Search(){
    const [mobileNumber, setMobileNumber] = useState('')
    const [reservations, setReservations] = useState([])
    const [reservationsError, setReservationsError] = useState(null);
    const handleClick = async (event) => {
        try {
            event.preventDefault();
    
            loadReservations()
        } catch (error) {
            setReservationsError(error)
        }
       
    }

      const handleChange = (event) => {
        const {value} = event.target
        setMobileNumber(value)
      }

      function loadReservations() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ mobile_number: mobileNumber }, abortController.signal)
          .then(setReservations)
          .catch(setReservationsError);
        return () => abortController.abort();
      }
    
      function formatTime(time){
        const split = time.split(':')
        let hour = split[0]
        if(hour>12){
          hour -=12
          return (hour+":"+split[1]+" pm")
        }else{
          hour++
          hour--
          return(hour+":"+split[1]+" am")
        }
      }
    
      function formatReservations() {
        if (reservations.length>0) {
          const reservationElements = reservations.map((reservation) => {
            const {reservation_id, last_name, first_name, mobile_number, reservation_date, reservation_time, people} = reservation
            const fullName = `${last_name}, ${first_name}`
            const formattedTime = formatTime(reservation_time)
            return(
            <div key={reservation_id}>
              <p>
                Name: {fullName}
              </p>
              <p>Phone Number: {mobile_number}</p>
              <p>
                Reservation Date: {reservation_date}
              </p>
              <p>
                Reservation Time: {formattedTime}
              </p>
              <p>Number of People: {people}</p>
              <hr></hr>
            </div>
        )
            });
          return reservationElements;
        }else{
          return (
        <div>
          <p>No reservations found.</p>
        </div>
        )}}

    return (

        <div>
            <h1>Search By Number!</h1>
            <h4>{mobileNumber}</h4>
            <ErrorAlert error={reservationsError} />
            <input 
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            >     
            </input>
            <button
            type="submit"
            onClick={handleClick}
            >
                Find</button>
                <div>{formatReservations()}</div>
        </div>  
    )
}

export default Search