import { useState, useEffect } from 'react';

const ManagerEmployeeList = () => {
    
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stores, setStores] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        store: '',
        mobileno:'',
        address:''
    });
    const [formError, setFormError] = useState(null);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/manager/employees/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem('access_token');
            // NOTE: Replace this URL with your actual Django endpoint for listing stores
            const response = await fetch('http://localhost:8000/api/manager/stores/', { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStores(data);
            }
        } catch (err) {
            console.error("Failed to fetch stores", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchStores();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setFormError(null);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/manager/employees/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("DJANGO REJECTED THE FORM BECAUSE:", errorData);
                throw new Error(errorData.detail || 'Failed to create employee');
            }

            setShowForm(false);
            setFormData({ first_name: '', last_name: '', email: '', password: '', store: '', mobileno: '', address: '' });
            fetchEmployees();

        } catch (err) {
            setFormError(err.message);
        }
    };

    if (loading) return <div className="loading-state">Loading employees...</div>;
    if (error) return <div className="error-state">Error: {error}</div>;

    return (
        <section className="manager-employee-section">
            <header className="section-header">
                <h2>Employee Directory</h2>
                <button 
                    className={showForm ? "btn-secondary" : "btn-primary"} 
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Employee'}
                </button>
            </header>

            {showForm && (
                <section className="creation-panel">
                    <h3>Create New Employee Account</h3>
                    
                    {formError && (
                        <div className="error-banner" role="alert">{formError}</div>
                    )}
                    
                    <form onSubmit={handleAddEmployee} className="manager-form">
                        <fieldset className="form-row">
                            <input 
                                type="text" name="first_name" placeholder="First Name" required
                                value={formData.first_name} onChange={handleInputChange} className="form-input"
                            />
                            <input 
                                type="text" name="last_name" placeholder="Last Name" required
                                value={formData.last_name} onChange={handleInputChange} className="form-input"
                            />
                        </fieldset>

                        <fieldset className="form-row">
                            <input 
                                type="email" name="email" placeholder="Email Address" required
                                value={formData.email} onChange={handleInputChange} className="form-input"
                            />
                            <input 
                                type="password" name="password" placeholder="Temporary Password" required
                                value={formData.password} onChange={handleInputChange} className="form-input"
                            />
                        </fieldset>

                        <fieldset className="form-row">
                            <select 
                                name="store" 
                                value={formData.store} 
                                onChange={handleInputChange} 
                                className="form-input"
                                required
                            >
                                <option value="" disabled>Select a Store Assignment</option>
                                
                                {/* FIXED: Using store.store_id for the key and value, and store.store_name for the text */}
                                {stores.map((store) => (
                                    <option key={store.store_id} value={store.store_id}>
                                        {store.store_name} 
                                    </option>
                                ))}
                            </select>
                            
                            <div></div> 
                        </fieldset>

                        <fieldset className="form-row">
                            <input 
                                type="tel" 
                                name="mobileno" 
                                placeholder="Mobile Number" 
                                required
                                value={formData.mobileno} 
                                onChange={handleInputChange} 
                                className="form-input"
                            />
                            <input 
                                type="text" 
                                name="address" 
                                placeholder="Home Address" 
                                required
                                value={formData.address} 
                                onChange={handleInputChange} 
                                className="form-input"
                            />
                        </fieldset>



                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Create Account</button>
                        </div>
                    </form>
                </section>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Email</th><th>Store ID</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.user_id}>
                                <td>{employee.user_id}</td>
                                <td>{employee.first_name} {employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.store ? employee.store : <span className="badge-warning">Unassigned</span>}</td>
                                <td>
                                    {employee.is_active ? <span className="badge-success">Active</span> : <span className="badge-danger">Inactive</span>}
                                </td>
                                <td><button className="btn-secondary">Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {employees.length === 0 && <p className="empty-state">No employees found.</p>}
            </div>
        </section>
    );
};

export default ManagerEmployeeList;