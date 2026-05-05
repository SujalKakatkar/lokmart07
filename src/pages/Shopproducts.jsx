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

    if (!(user && product)) return


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

    if (!error) {
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

      if (error) {
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

    if (!value.trim()) {
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight mb-2">Explore Local Shops</h1>
        <p className="text-textSecondary">Find the best products from your neighborhood.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-3xl mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products or shops..."
          className="w-full pl-12 pr-4 py-4 bg-bgSoft border-2 border-transparent focus:border-primary rounded-xl focus:outline-none transition-all duration-200 text-textPrimary font-medium placeholder:text-textMuted shadow-sm"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-card border border-bgSoft mt-2 rounded-xl shadow-lg z-20 overflow-hidden">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectSuggestion(item)}
                className="p-4 hover:bg-bgSoft cursor-pointer border-b border-bgSoft last:border-0 transition-all duration-200"
              >
                <p className="font-medium text-textPrimary">{item.name}</p>
                <p className="text-sm text-textSecondary">
                  {item.shop_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 group flex flex-col"
            >
              <div className="h-40 bg-bgSoft rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-textMuted font-medium">No Image</span>
                )}
                <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm text-primary text-xs font-bold px-2 py-1 rounded-lg">
                  {product.shop_name}
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <h3 className="font-bold text-lg text-textPrimary line-clamp-1 mb-1">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <p className="text-xs text-textSecondary font-medium">
                    Local App
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <p className="font-extrabold text-textPrimary text-xl">
                    ₹{product.price}
                  </p>
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-primary text-white font-medium py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-bgSoft rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-textPrimary">No shops found nearby</h3>
            <p className="text-textSecondary mt-2">We couldn't find any products perfectly matching your search.</p>
          </div>
        )}
      </div>
      {toast.show && (
        <div className="fixed bottom-5 right-5 bg-card text-textPrimary px-6 py-3 rounded-xl shadow-lg border border-bgSoft animate-fade-in flex items-center gap-3 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          {toast.message}
        </div>
      )}
    </div>
  );
}