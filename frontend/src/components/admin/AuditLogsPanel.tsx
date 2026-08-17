import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, ScrollText } from "lucide-react";

import { getAdminAuditLogs, type AdminAuditLog } from "../../services";

const AuditLogsPanel = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminAuditLogs({
        page,
        action: actionFilter.trim() || undefined,
        user_role: roleFilter || undefined,
      });
      setLogs(data.data);
      
      const last =
        (data as PaginatedLike).last_page ??
        Math.max(1, Math.ceil((data.total || data.data.length) / 20));
      setTotalPages(last);
    } catch {
      setError("Failed to load audit logs.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, page, roleFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Action contains
          </label>
          <input
            value={actionFilter}
            onChange={(e) => {
              setPage(1);
              setActionFilter(e.target.value);
            }}
            placeholder="e.g. approve, send"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="technician">Technician</option>
            <option value="reception">Reception</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#052836] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-[#052836]" size={28} />
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-12 text-center text-gray-500">
          <ScrollText className="mx-auto mb-3 text-gray-300" size={32} />
          No audit entries yet. Make sure the audit queue worker is running.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-[#052836]">
              <tr>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#052836]">
                      {log.userName ?? "System / Guest"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {log.userRole ?? "—"}
                      {log.userEmail ? ` · ${log.userEmail}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-[#052836]">
                      {log.action}
                    </p>
                    <p className="mt-1 max-w-xs truncate text-xs text-gray-400">
                      {log.path}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-600">
                    {log.method ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        (log.statusCode ?? 0) >= 400
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {log.statusCode ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {log.ipAddress ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

interface PaginatedLike {
  last_page?: number;
}

export default AuditLogsPanel;
