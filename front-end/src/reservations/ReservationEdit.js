import React, { useState, useEffect } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { formatAsDate } from "../utils/date-time";
function ReservationEdit() {
  const { REACT_APP_API_BASE_URL } = process.env
  const { reservation_id } = useParams();
  const idNum = Number(reservation_id);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservation, setReservation] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `${ REACT_APP_API_BASE_URL }/reservations/${reservation_id}`
        );
        setReservation(response.data.data); // Set the reservation state with the data from the API response
      } catch (error) {
        setReservationsError(error);
      }
    };
    fetchReservation();
  }, [reservation_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value
    if(name==="people"){
      newValue=Number(value)
    }
    setReservation((prevReservation) => ({
      ...prevReservation,
      [name]: newValue,
    }));
  };

  const handleButtonClick = async (event) => {
    event.preventDefault()
    try {
        const response= await axios.put(`${REACT_APP_API_BASE_URL}/reservations/${idNum}`, { ...reservation })
        const formattedDate = formatAsDate(response.data.data.reservation_date)
        history.push(`/dashboard?date=${formattedDate}`)
    } catch (error) {
      setReservationsError({message: error.response.data.error});
    }
  };
  const handleCancel = () => {
    history.goBack();
  };

  if (reservation === null) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <h1>Reservations</h1> 
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Edit your reservation now!</h4>     
      </div>
        <form >
        <div className="d-block">
        <p className="d-inline-flex">First Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={reservation.first_name}
          name="first_name"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Last Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={reservation.last_name}
          name="last_name"
          className="d-inline-flex"         
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Phone Number:</p>
        <input
          type="tel"
          onChange={handleChange}
          value={reservation.mobile_number}
          name="mobile_number"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Reservation Date:</p>
        <input
          type="date"
          onChange={handleChange}
          value={reservation.reservation_date}
          name="reservation_date"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Reservation Time:</p>
        <input
          type="time"
          onChange={handleChange}
          value={reservation.reservation_time}
          name="reservation_time"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Size of party:</p>
        <input
          type="number"
          onChange={handleChange}
          value={reservation.people}
          name="people"
          className="d-inline-flex"
        />
      </div>
      
      <div>
        <button onClick={handleButtonClick} type="submit">Submit</button>
      </div>
      <div>
        <button onClick={handleCancel} type="button">Cancel</button>
      </div>
        </form>     
      
      
    </main>
  );
}

export default ReservationEdit;