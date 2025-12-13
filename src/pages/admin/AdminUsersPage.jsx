// src/pages/admin/AdminUsersPage.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/api/users"); // admin-only
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      toast.success("User deleted");
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Admin • Users</h1>
        <button
          onClick={load}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err ? (
        <div className="mt-4 p-3 rounded border border-red-400/40 bg-red-500/10">
          {err}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-sm opacity-70">Loading…</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded border border-white/10">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Admin</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u._id} className="border-t border-white/10">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.isAdmin ? "Yes" : "No"}</td>
                  <td className="p-3">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => remove(u._id)}
                      className="px-3 py-1.5 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 opacity-70" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
