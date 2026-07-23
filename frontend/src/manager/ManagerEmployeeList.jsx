import React, { useState, useEffect } from 'react';

const ManagerEmployeeList = () => {
    // 1. Set up React State to hold the data from Django
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect runs automatically when this component first loads on the screen
    useEffect(() => {
        fetchEmployees();
    }, []);

    // 3. The function that actually talks to your Django API
    const fetchEmployees = async () => {
        try {
            // Retrieve the manager's login token from local storage
            const token = localStorage.getItem('access_token');

            // Call the secure Manager endpoint we built in Django
            const response = await fetch('http://localhost:8000/api/manager/employees/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // CRITICAL: Prove to Django that this is a manager making the request
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employees. Please check your permissions.');
            }

            // Convert the response to JSON and save it in React state
            const data = await response.json();
            setEmployees(data);
            setLoading(false);
            
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // 4. Handle the Loading and Error states before the data arrives
    if (loading) return <div className="loading-state">Loading employees...</div>;
    if (error) return <div className="error-state">Error: {error}</div>;

    // 5. Render the semantic HTML table with the employee data
    return (
        <section className="manager-employee-section">
            <header className="section-header">
                <h2>Employee Directory</h2>
                {/* We will wire this button up in the next step to open a creation form */}
                <button className="btn-primary">Add New Employee</button>
            </header>

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
                        {/* 6. Loop through the employees array and create a table row for each one */}
                        {employees.map((employee) => (
                            <tr key={employee.user_id}>
                                <td>{employee.user_id}</td>
                                <td>{employee.first_name} {employee.last_name}</td>
                                <td>{employee.email}</td>
                                
                                {/* If store is null, show 'Unassigned' */}
                                <td>{employee.store ? employee.store : <span className="badge-warning">Unassigned</span>}</td>
                                
                                <td>
                                    {employee.is_active ? (
                                        <span className="badge-success">Active</span>
                                    ) : (
                                        <span className="badge-danger">Inactive</span>
                                    )}
                                </td>
                                
                                <td>
                                    {/* We will wire this up to open an edit modal later */}
                                    <button className="btn-secondary">Edit Assignment</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* 7. Fallback if the database is completely empty */}
                {employees.length === 0 && (
                    <p className="empty-state">No employees found in the system.</p>
                )}
            </div>
        </section>
    );
};

export default ManagerEmployeeList;