// 1. Import useState (React's memory tool to remember what the user types)
import { useState } from 'react';
import "../styles/Login.css";

// This is a function passed down from App.jsx so Login.jsx can shout "I finished logging in!"
function Login({ onLoginSuccess }) {
  // 2. Create memory boxes for the email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. We added 'async' here because the browser has to wait for Django to reply over the network
  const handleSubmit = async (e) => {
    e.preventDefault(); // This stops the page from doing a standard HTML refresh when you click submit
    
    try {
      // 4. The 'fetch' messenger takes the data and travels to Django's login URL
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // This tells Django we are sending raw JSON data
        },
        body: JSON.stringify({
          email: email,       // Sending the email from our memory box
          password: password  // Sending the password from our memory box
        })
      });

      // 5. We open Django's reply and turn it back into JavaScript data
      const data = await response.json(); 

      // 6. response.ok checks if Django sent a 200 Success status
      if (response.ok) {
        // THE NEW DATA FLOW: Instead of just logging the token, we save it permanently.
        // localStorage is the browser's digital wallet. We name the slot 'access_token'.
        localStorage.setItem('access_token', data.access);
                
        // We trigger the wire to tell App.jsx to change the screen
        onLoginSuccess();
      } else {
        // If the password was wrong, Django sends a 401 Unauthorized status
        alert("Login failed. Please check your email and password.");
      }

    } catch (error) {
      // This only triggers if React literally cannot reach port 8000 (e.g., Django is turned off)
      alert("Could not connect to the Django server. Is it running?");
    }
  };

  // 7. The HTML-like UI (JSX)
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Employee Login</h2>
        <form onSubmit={handleSubmit}>
          
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