"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface ActionRecord {
  id: string;
  actionType: string;
  quantity: number;
  unit: string;
  address: string;
  createdAt: Timestamp;
}

interface ActionRecordTableProps {
  onEdit: (record: ActionRecord) => void;
}

const ACTION_LABELS: Record<string, string> = {
  solar_rooftop: "Solar Rooftop",
  swh: "Solar Water Heater",
  rwh: "Rainwater Harvesting",
  waterless_urinal: "Waterless Urinal",
  wastewater_recycling: "Wastewater Recycling",
  biogas: "Biogas (Food Waste)",
  led_replacement: "LED Replacement",
  tree_plantation: "Tree Plantation",
};

export default function ActionRecordTable({ onEdit }: ActionRecordTableProps) {
  const { user, loading: authLoading } = useAuth();
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    // If auth is still loading, wait.
    if (authLoading) return;

    // If auth finished but no user, stop loading (show empty or restricted).
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "carbon_registry_actions"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedActions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ActionRecord[];

        // Sort client-side to avoid compound index requirement
        fetchedActions.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA; // Descending order
        });

        setActions(fetchedActions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching actions:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this action?")) {
      try {
        await deleteDoc(doc(db, "carbon_registry_actions", id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete action.");
      }
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = actions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(actions.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center mt-6">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <h3 className="text-gray-500 font-semibold text-lg">No actions yet</h3>
        <p className="text-gray-400 text-sm max-w-[240px] mt-1">
          Start by adding your first environmental impact action today.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Unit
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((action) => (
                <tr
                  key={action.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-5 px-6 text-sm font-semibold text-gray-700">
                    {ACTION_LABELS[action.actionType] || action.actionType}
                  </td>
                  <td className="py-5 px-6 text-sm font-medium text-gray-600">
                    {action.quantity}
                  </td>
                  <td className="py-5 px-6 text-sm text-gray-500">
                    {action.unit}
                  </td>
                  <td className="py-5 px-6 text-sm text-gray-500 max-w-[200px] truncate">
                    {action.address}
                  </td>
                  <td className="py-5 px-6 text-sm text-gray-400 whitespace-nowrap">
                    {formatDate(action.createdAt)}
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(action)}
                        className="px-4 py-2 bg-gray-500 text-white text-xs font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(action.id)}
                        className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentItems.map((action) => (
          <div
            key={action.id}
            className="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {ACTION_LABELS[action.actionType] || action.actionType}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(action.createdAt)}
                </p>
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                {action.quantity} {action.unit}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="truncate">{action.address}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onEdit(action)}
                className="py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(action.id)}
                className="py-2.5 bg-red-50 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border border-gray-200 ${
            currentPage === 1
              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border border-gray-200 ${
            currentPage === totalPages
              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
