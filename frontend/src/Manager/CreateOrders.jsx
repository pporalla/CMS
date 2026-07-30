// import { useState, useEffect } from 'react';
// import '../styles/Home.css'; 
// import '../styles/Login.css'; // Reusing your form styles

// function ManagerDashboard({ onLogout }) {
//   // 1. DYNAMIC LISTS: State to hold the data we fetch from Django
//   const [marketplaces, setMarketplaces] = useState([]);
//   const [stores, setStores] = useState([]);
//   const [storeItems, setStoreItems] = useState([]);
//   const [storeEmployees, setStoreEmployees] = useState([]);

//   // 2. FORM DATA: State to hold what the Manager is typing/selecting
//   const [orderName, setOrderName] = useState('');
//   const [selectedMarketplace, setSelectedMarketplace] = useState('');
//   const [selectedStore, setSelectedStore] = useState('');
//   const [selectedEmployee, setSelectedEmployee] = useState('');
  
//   const [mrp, setMrp] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [sellingPrice, setSellingPrice] = useState('');

//   // 3. THE CART: Holding the items before sending to the database
//   const [cartItem, setCartItem] = useState('');
//   const [cartQuantity, setCartQuantity] = useState(1);
//   const [orderItems, setOrderItems] = useState([]); // Array of items to pack

//   // --- API FETCHING ---

//   // Fetch initial data (Stores and Marketplaces) on page load
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const token = localStorage.getItem('access_token');
//       const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

//       try {
//         // We will need to create these endpoints in Django next!
//         const storeRes = await fetch('http://localhost:8000/api/stores/list/', { headers });
//         const marketRes = await fetch('http://localhost:8000/api/stores/marketplaces/', { headers });

//         if (storeRes.ok) setStores(await storeRes.json());
//         if (marketRes.ok) setMarketplaces(await marketRes.json());
//       } catch (error) {
//         console.error("Failed to fetch initial data");
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // Fetch Items and Employees INSTANTLY when a Store is selected
//   useEffect(() => {
//     if (!selectedStore) {
//       setStoreItems([]);
//       setStoreEmployees([]);
//       return;
//     }

//     const fetchStoreData = async () => {
//       const token = localStorage.getItem('access_token');
//       const headers = { 'Authorization': `Bearer ${token}` };

//       try {
//         // Fetch inventory specific to this store
//         const itemsRes = await fetch(`http://localhost:8000/api/stores/${selectedStore}/items/`, { headers });
//         if (itemsRes.ok) setStoreItems(await itemsRes.json());

//         // Fetch employees assigned to this store
//         const empRes = await fetch(`http://localhost:8000/api/users/store/${selectedStore}/employees/`, { headers });
//         if (empRes.ok) setStoreEmployees(await empRes.json());
//       } catch (error) {
//         console.error("Failed to fetch store specific data");
//       }
//     };
    
//     fetchStoreData();
//     // Clear out the cart and employee selection if they change the store halfway through
//     setOrderItems([]);
//     setSelectedEmployee('');
//   }, [selectedStore]);

//   // --- ACTIONS ---

//   // Add an item to the temporary cart
//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     if (!cartItem || cartQuantity < 1) return;

//     // Find the item name from our fetched list for display purposes
//     const itemDetails = storeItems.find(i => i.item_id.toString() === cartItem);
    
//     setOrderItems([...orderItems, { 
//       item_id: cartItem, 
//       item_name: itemDetails.item_name, 
//       quantity: cartQuantity 
//     }]);
    
//     // Reset cart inputs
//     setCartItem('');
//     setCartQuantity(1);
//   };

//   // Submit the massive final order to Django
//   const handleSubmitOrder = async (e) => {
//     e.preventDefault();
    
//     if (orderItems.length === 0) {
//       alert("You must add at least one item to the order!");
//       return;
//     }

