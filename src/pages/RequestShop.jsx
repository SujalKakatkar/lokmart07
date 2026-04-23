import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function RequestSeller() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  const [form, setForm] = useState({
    shop_name: "",
    address: "",
    phone: "",
  });

  // fetch request
  const fetchRequest = async () => {
    const { data } = await supabase
      .from("seller_requests")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setRequest(data || null);
  };

  useEffect(() => {
    if(user) fetchRequest();
  }, [user]);

  // redirect when approved
  useEffect(() => {
    if(request?.status === "approved") {
      navigate("/shopDashboard");
    }
  }, [request]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(request) {
      console.log("the request already exists");
      
      return
    }


    const { error } = await supabase.from("seller_requests").insert({
      user_id: user.id,
      ...form,
    });
    console.log(error);
    

    if(!error) {
      fetchRequest();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Request Seller Access
        </h2>

        {/* 📝 FORM */}
        {!request && (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              placeholder="Shop Name"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, shop_name: e.target.value })
              }
              required
            />

            <input
              placeholder="Address"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              required
            />

            <input
              placeholder="Phone Number"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              required
            />

            <button className="w-full bg-black text-white py-2 rounded">
              Request for Seller
            </button>
          </form>
        )}

        {/* ⏳ PENDING */}
        {request?.status === "pending" && (
          <div>
            <p className="text-yellow-600 font-semibold text-center">
              Request Pending
            </p>

            <div className="mt-4 text-sm text-gray-600">
              <p><b>Shop:</b> {request.shop_name}</p>
              <p><b>Address:</b> {request.address}</p>
              <p><b>Phone:</b> {request.phone}</p>
            </div>
          </div>
        )}

        {/* ❌ REJECTED */}
        {request?.status === "rejected" && (
          <div className="text-center">
            <p className="text-red-600 font-semibold">
              Request Rejected
            </p>
            <p className="text-gray-500 mt-2">
              {request.rejection_reason || "Try again later"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}