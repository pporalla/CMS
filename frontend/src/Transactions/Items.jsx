import { useEffect, useState } from "react";
// Assuming you are using the same CSS file for the card styles
import '../styles/Home.css'; 

function Items({ onLogout }) {
  // 1. Setup the state for a list of items
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        // Make sure this URL matches exactly what you put in stores/urls.py!
        const response = await fetch('http://localhost:8000/api/stores/items/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data); 
        } else {
          alert("Your session expired. Please log in again.");
          onLogout(); 
        }
      } catch (error) {
        alert("Could not connect to the server.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, [onLogout]);

  return (
    <div className="account-card">
      <h3>Inventory Items</h3>
      
      {isLoading ? (
        <p>Loading inventory...</p>
      ) : items && items.length > 0 ? (
        // 2. Loop through the items array and create a block for each one
        items.map((item) => (
          <div key={item.item_id} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <div className="info-row">
              <div className="info-label">Item ID</div>
              <div className="info-value">{item.item_id}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Item Name</div>
              <div className="info-value">{item.item_name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Quantity in Stock</div>
              <div className="info-value">{item.quantity}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Store Location</div>
              <div className="info-value">{item.store}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No items found in the database.</p>
      )}
    </div>
  );
}

export default Items;