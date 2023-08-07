import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState(''); 

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const loginUrl = 'http://127.0.0.1:8000/user-api/login/';
      const response = await axios.post(loginUrl, {
        email: email,
        password: password,
      });
  
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log(response.data);
      setError('');
  
      const homeUrl = "http://127.0.0.1:8000/user-api/user/";
      const response2 = await axios.post(homeUrl, {
        token: token 
      });

      console.log(response2.data);
      if (token) {
        const tokenUrl = encodeURIComponent(token);
        const homeUrl = `http://localhost:3000/home/${tokenUrl}`;
        window.location.replace(homeUrl);
      } else {
       
        setError("Geçersiz Kullanici");
        setUserName("");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError('Sunucu hatasi. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {userName && <p>Welcome {userName}</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
        <div>
          <label htmlFor="do_you_havent_an_account">Do you haven't an account? </label>
          <a href="http://127.0.0.1:3000/register">Register</a>
        <div>
          <label htmlFor="resetpasswd">Forgot Password? </label>
          <a href="http://127.0.0.1:3000/emailsend">Reset Password</a>
        </div>
        </div>
      </form>
    </div>
  );
};


export default Login;
