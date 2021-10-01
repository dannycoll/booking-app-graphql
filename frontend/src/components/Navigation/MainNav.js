import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNav.css';

const MainNav = () => {

    return (
        <header className="main-nav">
            <div className="main-nav_logo">
                <h1>EasyEvent</h1>
            </div>
            <nav className="main-nav_items">
                <ul>
                    <li><NavLink to='/auth'>Authenticate</NavLink></li>
                    <li><NavLink to='/events'>Events</NavLink></li>
                    <li><NavLink to='/bookings'>Bookings</NavLink></li>
                </ul>
            </nav>
        </header>
    );
}
export default MainNav;