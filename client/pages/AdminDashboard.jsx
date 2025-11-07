//WITH UI
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminDashboard.css'; 

const ItemForm = ({ initialData, itemType, onSubmit, onCancel }) => {
    const isFlight = itemType === 'Flight';
    const [formData, setFormData] = useState(initialData || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h3 className="form-header">{initialData ? `Edit ${itemType}` : `Add New ${itemType}`}</h3>
            
            <div><input name={isFlight ? 'airline' : 'name'} placeholder={isFlight ? 'Airline Name' : 'Hotel Name'} value={formData[isFlight ? 'airline' : 'name'] || ''} onChange={handleChange} required className="input-field" /></div>
            <div><input name="price" type="number" placeholder="Price" value={formData.price || ''} onChange={handleChange} required className="input-field" /></div>
            
            {isFlight ? (
                <>
                    <div><input name="source" placeholder="Source City" value={formData.source || ''} onChange={handleChange} required className="input-field" /></div>
                    <div><input name="destination" placeholder="Destination City" value={formData.destination || ''} onChange={handleChange} required className="input-field" /></div>
                    <div><input name="date" type="datetime-local" placeholder="Date & Time" value={formData.date ? formData.date.slice(0, 16) : ''} onChange={handleChange} required className="input-field" /></div>
                    <div><input name="duration" placeholder="Duration (e.g., 2h 30m)" value={formData.duration || ''} onChange={handleChange} className="input-field" /></div>
                </>
            ) : (
                <>
                    <div><input name="city" placeholder="City" value={formData.city || ''} onChange={handleChange} required className="input-field" /></div>
                    <div><textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} className="input-field" rows="3" /></div>
                    <div><input name="amenities" placeholder="Amenities (comma separated)" value={formData.amenities?.join(', ') || ''} onChange={handleArrayChange} className="input-field" /></div>
                    <div><input name="images" placeholder="Image URLs (comma separated)" value={formData.images?.join(', ') || ''} onChange={handleArrayChange} className="input-field" /></div>
                </>
            )}

            <div className="form-buttons">
                <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-submit">
                    {initialData ? 'Update' : 'Create'} {itemType}
                </button>
            </div>
        </form>
    );
};


const AdminDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('hotels'); 
    const [editingItem, setEditingItem] = useState(null);
    const [itemType, setItemType] = useState(null);

    const fetchData = async (endpoint, setter) => {
        try {
            const { data } = await api.get(endpoint);
            setter(data);
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
        }
    };

    useEffect(() => {
        if (activeTab === 'hotels') fetchData('/hotels', setHotels);
        if (activeTab === 'flights') fetchData('/flights', setFlights);
        if (activeTab === 'bookings') fetchData('/bookings/admin', setBookings);
    }, [activeTab]);

    
    const handleSave = async (data) => {
        const endpoint = itemType === 'Hotel' ? '/hotels' : '/flights';
        const isEditing = !!editingItem;

        try {
            if (isEditing) {
                await api.put(`${endpoint}/${editingItem._id}`, data);
            } else {
                await api.post(endpoint, data);
            }
            
            
            if (itemType === 'Hotel') fetchData('/hotels', setHotels);
            if (itemType === 'Flight') fetchData('/flights', setFlights);

            setEditingItem(null);
            setItemType(null);
            console.log(`${itemType} ${isEditing ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error(`Failed to save ${itemType}:`, error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        const endpoint = type === 'Hotel' ? '/hotels' : '/flights';
        try {
            await api.delete(`${endpoint}/${id}`);
            if (type === 'Hotel') fetchData('/hotels', setHotels);
            if (type === 'Flight') fetchData('/flights', setFlights);
            console.log(`${type} deleted successfully.`);
        } catch (error) {
            console.error(`Failed to delete ${type}:`, error);
        }
    };

    
    const renderHotels = () => (
        <div className="list-container">
            <button className="btn-primary" onClick={() => { setEditingItem(null); setItemType('Hotel'); }}>+ Add New Hotel</button>
            {hotels.map(h => (
                <div key={h._id} className="list-item">
                    <p className="item-title">{h.name} ({h.city}) - ₹{h.price}</p>
                    <div className="item-actions">
                        <button className="btn-edit" onClick={() => { setEditingItem(h); setItemType('Hotel'); }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(h._id, 'Hotel')}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderFlights = () => (
        <div className="list-container">
            <button className="btn-primary" onClick={() => { setEditingItem(null); setItemType('Flight'); }}>+ Add New Flight</button>
            {flights.map(f => (
                <div key={f._id} className="list-item">
                    <p className="item-title">{f.airline}: {f.source} &rarr; {f.destination} - ₹{f.price}</p>
                    <div className="item-actions">
                        <button className="btn-edit" onClick={() => { setEditingItem(f); setItemType('Flight'); }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(f._id, 'Flight')}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderBookings = () => (
        <div className="list-container">
            {bookings.map(b => (
                <div key={b._id} className="list-item booking-item">
                    <p><strong>Booking ID:</strong> {b._id}</p>
                    <p><strong>User:</strong> {b.userId?.name || 'N/A'} ({b.userId?.email || 'N/A'})</p>
                    <p><strong>Item:</strong> {b.itemType} - {b.itemId?.name || b.itemId?.airline || 'N/A'}</p>
                    <p><strong>Amount:</strong> ₹{b.totalAmount} | <strong>Status:</strong> <span className={`status ${b.status === 'Confirmed' ? 'confirmed' : 'cancelled'}`}>{b.status}</span></p>
                </div>
            ))}
        </div>
    );

    const renderContent = () => {
        if (editingItem !== null || itemType !== null) {
            return (
                <ItemForm 
                    initialData={editingItem} 
                    itemType={itemType} 
                    onSubmit={handleSave} 
                    onCancel={() => { setEditingItem(null); setItemType(null); }}
                />
            );
        }

        switch (activeTab) {
            case 'flights': return renderFlights();
            case 'bookings': return renderBookings();
            case 'hotels':
            default: return renderHotels();
        }
    };

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-header">🧑‍💼 Admin Dashboard</h1>
            <p className="dashboard-subheader">Full CRUD operations for Hotels & Flights, and view all bookings.</p>

            <div className="tabs">
                {['hotels', 'flights', 'bookings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setEditingItem(null); setItemType(null); }}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="content-container">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
