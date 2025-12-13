// src/pages/admin/AdminUserEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function AdminUserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get(`/api/users/${id}`);
      const u = res.data;

      setForm({
        name: u?.name || "",
        email: u?.email || "",
        isAdmin: !!u?.isAdmin,
      });
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (key) => (e) => {
    const value = key === "isAdmin" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: value }));
  };

  const save = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        isAdmin: !!form.isAdmin,
      };

      await api.put(`/api/users/${id}`, payload);
      toast.success("User updated");
      navigate("/admin/users", { replace: true });
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-sm opacity-70">Loading user…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="p-3 rounded border border-red-400/40 bg-red-500/10">{err}</div>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Admin • Edit User</h1>
          <p className="mt-1 text-sm opacity-70 font-mono">ID: {id}</p>
        </div>

        <button
          onClick={() => navigate("/admin/users")}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={save}
        className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
      >
        <div>
          <label className="text-sm opacity-80">Name</label>
          <input
            value={form.name}
            onChange={onChange("name")}
            className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
          />
        </div>

        <div>
          <label className="text-sm opacity-80">Email</label>
          <input
            value={form.email}
            onChange={onChange("email")}
            className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
          />
        </div>

        <label className="flex items-center gap-3 select-none">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={onChange("isAdmin")}
            className="w-4 h-4"
          />
          <span className="text-sm font-semibold">Admin privileges</span>
        </label>

        <button
          disabled={saving}
          className="w-full px-4 py-3 rounded-lg font-semibold border border-white/10 bg-white/10 hover:bg-white/15 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save User"}
        </button>
      </form>
    </div>
  );
}
