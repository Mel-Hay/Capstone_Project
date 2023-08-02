import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import ReservationForm from "./ReservationForm";

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
  const { REACT_APP_API_BASE_URL } =process.env;

  const history = useHistory();

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
    if(name === "people"){
      newValue = Number(value);
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
        <ReservationForm
          values={inputValues}
          handleChange={handleChange}
          handleSubmit={handleButtonClick}
          handleCancel={() => history.goBack()}
          title="Create your reservation now!"
        />
      </div>
    </main>
  );
}

export default Reservations;
