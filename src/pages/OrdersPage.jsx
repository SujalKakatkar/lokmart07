import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if(!user) return;

        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          order_items (*)
        `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if(!error) {
                setOrders(data);
            }
        };

        fetchOrders();
    }, [user]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Your Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border p-4 rounded-lg"
                        >
                            {/* ORDER HEADER */}
                            <div className="flex justify-between mb-2">
                                <p className="font-semibold">
                                    Order ID: {order.id.slice(0, 8)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>

                            {/* ITEMS */}
                            <div className="space-y-2">
                                {order.order_items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                    >
                                        <p>{item.product_name}</p>
                                        <p>
                                            ₹{item.product_price} × {item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* TOTAL */}
                            <div className="border-t mt-3 pt-2 flex justify-between font-bold">
                                <p>Total</p>
                                <p>₹{order.total_amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}