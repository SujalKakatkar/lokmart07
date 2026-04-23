import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // 📦 Fetch Cart
    useEffect(() => {
        if(!user) return;

        const fetchCart = async () => {
            const { data, error } = await supabase
                .from("cart")
                .select("*")
                .eq("user_id", user.id);

            if(error) {
                console.error(error);
                return;
            }

            if(!data) return;

            setCartItems(data);

            const sum = data.reduce(
                (acc, item) =>
                    acc + item.product_price * (item.quantity || 1),
                0
            );

            setTotal(sum);
        };

        fetchCart();
    }, [user]);

    // 💳 Handle Payment + Order Creation
    const handlePayment = async () => {
        if(!cartItems.length) return;

        setLoading(true);

        // 1. Create Order
        const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .insert([
                {
                    user_id: user.id,
                    total_amount: total,
                    status: "placed",
                },
            ])
            .select()
            .single();

        if(orderError) {
            console.error("Order error:", orderError);
            setLoading(false);
            return;
        }

        // 2. Insert Order Items
        const items = cartItems.map((item) => ({
            order_id: orderData.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity || 1,
            shop_name: item.shop_name,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(items);

        if(itemsError) {
            console.error("Items error:", itemsError);
            setLoading(false);
            return;
        }

        // 3. Clear Cart
        await supabase
            .from("cart")
            .delete()
            .eq("user_id", user.id);

        // 4. Show Success
        setSuccess(true);
        setLoading(false);
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* BILL */}
            <div className="border rounded-lg p-4 space-y-3">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                        <p>{item.product_name}</p>
                        <p>
                            ₹{item.product_price} × {item.quantity || 1}
                        </p>
                    </div>
                ))}

                <div className="border-t pt-3 flex justify-between font-bold">
                    <p>Total</p>
                    <p>₹{total}</p>
                </div>
            </div>

            {/* PAYMENT */}
            {!success ? (
                <div className="mt-6 border p-4 rounded-lg">
                    <h2 className="font-semibold mb-3">Demo Payment</h2>

                    <input
                        placeholder="Card Number"
                        className="w-full border p-2 rounded mb-2"
                    />
                    <input
                        placeholder="MM/YY"
                        className="w-full border p-2 rounded mb-2"
                    />
                    <input
                        placeholder="CVV"
                        className="w-full border p-2 rounded mb-4"
                    />

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
                    >
                        {loading ? "Processing..." : `Pay ₹${total}`}
                    </button>
                </div>
            ) : (
                <div className="mt-6 text-center">
                    <h2 className="text-green-600 text-xl font-bold">
                        ✅ Order Placed!
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Demo payment successful.
                    </p>

                    <button
                        onClick={() => navigate("/orders")}
                        className="mt-4 bg-black text-white px-4 py-2 rounded"
                    >
                        View Orders
                    </button>
                </div>
            )}
        </div>
    );
}