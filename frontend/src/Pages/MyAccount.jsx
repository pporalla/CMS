// 1. We import 'useEffect'. This is a new React tool that says: 
// "Run this code immediately as soon as the screen loads."
import { useState, useEffect } from 'react';
import '../styles/MyAccount.css';

function MyAccount({ onLogout }) {
  // 2. Memory box for the user's data from Django (starts empty/null)
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 3. Get the Keycard from the browser's digital wallet
        const token = localStorage.getItem('access_token');

        // 4. The fetch messenger goes to the VIP room
        const response = await fetch('http://localhost:8000/api/users/profile/', {
          method: 'GET', // GET because we are just asking for data, not submitting a form
          headers: {
            'Content-Type': 'application/json',
            // 5. THE GOLDEN TICKET: We attach the token to prove we are logged in!
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.ok) {
          // 6. Open the JSON reply and put it in our memory box
          const data = await response.json();
          setUserData(data);
        } else {
          // If the token is expired or fake, Django kicks us out
          alert("Your session expired. Please log in again.");
          onLogout(); 
        }
      } catch (error) {
        alert("Could not connect to the server.");
      }
    };

    // Trigger the function to run right now
    fetchProfile();
    
  }, [onLogout]); // The empty brackets here mean "Only run this once when the component first appears"

  return (
    <div className="account-card">
      <h3>My Account Details</h3>
      {userData ? (
        <div>
          <div className="info-row">
            <div className="info-label">Employee ID</div>
            <div className="info-value">{userData.employee_id}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Full Name</div>
            <div className="info-value">{userData.first_name}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Email Address</div>
            <div className="info-value">{userData.email}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Store</div>
            <div className="info-value">{userData.store}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Security Status</div>
            <div className="info-value" style={{ color: '#10b981' }}>{userData.secret_message}</div>
          </div>
        </div>
      ) : (
        <p>Loading your secure data...</p>
      )}
    </div>
  );
}

export default MyAccount;