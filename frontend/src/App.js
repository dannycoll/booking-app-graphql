import { 
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect  
} from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Redirect from='/' to='/auth' exact />
        <Route path='/auth' component={AuthPage}/>
        <Route path='/events' component={EventsPage}/>
        <Route path='/bookings' component={BookingsPage}/>
      </Switch>
    </Router>
  );
}

export default App;
