import React, { useRef, useContext } from 'react';
import AuthContext from '../../context/authContext';

import './Auth.css';

const AuthPage = props => {
    const authContext = useContext(AuthContext);
    const emailRef = useRef('');
    const passwordRef = useRef('');

    const handleSubmit = async event => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if(email.trim().length === 0 || password.trim().length === 0) return;
        const requestBody = {
            query: `
              query {
                login(email: "${email}", password: "${password}") {
                  userId
                  token
                  tokenExpiration
                }
              }
            `
        };
        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                'Content-Type': 'application/json'
                }
            });
            if (response.status !== 200 && response.status !== 201) 
                throw new Error('Failed!');
            const resData = await response.json();
            const loginData = resData.data.login;
            if (loginData.token) {
                authContext.login(loginData.token, loginData.userId, loginData.tokenExpiration);
            }
        }catch(err) {
              console.log(err);
        }
    }

    const handleSignup = async event => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if(email.trim().length === 0 || password.trim().length === 0) return;
        const requestBody = {
            query: `
              mutation {
                createUser(userInput: {email: "${email}", password: "${password}"}) {
                  _id
                  email
                }
              }
            `
        };

        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                'Content-Type': 'application/json'
                }
            });
            if (response.status !== 200 && response.status !== 201) 
                throw new Error('Failed!');
            const resData = await response.json();
            const loginData = resData.data.login;
            if (loginData.token) {
                authContext.login(loginData.token, loginData.userId, loginData.tokenExpiration);
            }
        }catch(err) {
              console.log(err);
        }
    }
    return (
        <form className="auth-form">
            <div className="form-wrapper">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={emailRef}></input>
            </div>
            <div className="form-wrapper">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={passwordRef}></input>
            </div>
            <div className="form-actions">
                <button type="submit" onClick={handleSubmit}>Login</button>
                <button type="button" onClick={handleSignup}>Signup</button>
            </div>
        </form>
    );
}

export default AuthPage;
