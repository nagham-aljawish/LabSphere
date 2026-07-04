/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import {
  ApiError,
  createAdminTest,
  deleteAdminTest,
  getAdminTests,
  updateAdminTest,
  type AdminTestPayload,
} from "../../services";
import type { ApiTest } from "../../services/types";

const emptyForm: AdminTestPayload = {
  name: "",
  code: "",
  category: "",
  sample_type: "",
  description: "",
  price: 0,
  is_active: true,
};

interface TestsManagementPanelProps {
  onUpdated?: () => void;
}

const TestsManagementPanel = ({ onUpdated }: TestsManagementPanelProps) => {
  const [tests, setTests] = useState<ApiTest[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminTestPayload>(emptyForm);

  const loadTests = () => {
    setLoading(true);
    getAdminTests(page)
      .then((response) => {
        setTests(response.data);
        setTotal(response.total);
      })
      .catch(() => setError("Failed to load tests."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredTests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return tests;
    }

    return tests.filter(
      (test) =>
        test.name.toLowerCase().includes(query) ||
        test.code?.toLowerCase().includes(query) ||
        test.category?.toLowerCase().includes(query) ||
        test.sample_type?.toLowerCase().includes(query),
    );
  }, [search, tests]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEdit = (test: ApiTest) => {
    setForm({
      name: test.name,
      code: test.code ?? "",
      category: test.category ?? "",
      sample_type: test.sample_type ?? "",
      description: test.description ?? "",
      price: Number(test.price),
      is_active: test.is_active,
    });
    setEditingId(test.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: AdminTestPayload = {
        ...form,
        price: Number(form.price),
      };

      if (editingId) {
        const updated = await updateAdminTest(editingId, payload);
        setTests((prev) =>
          prev.map((test) => (test.id === editingId ? updated : test)),
        );
        setSuccess("Test updated successfully.");
      } else {
        const created = await createAdminTest(payload);
        setTests((prev) => [created, ...prev]);
        setTotal((count) => count + 1);
        setSuccess("Test created successfully.");
      }

      resetForm();
      onUpdated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save test.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testId: number) => {
    if (!window.confirm("Delete this test?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteAdminTest(testId);
      setTests((prev) => prev.filter((test) => test.id !== testId));
      setTotal((count) => Math.max(0, count - 1));
      setSuccess("Test deleted.");
      onUpdated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete test.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 20));

  if (loading && tests.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#052836]" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tests by name, code, or category..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 sm:max-w-md"
        />

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#052836] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          Add Test
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {success && (
        <p className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-md"
        >
          <h3 className="mb-4 text-lg font-bold text-[#052836]">
            {editingId ? "Edit Test" : "Add New Test"}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Test name"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
            <input
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value })}
              placeholder="Code (e.g. CBC)"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
            <input
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              placeholder="Category"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
            <input
              value={form.sample_type}
              onChange={(event) =>
                setForm({ ...form, sample_type: event.target.value })
              }
              placeholder="Sample type"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: Number(event.target.value) })
              }
              placeholder="Price"
              className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_active ?? true}
                onChange={(event) =>
                  setForm({ ...form, is_active: event.target.checked })
                }
              />
              Active and visible to patients
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Description"
              rows={3}
              className="md:col-span-2 rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Test" : "Create Test"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border px-5 py-2.5 text-sm font-medium text-[#052836]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-3xl bg-white shadow-md">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Name</th>
              <th className="px-4 py-3 text-left text-sm">Code</th>
              <th className="px-4 py-3 text-left text-sm">Category</th>
              <th className="px-4 py-3 text-left text-sm">Sample</th>
              <th className="px-4 py-3 text-left text-sm">Price</th>
              <th className="px-4 py-3 text-left text-sm">Status</th>
              <th className="px-4 py-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test) => (
              <tr key={test.id} className="border-b">
                <td className="px-4 py-3 text-sm font-medium">{test.name}</td>
                <td className="px-4 py-3 text-sm">{test.code || "—"}</td>
                <td className="px-4 py-3 text-sm">{test.category || "—"}</td>
                <td className="px-4 py-3 text-sm">{test.sample_type || "—"}</td>
                <td className="px-4 py-3 text-sm">${Number(test.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">
                  {test.is_active ? (
                    <span className="text-emerald-600">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(test)}
                      className="rounded-lg p-2 text-cyan-700 hover:bg-cyan-50"
                      aria-label={`Edit ${test.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(test.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label={`Delete ${test.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTests.length === 0 && (
          <p className="p-8 text-center text-gray-500">No tests found.</p>
        )}
      </div>

      {!search && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {total} tests
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestsManagementPanel;