//     const payload = {
//       order_name: orderName,
//       marketplace_id: selectedMarketplace,
//       store_id: selectedStore,
//       assigned_to_id: selectedEmployee,
//       mrp: mrp,
//       discount: discount,
//       selling_price: sellingPrice,
//       items: orderItems // Sending the bridge array!
//     };

//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await fetch('http://localhost:8000/api/stores/orders/create/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (response.ok) {
//         alert("Order successfully created and assigned!");
//         // Reset the form completely
//         setOrderName('');
//         setSelectedStore('');
//         setSelectedMarketplace('');
//         setMrp('');
//         setDiscount('');
//         setSellingPrice('');
//         setOrderItems([]);
//       } else {
//         alert("Failed to create order. Please check the inputs.");
//       }
//     } catch (error) {
//       alert("Server connection error.");
//     }
//   };

//   return (
//     <div className="account-card">
//       <h3>Create New Order</h3>
      
//       <form onSubmit={handleSubmitOrder}>
//         {/* ROW 1: Basic Details */}
//         <div className="form-group">
//           <label className="form-label">Order Name / ID</label>
//           <input type="text" className="form-input" value={orderName} onChange={(e) => setOrderName(e.target.value)} required />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Marketplace</label>
//           <select className="form-input" value={selectedMarketplace} onChange={(e) => setSelectedMarketplace(e.target.value)} required>
//             <option value="">-- Select Marketplace --</option>
//             {marketplaces.map(mp => (
//               <option key={mp.id} value={mp.id}>{mp.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* ROW 2: The Dependent Logic */}
//         <div className="form-group">
//           <label className="form-label">Assign to Store</label>
//           <select className="form-input" value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} required>
//             <option value="">-- Select Store --</option>
//             {stores.map(store => (
//               <option key={store.id} value={store.id}>{store.name}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label className="form-label">Assign to Employee (Optional)</label>
//           <select className="form-input" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} disabled={!selectedStore}>
//             <option value="">-- Select Employee --</option>
//             {storeEmployees.map(emp => (
//               <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
//             ))}
//           </select>
//         </div>

//         {/* ROW 3: Pricing */}
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
//           <div className="form-group" style={{ flex: 1 }}>
//             <label className="form-label">MRP</label>
//             <input type="number" className="form-input" value={mrp} onChange={(e) => setMrp(e.target.value)} required />
//           </div>
//           <div className="form-group" style={{ flex: 1 }}>
//             <label className="form-label">Discount</label>
//             <input type="number" className="form-input" value={discount} onChange={(e) => setDiscount(e.target.value)} />
//           </div>
//           <div className="form-group" style={{ flex: 1 }}>
//             <label className="form-label">Selling Price</label>
//             <input type="number" className="form-input" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required />
//           </div>
//         </div>

//         {/* ROW 4: Order Items Builder */}
//         <div className="list-item-container" style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
//           <h4>Add Items to Order</h4>
          
//           <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
//             <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
//               <select className="form-input" value={cartItem} onChange={(e) => setCartItem(e.target.value)} disabled={!selectedStore}>
//                 <option value="">-- Choose Item --</option>
//                 {storeItems.map(item => (
//                   <option key={item.item_id} value={item.item_id}>{item.item_name} (Stock: {item.quantity})</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
//               <input type="number" className="form-input" value={cartQuantity} min="1" onChange={(e) => setCartQuantity(e.target.value)} disabled={!selectedStore} />
//             </div>
            
//             <button onClick={handleAddToCart} className="btn-success" disabled={!cartItem}>Add</button>
//           </div>

//           {/* Display the current cart */}
//           {orderItems.length > 0 && (
//             <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
//               {orderItems.map((oi, index) => (
//                 <li key={index} className="item-qty-row">
//                   {oi.quantity}x {oi.item_name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <button type="submit" className="login-button" style={{ marginTop: '20px' }}>Submit Order</button>
//       </form>
//     </div>
//   );
// }
