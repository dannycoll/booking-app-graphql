import React from 'react';

import './Auth.css';

const AuthPage = () => {

    return (
        <form className="auth-form">
            <div className="form-wrapper">
                <label htmlFor="email">Email</label>
                <input type="email" id="email"></input>
            </div>
            <div className="form-wrapper">
                <label htmlFor="password">Password</label>
                <input type="password" id="password"></input>
            </div>
            <div className="form-actions">
                <button type="submit">Login</button>
                <button type="button">Signup</button>
            </div>
        </form>
    );
}

export default AuthPage;
