import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function ShopDashboard() {
  const { user } = useAuth();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  // 🏪 Fetch shop
  const fetchShop = async () => {
    const { data } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    setShop(data);
  };

  // 📦 Fetch products
  const fetchProducts = async (shopId) => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("shop_id", shopId);

    setProducts(data || []);
  };

  useEffect(() => {
    if(user) fetchShop();
  }, [user]);

  useEffect(() => {
    if(shop) fetchProducts(shop.id);
  }, [shop]);

  // 📤 Upload image
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("product_images")
      .upload(fileName, file);

    if(error) {
      toast.error("Image upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("product_images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ✅ Validation
  const validateForm = () => {
    let newErrors = {};

    if(!form.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if(!form.price || Number(form.price) <= 0) {
      newErrors.price = "Enter a valid price";
    }

    if(!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ➕ Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if(!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);

    let imageUrl = "";

    if(form.image) {
      imageUrl = await uploadImage(form.image);
    }

    const { error } = await supabase.from("products").insert({
      shop_id: shop.id,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image_url: imageUrl,
    });

    setLoading(false);

    if(!error) {
      toast.success("Product added 🚀");

      setForm({
        name: "",
        price: "",
        description: "",
        image: null,
      });

      setErrors({});
      fetchProducts(shop.id);
    } else {
      toast.error(error.message);
    }
  };

  // 🗑 Delete product
  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm("Delete this product?");
    if(!confirmDelete) return;

    let filePath = null;

    if(product.image_url) {
      const parts = product.image_url.split("/product_images/");
      filePath = parts[1];
    }

    if(filePath) {
      const { error: storageError } = await supabase.storage
        .from("product_images")
        .remove([filePath]);

      if(storageError) {
        console.error(storageError.message);
      }
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if(error) {
      toast.error("Delete failed");
    } else {
      toast.success("Product deleted 🗑");
      fetchProducts(shop.id);
    }
  };

  if(!shop) {
    return (
      <div className="p-6 text-center text-gray-500">
        No shop found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* 🏪 Header */}
        <div className="mb-8 flex flex-col items-center justify-center h-80">
          <h1 className="text-5xl font-bold">{shop.name}</h1>
          <p className="text-gray-500 text-2xl">{shop.address}</p>
        </div>

        {/* ➕ Add Product */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Add Product</h2>

          <form onSubmit={handleAddProduct} className="grid gap-4 md:grid-cols-2">

            {/* Name */}
            <div>
              <input
                placeholder="Product Name"
                className="border p-3 rounded-xl w-full"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <input
                type="number"
                placeholder="Price"
                className="border p-3 rounded-xl w-full"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Image */}
            <input
              type="file"
              accept="image/*"
              className="border p-3 rounded-xl md:col-span-2"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] })
              }
            />

            {/* Description */}
            <div className="md:col-span-2">
              <textarea
                placeholder="Description"
                className="border p-3 rounded-xl w-full"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="bg-black text-white py-3 rounded-xl hover:opacity-90 transition md:col-span-2"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>

          </form>
        </div>

        {/* 📦 Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>

          {products.length === 0 ? (
            <p className="text-gray-500">No products yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white group relative rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:scale-110"
                  >
                    <Trash size={16} />
                  </button>

                  <div className="p-3">
                    <h3 className="font-semibold text-sm">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}