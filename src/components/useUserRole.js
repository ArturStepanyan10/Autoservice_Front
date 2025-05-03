import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        console.log('User role:', role);
        setUserRole(role);
      } catch (error) {
        console.log('Failed to fetch user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, []);

  return {userRole, isLoading};
};

export default useUserRole;
