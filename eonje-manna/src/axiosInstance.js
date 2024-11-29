// src/axiosInstance.js
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { useAuth } from './context/AuthContext';

import Spinner from 'react-bootstrap/Spinner';

const axiosInstance = axios.create({
  
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } 
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      async (error) => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          console.error('Token expired or invalid, redirecting to login page...');
          
          logout();
          //navigate('/login', { replace: true });
          navigate('/login', { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  // Return the children components wrapped by AxiosInterceptor
  return (
    <>
      {loading && (
        <Spinner animation="border" variant="primary" />
      )}
      {children}
    </>
  );
};


export default axiosInstance;
export { AxiosInterceptor };
