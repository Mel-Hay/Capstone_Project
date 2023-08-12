import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import './Dashboard.css'

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const { REACT_APP_API_BASE_URL } = process.env;

  const history = useHistory();
  useEffect(loadTables, [date]);
  useEffect(loadDashboard, [date]);
  

  async function loadTables() {
    try {
      const response = await axios.get(`${ REACT_APP_API_BASE_URL }/tables`);
      setTables(response.data); // Use response.data to access the table data
    } catch (error) {
      setTablesError(error);
    }
  }

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
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


  const handleCancelClick = (reservation_id) => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) { 
    axios
      .put(`${ REACT_APP_API_BASE_URL }/reservations/${reservation_id}/status`, { data: {status: "cancelled"} })
      .then((response) => {
    loadDashboard()
    loadTables()
  })
  .catch((error) => {
      setReservationsError(error.response.data)
 
      });
    }
  };
 
  function formatReservations() {
    if (reservations.length>0) {
      const reservationElements = reservations.map((reservation) => {
        const {reservation_id, last_name, first_name, mobile_number, reservation_date, reservation_time, people, status} = reservation
        
        if(status ==="cancelled"){
          return null
        }
        const fullName = `${first_name.charAt(0).toUpperCase() + first_name.slice(1)} ${last_name.charAt(0).toUpperCase() + last_name.slice(1)}`
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1)
        const formattedTime = formatTime(reservation_time)
        return(
        <div key={reservation_id}>    
          <p data-reservation-id-status={reservation.reservation_id}>Status: {formattedStatus} </p>
          <p>Name: {fullName}</p>
          <p>Phone Number: {mobile_number}</p>
          <p>Reservation Date: {reservation_date}</p>
          <p>Reservation Time: {formattedTime}</p>
          <p>Number of People: {people}</p>
          <div className="d-flex justify-content-between">
            {renderSeatButton(reservation)}
            
            <button className="btn-lg btn-light-secondary text-white ">
              <Link className="edit-button"
                href={`/reservations/${reservation_id}/edit`}
                to={`/reservations/${reservation_id}/edit`}>Edit
              </Link>
            </button>
                
            <button className="btn-lg " 
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() => handleCancelClick(reservation_id)}>Cancel
            </button>
          </div>
          <hr></hr>
        </div>
    )
        });
        if (!reservationElements.some((element) => element !== null)) {
          return (
            <div>
              <p>No reservations for this date.</p>
            </div>
          );
        }
      return reservationElements;
    }else{
      return (
    <div>
      <p>No reservations for this date.</p>
    </div>
    )}}

    const handleFinish = async (table_id) => {
      if (window.confirm("Is this table ready to seat new guests? This cannot be undone")){
        try{
          await axios.delete(`${REACT_APP_API_BASE_URL}/tables/${table_id}/seat`)
          loadDashboard()
          await loadTables()
        }catch(error){
          setTablesError(error)
        }
      } 
    };

function renderFinishButton(table){
if(table.reservation_id){
        return(
          <div>
            <button 
            className="tablesBtn"
              data-table-id-finish={table.table_id}
              onClick={() => handleFinish(table.table_id)}
            >Finish Table</button>
          </div>
        )
      }
}

function renderSeatButton(reservation){
  if(reservation.status!=="seated"){
    return(
      <div>
        <button className="btn-lg ">
          <Link className="seat-button"
            href={`/reservations/${reservation.reservation_id}/seat`}
            to={`/reservations/${reservation.reservation_id}/seat`}>Seat
          </Link>
        </button>
      </div>
          
          )
        }
  }

  function formatTables() {
    function formatStatus(table){
      if(table.reservation_id){
        table.status="occupied"
        return "Occupied"
      }
      return (table.status.charAt(0).toUpperCase() + table.status.slice(1)) 
    }
    if (tables && tables.data.length > 0) {
      // Check the length of tables array    
      return tables.data.map((table) => (
        <div key={table.table_id}>
          <div className=" col-8">
            <p>Table Name: {table.table_name}</p>
          <p data-table-id-status={table.table_id}>Status: {formatStatus(table)}</p>
          <p>Capacity: {table.capacity}</p>
          <button className="tablesBtn" onClick={() => handleDeleteTable(table.table_id)}>Delete Table</button>
          </div>
          <div className="d-flex col-8">
            {renderFinishButton(table)}
          </div>
          <hr />
        </div>
      ));
    } else {
      return <p>No tables available</p>;
    }
  }

  const handleDeleteTable = async(table_id) =>{
        try{
          await axios.delete(`${REACT_APP_API_BASE_URL}/tables/${table_id}`)
          loadDashboard()
          await loadTables()
        }catch(error){
          setTablesError(error)
        }
    };
    
  // Function to increase the date by one day
  const handleNext = (date) => {
    const currentDate = new Date(date);
    const nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1));
    const nextDate = nextDay.toISOString().split("T")[0];
    history.push(`/dashboard?date=${nextDate}`);
  };

  // Function to decrease the date by one day
  const handlePrev = (date) => {
    const currentDate = new Date(date);
    const previousDay = new Date(
      currentDate.setDate(currentDate.getDate() - 1)
    );
    const prevDate = previousDay.toISOString().split("T")[0];
    history.push(`/dashboard?date=${prevDate}`);
  };

  return (
    <main>
      <h1 className="text-center dashboard">Dashboard</h1>
      <div className="d-flex justify-content-between my-2">
        <button 
        className="btn-lg nextPrev"
        onClick={() => handlePrev(date)}>Previous</button>
        <button onClick={() => handleNext(date)}
        className="btn-lg nextPrev"
        >Next</button>
      </div>
      <div className="d-flex">
      <div className="col-6">
        <div className="d-md-flex mb-3">
          <h5 className="mb-0">Reservations for {date}</h5>
          <ErrorAlert error={reservationsError} />
        </div>
        {formatReservations() || <p>Loading Reservations...</p>}
      </div>
      <div className="col-6">
        <div className="d-md-flex mb-3">
          <h5 className="mb-0">Tables: </h5>
          <ErrorAlert error={tablesError} />
        </div>
        {formatTables() || <p>Loading Tables...</p>}
      </div>
      </div>
    </main>
  );
}

export default Dashboard;
