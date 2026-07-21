import { useEffect, useState } from "react";
import '../styles/Home.css';

function Home({ onLogout }) {
  // 1. Defining the variables exactly as they are used below
  const [marketplaces, setMarketplaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMarketPlace = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/business/marketplaces/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMarketplaces(data);
        } else {
          alert("Your session expired. Please log in again.");
          onLogout(); 
        }
      } catch (error) {
        alert("Could not connect to the server.");
      } finally {
        setIsLoading(false);// To close the after loading the page
      }
    }

    fetchMarketPlace();
  }, [onLogout]);

  return (
    <div className="account-card">
      <h3>MarketPlace Details</h3>
      
      {isLoading ? (
        <p>Loading your secure data...</p>
      ) : marketplaces && marketplaces.length > 0 ? (
        // 3. Using the lowercase plural variable here
        marketplaces.map((mp) => (
          <div key={mp.m_id} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <div className="info-row">
              <div className="info-label">MarketPlace ID</div>
              <div className="info-value">{mp.m_id}</div>
            </div>
            <div className="info-row">
              <div className="info-label">MarketPlace Name</div>
              <div className="info-value">{mp.name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Added On</div>
              <div className="info-value">{mp.added_on}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No marketplaces found.</p>
      )}
    </div>
  );
}

export default Home;