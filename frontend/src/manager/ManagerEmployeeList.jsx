import { useState, useEffect } from 'react';
import AddEmployeeForm from './AddEmployeeForm'; 

const ManagerEmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

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

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Passed to the form component so it can trigger a table refresh
    const handleFormSuccess = () => {
        setShowForm(false);
        fetchEmployees(); 
    };

    if (loading) return <div className="loading-state">Loading employees...</div>;
    if (error) return <div className="error-state">Error: {error}</div>;

    return (
        <section className="manager-employee-section">
            <header className="section-header">
                <h2>Employee Directory</h2>
                {!showForm && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        Add New Employee
                    </button>
                )}
            </header>

            {/* THE EXTRACTED FORM COMPONENT */}
            {showForm && (
                <AddEmployeeForm 
                    onSuccess={handleFormSuccess} 
                    onCancel={() => setShowForm(false)} 
                />
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Store ID</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.user_id}>
                                <td>{employee.user_id}</td>
                                <td>{employee.first_name} {employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>
                                    {employee.store ? employee.store : <span className="badge-warning">Unassigned</span>}
                                </td>
                                <td>
                                    {employee.is_active ? <span className="badge-success">Active</span> : <span className="badge-danger">Inactive</span>}
                                </td>
                                <td>
                                    <button className="btn-secondary">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {employees.length === 0 && (
                    <p className="empty-state">No employees found.</p>
                )}
            </div>
        </section>
    );
}

export default ManagerEmployeeList;