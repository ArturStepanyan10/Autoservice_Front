import React, { useState, useEffect } from 'react';
import axios from './axiosConfig.js';

function UserInfo({ setUser }) {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://192.168.8.116:8000/api/info/');
                setUser(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных пользователя:', error);
            }
        };

        fetchUser();
    }, [setUser]);

    return null;
}

export default UserInfo;
