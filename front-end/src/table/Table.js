import React, { useState, useEffect } from "react";

import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import axios from 'axios'

function Tables() {
  const [reservationsError, setReservationsError] = useState(null);
    const [inputValues, setInputValues] = useState({
        table_name:'',
        capacity:''
    });
    const { REACT_APP_API_BASE_URL } = process.env
    let history = useHistory()

    const handleButtonClick = async (event) => {
      event.preventDefault();
      const inputData = { 
        ...inputValues,
        capacity: Number(inputValues.capacity)
      };
        try {
          await axios.post(`${ REACT_APP_API_BASE_URL }/tables`, {data: inputData});
          history.push(`/dashboard`);
        } catch (error) {
           setReservationsError(new Error(error.response.data.error))
        }
      }
    
  const handleChange = (event) => {
    const {name, value} = event.target
    setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [name]:value,
    }))
  }

  return (
    <main>
      <h1>Tables</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Create your table now!</h4>
      </div>
      <form >
        <div className="d-block">
          <p className="d-inline-flex">Table Name:</p>
          <input 
          type="text"
          onChange={handleChange}
          value={inputValues.table_name} 
          name="table_name" 
          className="d-inline-flex"/> 
        </div>

        <div className="d-block">
          <p className="d-inline-flex">Capacity:</p>
          <input 
          type="number"
          onChange={handleChange}
          value={inputValues.capacity} 
          name="capacity" 
          className="d-inline-flex"/> 
        </div>
        <div>
          <button onClick={handleButtonClick} type="submit">Submit</button>
        </div>
        <div>
          <button type="button" onClick={()=>history.goBack()} >Cancel</button>
        </div>
      </form>
      <ErrorAlert error={reservationsError} />
    </main>
  )
}

export default Tables;
