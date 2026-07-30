import { useState } from 'react';
import '../styles/Home.css'; 
import '../styles/Login.css'; 

function CreateStore() {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [pincode, setPincode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:8000/api/stores/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        },
        body: JSON.stringify({
          store_name: storeName,
          store_address: storeAddress,
          store_code: storeCode,
          pincode: pincode
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Store created successfully!');
        setStoreName('');
        setStoreAddress('');
        setStoreCode('');
        setPincode('');
      } else {
        const data = await response.json();
        setIsSuccess(false);
        setMessage(data.error || 'Failed to create store. Please try again.');
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
      <h3>Register New Store</h3>
      <p className="page-description">
        Add a new store
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Store Name</label>
          <input 
            type="text" 
            className="form-input" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)} 
            placeholder="e.g., Dmm Branch"
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Store Code</label>
          <input 
            type="text" 
            className="form-input" 
            value={storeCode} 
            onChange={(e) => setStoreCode(e.target.value)} 
            placeholder="eg. 22561"
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location / Address</label>
          <input 
            type="text" 
            className="form-input" 
            value={storeAddress} 
            onChange={(e) => setStoreAddress(e.target.value)} 
            placeholder="e.g., PRT Street"
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pincode</label>
          <input 
            type="text" 
            className="form-input" 
            value={pincode} 
            onChange={(e) => setPincode(e.target.value)} 
            placeholder="e.g., PRT Street"
            required 
          />
        </div>

        <button type="submit" className="login-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Store'}
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

export default CreateStore;