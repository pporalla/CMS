import { useState, useEffect } from 'react';
import '../styles/Home.css'; 
import '../styles/Login.css'; 

function CreateEmployee() {
  // FORM STATE
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  
  // DATA & UI STATE
  const [stores, setStores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // FETCH STORES ON LOAD
  useEffect(() => {
    const fetchStores = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://localhost:8000/api/stores/list/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStores(data);
        }
      } catch (error) {
        console.error("Failed to load stores for the dropdown.");
      }
    };
    
    fetchStores();
  }, []);

  // SUBMIT NEW EMPLOYEE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const token = localStorage.getItem('access_token');

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      store_id: selectedStore // Assigning them to the branch
    };

    try {
      // Pointing to your existing SignupView
      const response = await fetch('http://localhost:8000/api/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Employee account created and assigned successfully!');
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setSelectedStore('');
      } else {
        const data = await response.json();
        setIsSuccess(false);
        // Display backend validation errors (e.g., "Email already exists")
        setMessage(data.error || JSON.stringify(data) || 'Failed to create account.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="account-card">
      <h3>Register New Employee</h3>
      <p className="page-description">
        Create a new employee account and assign them to a specific store.
      </p>
      
      <form onSubmit={handleSubmit}>
        
        {/* Name Grid */}
        <div className="form-row-multi">
          <div className="form-col">
            <label className="form-label">First Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-col">
            <label className="form-label">Last Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            className="form-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Temporary Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assign to Store</label>
          <select 
            className="form-input" 
            value={selectedStore} 
            onChange={(e) => setSelectedStore(e.target.value)} 
            required
          >
            <option value="">-- Select a Store --</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="login-button" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Employee'}
        </button>

        {message && (
          <div className={`alert-message ${isSuccess ? 'text-success' : 'text-danger'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateEmployee;