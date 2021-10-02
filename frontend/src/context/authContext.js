import React from 'react';

export default React.createContext({
    token: '',
    userId: '',
    login: (token, userId, tokenExpiration) => {},
    logout: () => {}
});