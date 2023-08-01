import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import axios from 'axios';

function Reservations() {
  const [reservationsError, setReservationsError] = useState(null);
  const [inputValues, setInputValues] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: ''
  });
  const { REACT_APP_API_BASE_URL } =process.env

  const history = useHistory();

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value
    if(name==="people"){
      newValue=Number(value)
    }
    setInputValues((prevReservation) => ({
      ...prevReservation,
      [name]: newValue,
    }));
  };

  const handleButtonClick = async (event) => {
    event.preventDefault();
    const inputData = { 
      ...inputValues,
      people: Number(inputValues.people)
    };
    try {
      await axios.post(`${ REACT_APP_API_BASE_URL }/reservations`, {data: inputData});
      history.push(`/dashboard?date=${inputValues.reservation_date}`);
    } catch (error) {
      setReservationsError(new Error(error.response.data.error));
    }
  };

  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <h1>Reservations</h1> 
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Create your reservation now!</h4>
        <div>
          
        </div>     
      </div>
      <form>
      <div className="d-block">
        <p className="d-inline-flex">First Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={inputValues.first_name}
          name="first_name"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Last Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={inputValues.last_name}
          name="last_name"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Phone Number:</p>
        <input
          type="tel"
          onChange={handleChange}
          value={inputValues.mobile_number}
          name="mobile_number"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Reservation Date:</p>
        <input
          type="date"
          onChange={handleChange}
          value={inputValues.reservation_date}
          name="reservation_date"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Reservation Time:</p>
        <input
          type="time"
          onChange={handleChange}
          value={inputValues.reservation_time}
          name="reservation_time"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Size of party:</p>
        <input
          type="number"
          onChange={handleChange}
          value={inputValues.people}
          name="people"
          className="d-inline-flex"
        />
      </div>
      
      <div>
        <button onClick={handleButtonClick} type="submit">Submit</button>
      </div>
      <div>
        <button onClick={() => history.goBack()} type="button">Cancel</button>
      </div>
      </form>
      
    </main>
  );
}

export default Reservations;
