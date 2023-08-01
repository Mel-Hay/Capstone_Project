import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [errors, setErrors] = useState(null)
  const { reservation_id } = useParams();
  const history = useHistory();
  const { REACT_APP_API_BASE_URL } = process.env
  useEffect(() => {
    const fetchTables = async () => {
      const response = await axios.get(`${ REACT_APP_API_BASE_URL }/tables`);    
      await setTables(response.data.data);
      if (tables.length > 0) {
        setSelectedTable(tables[0].table_id);
      }
    };
    fetchTables();
  }, [reservation_id]);

  const handleSubmit = async (event) => {
    event.preventDefault()
    const resId = Number(reservation_id);
    try {
      const tableId = selectedTable ? selectedTable : tables[0].table_id;
      await axios.put(`${ REACT_APP_API_BASE_URL }/tables/${tableId}/seat`, 
      { data: { reservation_id: resId } }
      );
      history.push("/dashboard");
    } catch (error) {
      setErrors(error);
    }
  };
  
  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div>
      <h1>Seat Reservation</h1>
      <form >
        <ErrorAlert error={errors} />
        <label htmlFor="table_id">Table number:</label>
        
        <select 
          name="table_id" 
          id="table_id" 
          onChange={e => setSelectedTable(e.target.value)}
          value={selectedTable}
        >
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <button type="submit" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default SeatReservation;
