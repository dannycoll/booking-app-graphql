import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/authContext';
import './MainNav.css';

const MainNav = () => {
    const authContext = useContext(AuthContext);

    return (
        <header className="main-nav">
            <div className="main-nav_logo">
                <h1>EasyEvent</h1>
            </div>
            <nav className="main-nav_items">
                <ul>
                    {!authContext.token && <li><NavLink to='/auth'>Authenticate</NavLink></li>}
                    <li><NavLink to='/events'>Events</NavLink></li>
                    {authContext.token && <li><NavLink to='/bookings'>Bookings</NavLink></li>}
                </ul>
            </nav>
        </header>
    );
}
export default MainNav;