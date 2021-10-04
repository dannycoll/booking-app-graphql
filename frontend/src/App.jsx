import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthPage from "./pages/Auth/Auth";
import BookingsPage from "./pages/Bookings/Bookings";
import EventsPage from "./pages/Events/Events";
import MainNav from "./components/Navigation/MainNav";
import AuthContext from "./context/authContext";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{ token: token, userId: userId, login: login, logout: logout }}
        >
          <MainNav />
          <main className="main-content">
            <Switch>
              {" "}
              {token && <Redirect from="/" to="/events" exact />}{" "}
              {token && <Redirect from="/auth" to="/events" exact />}{" "}
              {!token && <Route path="/auth" component={AuthPage} />}{" "}
              <Route path="/events" component={EventsPage} />{" "}
              {token && <Route path="/bookings" component={BookingsPage} />}{" "}
              {!token && <Redirect to="/auth" exact />}{" "}
            </Switch>{" "}
          </main>{" "}
        </AuthContext.Provider>{" "}
      </React.Fragment>{" "}
    </BrowserRouter>
  );
}

export default App;
