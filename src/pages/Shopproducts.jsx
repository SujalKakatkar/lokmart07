import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });
  const { user } = useAuth()


  const addToCart = async (product) => {

    if(!(user && product)) return


    const { data, error } = await supabase.from("cart").insert([
      {
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image_url,
        shop_name: product.shop_name,
        quantity: 1,
      },
    ]);

    if(!error) {
      setToast({
        show: true,
        message: "Added to cart 🛒",
      });

      // auto hide after 2s
      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 2000);
    }
  };

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if(error) {
        console.error(error);
        return;
      }

      setProducts(data);
      setFiltered(data);
    };

    fetchProducts();
  }, []);

  

  // Search handler
  const handleSearch = (value) => {
    setSearch(value);

    if(!value.trim()) {
      setFiltered(products);
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();

    const results = products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(lower) ||
        p.shop_name?.toLowerCase().includes(lower)
      );
    });

    setFiltered(results);

    // top 5 suggestions
    setSuggestions(results.slice(0, 5));
  };

  // select suggestion
  const handleSelectSuggestion = (item) => {
    setSearch(item.name);
    setFiltered([item]);
    setSuggestions([]);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-2xl mx-auto">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products or shops..."
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-white border mt-1 rounded-lg shadow-lg z-10">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectSuggestion(item)}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.shop_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <div className="h-32 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              <h3 className="font-semibold text-sm">
                {product.name}
              </h3>

              <p className="text-xs text-gray-500">
                {product.shop_name}
              </p>

              <p className="mt-1 font-bold text-blue-600">
                ₹{product.price}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 w-full bg-black text-white py-1 rounded hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 mt-10">
            No products found
          </p>
        )}
      </div>
      {toast.show && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {toast.message}
        </div>
      )}
    </div>
  );
}