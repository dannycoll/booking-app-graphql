import { 
  BrowserRouter,
  Route,
  Switch,
  Redirect  
} from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNav from './components/Navigation/MainNav';
import './App.css';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNav />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
