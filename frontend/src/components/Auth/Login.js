import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './Login.css';

import { login, clearErrors } from '../../actions/userActions';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);  // Added state for the checkbox
  
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(state => state.auth);
  
  const redirect = searchParams.get("redirect") ? `/${searchParams.get("redirect")}` : '/'
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }

    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add keepSignedIn to the dispatch if necessary
    dispatch(login(email, password, keepSignedIn));
    console.log('Logging in:', { email, password, keepSignedIn });
  };

  return (
    <div className="login-page"> {/* Isolated container for background */}
      <div className="background-image"></div> {/* Background image */}
      <div className="dim-overlay"></div> {/* Dimmed overlay */}
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className='top'>
            <img src='/images/logo4.png' className="pic" alt="Logo" />
            <h2>LOGIN TO CONTINUE</h2>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {/* Keep me signed in checkbox */}
       

          <button type="submit" className="auth-buttonn">Login</button>

          <Link to='/register'>
            <p className="toggle-link">Don't have an account? Sign up</p>
          </Link>
          <Link to='/password/forgot'>
            <p className="toggle-link mt-0">Forgot your password?</p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
