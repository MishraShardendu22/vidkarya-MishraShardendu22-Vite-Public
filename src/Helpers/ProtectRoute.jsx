import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStates } from '../Context/appContext.jsx';
import { Navbar } from '../Components';
import LoadingSpinner from '../Components/UI/LoadingSpinner';

function ProtectRoute({ children }) {
  const navigate = useNavigate();
  const { user, setShowLoginPopup } = AppStates();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkUserToken = useCallback(() => {
    const session = localStorage.getItem('session');

    if (!session || session === 'undefined') {
      setIsLoggedIn(false);
      setIsChecking(false);
      navigate('/');
      setShowLoginPopup(true);
      return;
    }
    setIsLoggedIn(true);
    setIsChecking(false);
  }, [navigate, setShowLoginPopup]);

  useEffect(() => {
    checkUserToken();
  }, [checkUserToken, user]);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  return (
    <div>{isLoggedIn ? children : <Navbar />}</div>
  );
}

export { ProtectRoute };
