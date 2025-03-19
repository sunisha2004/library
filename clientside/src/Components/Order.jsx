import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Order = () => {
    const token = localStorage.getItem('token');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3002/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Orders fetched:", response.data); // Debugging

                setOrders(response.data);
            } catch (err) {
                console.log("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    // ✅ Handle confirming an order
    const handleConfirm = async (orderId) => {
        if (!orderId) {
            console.error("Order ID is undefined");
            return;
        }
        try {
            await axios.put(`http://localhost:3002/api/orders/${orderId}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(prevOrders => prevOrders.map(order =>
                order._id === orderId ? { ...order, confirm: true } : order
            ));
        } catch (err) {
            console.log("Failed to confirm order:", err);
        }
    };

    // ✅ Handle returning a book
    const handleReturn = async (orderId) => {
        if (!orderId) {
            console.error("❌ Order ID is undefined");
            return;
        }
    
        try {
            console.log(`🔄 Sending request to return order: ${orderId}`);
    
            const response = await axios.put(`http://localhost:3002/api/orders/${orderId}/return`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log(`✅ Order ${orderId} returned:`, response.data);
    
            setOrders(prevOrders => prevOrders.map(order =>
                order._id === orderId ? { ...order, status: "Returned" } : order
            ));
    
        } catch (err) {
            console.error("❌ Failed to return order:", err.response?.data || err.message);
        }
    };
    

    if (loading) return <p>Loading orders...</p>;

    return (
        <div>
            <h2>Orders</h2>
            {orders.length === 0 ? (
                <p>No orders available</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order._id || Math.random()}> {/* Ensure unique key */}
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Book Name:</strong> {order.bookname || "Unknown"}</p>
                            <p><strong>Status:</strong> {order.status || "Pending"}</p>
                            
                            <button onClick={() => handleConfirm(order._id)} disabled={order.status === "Confirmed"}>
                                Confirm Order
                            </button>
                            
                            <button onClick={() => handleReturn(order._id)} disabled={order.status === "Returned"}>
                                Return
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Order;
