/* eslint-disable react/react-in-jsx-scope */
import {createContext, useEffect, useState} from 'react';
import axios from '../config/axiosConfig';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          'http://192.168.8.116:8000/api-base/info/',
        );
        setRole(response.data.role);
      } catch (error) {
        console.log('Error load user info: ', error);
      }
    };

    fetchUser();
  }, []);

  return <AuthContext.Provider value={{role}}>{children}</AuthContext.Provider>;
};

export {AuthContext, AuthProvider};
