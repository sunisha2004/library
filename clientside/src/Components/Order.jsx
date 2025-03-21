
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./scss/Order.scss";

const Order = () => {
    const token = localStorage.getItem('token');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clickedButtons, setClickedButtons] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3002/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
                console.log(response.data);
                
            } catch (err) {
                console.log("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const handleConfirm = async (orderId) => {
        if (!orderId) return;
        setClickedButtons(prev => ({ ...prev, [orderId]: 'confirm' }));
        try {
            await axios.put(`http://localhost:3002/api/orders/${orderId}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(prevOrders => prevOrders.map(order =>
                order._id === orderId ? { ...order, status: "Confirmed" } : order
            ));
        } catch (err) {
            console.log("Failed to confirm order:", err);
        }
    };

    const handleReturn = async (orderId) => {
        if (!orderId) return;
        setClickedButtons(prev => ({ ...prev, [orderId]: 'return' }));
        try {
            await axios.put(`http://localhost:3002/api/orders/${orderId}/return`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(prevOrders => prevOrders.map(order =>
                order._id === orderId ? { ...order, status: "Returned" } : order
            ));
        } catch (err) {
            console.error("Failed to return order:", err);
        }
    };

    if (loading) return <p className="loading-text">Loading orders...</p>;

    return (
        <div className="orders-container">
            <h2 className="orders-title">Orders</h2>
            {orders.length === 0 ? (
                <p className="no-orders">No orders available</p>
            ) : (
                <ul className="order-list">
                    {orders.map(order => (
                        <li key={order._id} className="order-item">
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Book Name:</strong> {order.bookname || "Unknown"}</p>
                            <p className={`order-status ${order.status?.toLowerCase()}`}>
                                <strong>Status:</strong> {order.status || "Pending"}
                            </p>
                            
                            <div className="order-buttons">
                                <button 
                                    className="confirm-btn" 
                                    onClick={() => handleConfirm(order._id)} 
                                    disabled={clickedButtons[order._id] === 'confirm' || order.confirm === true}
                                >
                                    Confirm Order
                                </button>
                                
                                <button 
                                    className="return-btn" 
                                    onClick={() => handleReturn(order._id)} 
                                    disabled={clickedButtons[order._id] === 'return' || order.status === "Returned"}
                                >
                                    Return
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Order;
