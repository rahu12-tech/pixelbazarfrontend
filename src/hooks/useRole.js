import { useState, useEffect } from 'react';

export const useRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role || 'user';
    const adminStatus = user?.role === 'admin' || user?.is_staff === true || user?.is_superuser === true;
    
    setUserRole(role);
    setIsAdmin(adminStatus);
  }, []);

  return { userRole, isAdmin };
};

export default useRole;