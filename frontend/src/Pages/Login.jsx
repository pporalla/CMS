import { useState } from 'react';
import "../styles/Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          password: password,
          role: role // Backend needs this to verify cross-logins
        })
      });

      const data = await response.json(); 

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('user_role', role); 
        onLoginSuccess(role);
      } else {
        alert(data.error || "Login failed. Ensure you selected the correct role.");
      }
    } catch (error) {
      alert("Could not connect to the Django server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {role === 'manager' ? 'Manager Login' : 'Employee Login'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="role-selection-group">
            <label className="role-label">
              <input 
                type="radio" 
                value="employee" 
                checked={role === 'employee'} 
                onChange={(e) => setRole(e.target.value)} 
                className="role-radio"
              />
              Employee
            </label>
            <label className="role-label">
              <input 
                type="radio" 
                value="manager" 
                checked={role === 'manager'} 
                onChange={(e) => setRole(e.target.value)} 
                className="role-radio"
              />
              Manager
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Email ID</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input"
              required
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;