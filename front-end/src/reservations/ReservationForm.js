import React from "react";

function ReservationForm({ values, handleChange, handleSubmit, handleCancel, title }) {
  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-0">{title}</h4>
      <div className="d-block">
        <p className="d-inline-flex">First Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={values.first_name}
          name="first_name"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Last Name:</p>
        <input
          type="text"
          onChange={handleChange}
          value={values.last_name}
          name="last_name"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Phone Number:</p>
        <input
          type="tel"
          onChange={handleChange}
          value={values.mobile_number}
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          title="Phone number should be in the format: 123-456-7890"
          name="mobile_number"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Reservation Date:</p>
        <input
          type="date"
          onChange={handleChange}
          value={values.reservation_date}
          name="reservation_date"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Reservation Time:</p>
        <input
          type="time"
          onChange={handleChange}
          value={values.reservation_time}
          name="reservation_time"
          className="d-inline-flex"
        />
      </div>
      <div className="d-block">
        <p className="d-inline-flex">Size of party:</p>
        <input
          type="number"
          onChange={handleChange}
          value={values.people}
          name="people"
          className="d-inline-flex"
        />
      </div>
      
      <div>
        <button type="submit">Submit</button>
      </div>
      <div>
        <button onClick={handleCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}

export default ReservationForm;