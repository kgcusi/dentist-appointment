import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link className="text-primary" to="/">
        <h1 className="text-2xl font-bold">Dental Office</h1>
      </Link>
      <nav className="space-x-4">
        {isAuthenticated ? (
          <>
            <Link className="text-primary" to="/dashboard">
              Dashboard
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link className="text-primary" to="/login">
              Login
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
