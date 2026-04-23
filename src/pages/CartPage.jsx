import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router";

export default function CartPage() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const fetchCart = async () => {
        const { data, error } = await supabase
            .from("cart")
            .select("*")
            .eq("user_id", user.id);

        if(!error) {
            setCartItems(data);

            const sum = data.reduce((acc, item) => {
                return acc + item.product_price * (item.quantity || 1);
            }, 0);

            setTotal(sum);
        }
    };

    useEffect(() => {
        if(!user) return;
        fetchCart();
    }, [user]);

    // ❌ Remove
    const removeFromCart = async (itemId) => {
        await supabase.from("cart").delete().eq("id", itemId);
        fetchCart();
    };

    // ➕ Increase Quantity
    const increaseQty = async (item) => {
        await supabase
            .from("cart")
            .update({ quantity: (item.quantity || 1) + 1 })
            .eq("id", item.id);

        fetchCart();
    };

    // ➖ Decrease Quantity
    const decreaseQty = async (item) => {
        if((item.quantity || 1) <= 1) return;

        await supabase
            .from("cart")
            .update({ quantity: item.quantity - 1 })
            .eq("id", item.id);

        fetchCart();
    };

    return (
        <div className="p-4 max-w-5xl mx-auto pb-24">
            <h1 className="text-xl font-bold mb-4">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
            ) : (
                <>
                    {/* ITEMS */}
                    <div className="space-y-3">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center border p-3 rounded-lg"
                            >
                                <div className="flex flex-1 items-center gap-3">
                                    <img
                                        src={item.product_image}
                                        className="w-14 h-14 object-cover rounded"
                                    />

                                    <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.shop_name}
                                        </p>

                                        {/* QUANTITY CONTROLS */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => decreaseQty(item)}
                                                className="px-2 border rounded"
                                            >
                                                -
                                            </button>

                                            <span>{item.quantity || 1}</span>

                                            <button
                                                onClick={() => increaseQty(item)}
                                                className="px-2 border rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="font-bold px-4">
                                    ₹{item.product_price * (item.quantity || 1)}
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* BOTTOM BAR */}
                    <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center shadow-md">
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xl font-bold text-green-600">
                                ₹{total}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                        >
                            Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}