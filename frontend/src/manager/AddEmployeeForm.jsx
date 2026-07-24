import { useState, useEffect } from 'react';

const AddEmployeeForm = ({ onSuccess, onCancel }) => {
    const [stores, setStores] = useState([]);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', 
        password: '', store: '', mobileno: '', address: ''
    });

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const token = localStorage.getItem('access_token');
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
        fetchStores();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                throw new Error(errorData.detail || 'Failed to create employee');
            }

            // If successful, tell the parent to close the form and refresh!
            onSuccess();

        } catch (err) {
            setFormError(err.message);
        }
    };

    return (
            <section className="creation-panel">
                <h3>Create New Employee Account</h3>
                {formError && <div className="error-banner" role="alert">{formError}</div>}
                
                <form onSubmit={handleAddEmployee} className="manager-form">
                    <fieldset className="form-row">
                        <input type="text" name="first_name" placeholder="First Name" required value={formData.first_name} onChange={handleInputChange} className="form-input" />
                        <input type="text" name="last_name" placeholder="Last Name" required value={formData.last_name} onChange={handleInputChange} className="form-input" />
                    </fieldset>

                    <fieldset className="form-row">
                        <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} className="form-input" />
                        <input type="password" name="password" placeholder="Temporary Password" required value={formData.password} onChange={handleInputChange} className="form-input" />
                    </fieldset>

                    <fieldset className="form-row">
                        <select name="store" value={formData.store} onChange={handleInputChange} className="form-input" required >
                            <option value="" disabled>Select a Store Assignment</option>
                            {stores.map((store) => (
                                <option key={store.store_id} value={store.store_id}>{store.store_name}</option>
                            ))}
                        </select>
                        <div></div> 
                    </fieldset>

                    <fieldset className="form-row">
                        <input type="tel" name="mobileno" placeholder="Mobile Number" required value={formData.mobileno} onChange={handleInputChange} className="form-input" />
                        <input type="text" name="address" placeholder="Home Address" required value={formData.address} onChange={handleInputChange} className="form-input" />
                    </fieldset>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Create Account</button>
                        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </section>
        );
    }
export default AddEmployeeForm;