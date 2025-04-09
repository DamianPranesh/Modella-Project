// PendingRequestsPage.tsx
import React, { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { useUser } from "../components-login/UserContext";
import toast, { Toaster } from "react-hot-toast";
import { Check, X } from "lucide-react";

interface PendingRequest {
  user_id: string;
  name: string;
  profile_pic: string | null;
  description: string;
  requested_at: string;
}

const PendingRequestsPage: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { userId } = useUser();
  const user__Id = userId || "";

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetchData(`matches/pending/${user__Id}`, {
        method: "GET",
      });
      setPendingRequests(response.pending_requests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      toast.error("Failed to load pending requests.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [user__Id]);

  const handleResponse = async (businessId: string, accept: boolean) => {
    try {
        const response = await fetchData(`matches/respond?model_id=${user__Id}&business_id=${businessId}&accept=${accept}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        });
    
        console.log("Response to match request:", response);
      
      if (accept) {
        toast.success("Match confirmed! You can now communicate with this business.", {
          duration: 3000,
        });
      } else {
        toast.error("Request declined.", {
          duration: 2000,
        });
      }

      // Remove from pending requests list
      setPendingRequests(pendingRequests.filter(req => req.user_id !== businessId));
    } catch (error) {
      console.error("Error responding to match request:", error);
      toast.error("Failed to respond to request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD8560] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Pending Match Requests</h1>
      
      {pendingRequests.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-gray-600">No pending requests at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingRequests.map((request) => (
            <div key={request.user_id} className="overflow-hidden rounded-lg bg-white shadow-md">
              <div className="relative h-48">
                <img
                  src={request.profile_pic || "/default-business.jpg"}
                  alt={request.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{request.name}</h3>
                <p className="mt-2 text-gray-600 line-clamp-3">{request.description}</p>
                <p className="mt-4 text-sm text-gray-500">
                  Requested: {new Date(request.requested_at).toLocaleDateString()}
                </p>
                <div className="mt-6 flex justify-between gap-4">
                  <button
                    onClick={() => handleResponse(request.user_id, false)}
                    className="flex w-1/2 items-center justify-center rounded-full bg-red-100 py-2 text-red-600 transition hover:bg-red-200"
                  >
                    <X size={18} className="mr-1" />
                    Decline
                  </button>
                  <button
                    onClick={() => handleResponse(request.user_id, true)}
                    className="flex w-1/2 items-center justify-center rounded-full bg-green-100 py-2 text-green-600 transition hover:bg-green-200"
                  >
                    <Check size={18} className="mr-1" />
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Toaster position="bottom-center" />
    </div>
  );
};

export default PendingRequestsPage;