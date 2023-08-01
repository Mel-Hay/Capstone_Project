import React from "react";

import { Redirect, Route, Switch, useLocation, useHistory } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/Reservations";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Tables from "../table/Table";
import SeatReservation from "../reservations/ReservationSeat";
import Search from "../search/Search";
import ReservationEdit from "../reservations/ReservationEdit";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
      const location = useLocation()
      const history = useHistory()

      const handleDashboardRedirect = (date) => {
        if (date) {
          history.push(`/dashboard?date=${date}`);
        } else {
          history.push(`/dashboard?date=${today()}`);
        }
      };
  return (
    <Switch>
  {/* Routes to the dashboard */}
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path ="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={new URLSearchParams(location.search).get('date') || today()} />
      </Route>  
      {/* Route to create a new reservation */}
      <Route exact={true} path="/reservations/new">
        <Reservations />
      </Route>   
      {/* Route to create a new table */}
      <Route exact={true} path ="/tables/new">
        <Tables />
      </Route>
      {/* Route to seat a reservation at a table */}
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      {/* Route to search for a reservation by phone number */}
      <Route exact path ="/search">
        <Search />
      </Route>
      {/* Route to edit a previously made reservation */}
      <Route path="/reservations/:reservation_id/edit">
        <ReservationEdit />
      </Route>
      {/* Not found route */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
