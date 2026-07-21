import { useEffect, useState } from "react";
import '../styles/Home.css'; 

function Orders({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        const response = await fetch('http://localhost:8000/api/stores/orders/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("ORDERS FETCH SUCCESS:", data);
          setOrders(data); 
        } else {
          console.log("STATUS: Failed with code", response.status);
          alert("Your session expired. Please log in again.");
          onLogout(); 
        }
      } catch (error) {
        alert("Could not connect to the server.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [onLogout]);

  return (
    <div className="account-card">
      <h3>Orders Details</h3>
      
      {isLoading ? (
        <p>Loading orders...</p>
      ) : orders && orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.order_id} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <div className="info-row">
              <div className="info-label">Order ID</div>
              <div className="info-value">{order.order_id}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Order Name</div>
              <div className="info-value">{order.order_name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Marketplace</div>
              <div className="info-value">{order.marketplace}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Store</div>
              <div className="info-value">{order.store}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Pricing</div>

              <div className="info-value">
                MRP: {order.mrp} | Discount: {order.discount} | Selling: {order.selling_price}
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Order Date</div>
              
              <div className="info-value">{new Date(order.order_date).toLocaleDateString()}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No orders found in the database.</p>
      )}
    </div>
  );
}

export default Orders;