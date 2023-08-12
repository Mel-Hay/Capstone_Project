import React from "react";
import "./Reservation.css"
function ReservationForm({ values, handleChange, handleSubmit, handleCancel, title }) {
  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-0">{title}</h4>
      <div className="d-block">
        <p className="d-inline-flex reservationP">First Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={values.first_name}
          name="first_name"
          className="d-inline-flex reservationI"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex reservationP">Last Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={values.last_name}
          name="last_name"
          className="d-inline-flex reservationI"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex reservationP">Phone Number:</p>
        <input
          type="tel"
          onChange={handleChange}
          value={values.mobile_number}
          pattern="^\d{3}-?\d{3}-?\d{4}$"
          title="Phone number should be in the format: 123-456-7890"
          name="mobile_number"
          className="d-inline-flex reservationI"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex reservationP">Reservation Date: </p>
        <input
          type="date"
          onChange={handleChange}
          value={values.reservation_date.slice(0, 10)}
          name="reservation_date"
          className="d-inline-flex reservationI"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex reservationP">Reservation Time:</p>
        <input
          type="time"
          onChange={handleChange}
          value={values.reservation_time}
          name="reservation_time"
          className="d-inline-flex reservationI"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex reservationP">Size of party:</p>
        <input
          type="number"
          onChange={handleChange}
          value={values.people}
          name="people"
          className="d-inline-flex reservationI"
        />
      </div>
      
      <div>
        <button className="reservationBtn" type="submit">Submit</button>
        <button className="reservationBtn"  onClick={handleCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

export default ReservationForm;