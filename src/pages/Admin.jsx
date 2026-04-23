import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("seller_requests")
      .select(`
        *,
        profiles (name, email)
      `)
      .order("created_at", { ascending: false });

    if(!error) setRequests(data);
  };

  // approve
  const approveRequest = async (request) => {
    const userId = request.user_id;

    // ✅ 1. Check if shop already exists
    const { data: existingShop } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", userId)
      .maybeSingle();

    // ✅ 2. Create shop ONLY if not exists
    if(!existingShop) {
      const { error: shopError } = await supabase
        .from("shops")
        .insert({
          owner_id: userId,
          name: request.shop_name,
          address: request.address,
          phone: request.phone,
        });

      if(shopError) {
        console.error("Shop error:", shopError.message);
        return;
      }
    }

    // ✅ 3. Update role (ALWAYS RUN)
    const {data, error: roleError } = await supabase
      .from("profiles")
      .update({ role: "shopowner" })
      .eq("id", userId).select();
    console.log(data);
    

    if(roleError) {
      console.error("Role update error:", roleError.message);
      return;
    }

    // ✅ 4. Update request status
    const { error: requestError } = await supabase
      .from("seller_requests")
      .update({ status: "approved" })
      .eq("id", request.id);

    if(requestError) {
      console.error("Request update error:", requestError.message);
    }
    fetchRequests()
  };

  // reject
  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason");

    await supabase
      .from("seller_requests")
      .update({
        status: "rejected",
        rejection_reason: reason,
      })
      .eq("id", id);

    fetchRequests();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Seller Requests
      </h1>

      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-5 rounded-xl shadow border"
          >
            {/* User Info */}
            <div className="mb-2">
              <p className="font-semibold">
                {req.profiles?.name}
              </p>
              <p className="text-sm text-gray-500">
                {req.profiles?.email}
              </p>
            </div>

            {/* Shop Info */}
            <div className="text-sm text-gray-700 mt-2">
              <p><b>Shop:</b> {req.shop_name}</p>
              <p><b>Address:</b> {req.address}</p>
              <p><b>Phone:</b> {req.phone}</p>
            </div>

            {/* Status */}
            <div className="mt-3">
              <span className={`px-2 py-1 rounded text-sm
                ${req.status === "pending" && "bg-yellow-100 text-yellow-700"}
                ${req.status === "approved" && "bg-green-100 text-green-700"}
                ${req.status === "rejected" && "bg-red-100 text-red-700"}
              `}>
                {req.status}
              </span>
            </div>

            {/* Actions */}
            {req.status === "pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => approveRequest(req)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(req.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {/* Rejection reason */}
            {req.status === "rejected" && req.rejection_reason && (
              <p className="text-sm text-red-500 mt-2">
                Reason: {req.rejection_reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}