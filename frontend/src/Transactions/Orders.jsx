import { useEffect, useState } from "react";
import '../styles/Home.css'; 

function Orders({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the orders assigned to this employee's store
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
  };

  useEffect(() => {
    fetchOrders();
  }, [onLogout]);

  // 2. Handle button clicks to update the order status in Django
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:8000/api/stores/orders/${orderId}/update-status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`Order #${orderId} marked as: ${newStatus}`);
        fetchOrders(); // Refresh the screen instantly to show the new status
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      alert("Could not connect to the server.");
    }
  };

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

            {/* THE ITEMS: Loops through the OrderItem bridge to show exact quantities and names */}
            <div className="info-row">
              <div className="info-label">Item(s) to Pack</div>
              <div className="info-value">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item, index) => (
                    <div key={index} style={{ fontWeight: 'bold' }}>
                      {item.quantity}x {item.item_name}
                    </div>
                  ))
                ) : (
                  <span style={{ color: 'red' }}>No item assigned</span>
                )}
              </div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Status</div>
              <div className="info-value" style={{ fontWeight: 'bold', color: order.status === 'OUT_OF_STOCK' ? 'red' : 'green' }}>
                {order.status}
              </div>
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

            {/* ACTION BUTTONS: Only show them if the order hasn't been completed yet */}
            {order.status !== 'VERIFIED' && order.status !== 'OUT_OF_STOCK' && (
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleUpdateStatus(order.order_id, 'VERIFIED')}
                  style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Item Found (In Stock)
                </button>
                <button 
                  onClick={() => handleUpdateStatus(order.order_id, 'OUT_OF_STOCK')}
                  style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Item Missing (Out of Stock)
                </button>
              </div>
            )}
            
          </div>
        ))
      ) : (
        <p>No orders found in the database.</p>
      )}
    </div>
  );
}

export default Orders;