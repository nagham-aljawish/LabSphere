/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Eye, Loader2, Wallet } from "lucide-react";

import {
  ApiError,
  getAdminWallet,
  getAdminWallets,
  topUpPatientWallet,
  type AdminWalletDetail,
  type AdminWalletSummary,
} from "../../services";

interface WalletsPanelProps {
  onUpdated?: () => void;
}

const WalletsPanel = ({ onUpdated }: WalletsPanelProps) => {
  const [wallets, setWallets] = useState<AdminWalletSummary[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [topUpTarget, setTopUpTarget] = useState<AdminWalletSummary | null>(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<AdminWalletDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadWallets = () => {
    setLoading(true);
    getAdminWallets(page)
      .then((response) => {
        setWallets(response.data);
        setTotal(response.total);
      })
      .catch(() => setError("Failed to load patient wallets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWallets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredWallets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return wallets;
    }

    return wallets.filter(
      (wallet) =>
        wallet.patientName.toLowerCase().includes(query) ||
        wallet.patientCode.toLowerCase().includes(query) ||
        wallet.email.toLowerCase().includes(query),
    );
  }, [search, wallets]);

  const handleTopUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!topUpTarget) {
      return;
    }

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid top-up amount.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await topUpPatientWallet(topUpTarget.patientId, {
        amount: parsedAmount,
        notes: notes.trim() || undefined,
      });

      setWallets((prev) =>
        prev.map((wallet) =>
          wallet.patientId === updated.patientId
            ? { ...wallet, balance: updated.balance }
            : wallet,
        ),
      );

      if (detail?.patientId === updated.patientId) {
        const refreshed = await getAdminWallet(updated.patientId);
        setDetail(refreshed);
      }

      setSuccess(
        `Added $${parsedAmount.toFixed(2)} to ${topUpTarget.patientName}'s wallet.`,
      );
      setTopUpTarget(null);
      setAmount("");
      setNotes("");
      onUpdated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to top up wallet.");
    } finally {
      setSaving(false);
    }
  };

  const openDetail = async (wallet: AdminWalletSummary) => {
    setDetailLoading(true);
    setError("");

    try {
      const data = await getAdminWallet(wallet.patientId);
      setDetail(data);
    } catch {
      setError("Failed to load wallet transactions.");
    } finally {
      setDetailLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 20));

  if (loading && wallets.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#052836]" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by patient name, MRN, or email..."
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 sm:max-w-md"
      />

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {success && (
        <p className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <div className="overflow-hidden rounded-3xl bg-white shadow-md">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Patient</th>
              <th className="px-4 py-3 text-left text-sm">MRN</th>
              <th className="px-4 py-3 text-left text-sm">Email</th>
              <th className="px-4 py-3 text-left text-sm">Balance</th>
              <th className="px-4 py-3 text-left text-sm">Updated</th>
              <th className="px-4 py-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWallets.map((wallet) => (
              <tr key={wallet.patientId} className="border-b">
                <td className="px-4 py-3 text-sm font-medium">{wallet.patientName}</td>
                <td className="px-4 py-3 text-sm">{wallet.patientCode}</td>
                <td className="px-4 py-3 text-sm">{wallet.email}</td>
                <td className="px-4 py-3 text-sm font-semibold text-[#052836]">
                  ${Number(wallet.balance).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{wallet.updatedAt}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openDetail(wallet)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-cyan-700 hover:bg-cyan-50"
                    >
                      <Eye size={15} />
                      History
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTopUpTarget(wallet);
                        setAmount("");
                        setNotes("");
                        setError("");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#052836] px-3 py-2 text-white hover:opacity-90"
                    >
                      <Wallet size={15} />
                      Top Up
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredWallets.length === 0 && (
          <p className="p-8 text-center text-gray-500">No patient wallets found.</p>
        )}
      </div>

      {!search && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {total} wallets
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

      {topUpTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleTopUp}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-[#052836]">Top Up Wallet</h3>
            <p className="mt-2 text-sm text-gray-500">
              {topUpTarget.patientName} · {topUpTarget.patientCode}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Current balance: ${Number(topUpTarget.balance).toFixed(2)}
            </p>

            <div className="mt-5 space-y-4">
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Amount to add"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes (optional)"
                rows={3}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Processing..." : "Confirm Top Up"}
              </button>
              <button
                type="button"
                onClick={() => setTopUpTarget(null)}
                className="rounded-xl border px-5 py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            {detailLoading || !detail ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-[#052836]" size={28} />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#052836]">Wallet History</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {detail.patientName} · {detail.patientCode}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#052836]">
                      Balance: ${Number(detail.balance).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetail(null)}
                    className="rounded-xl border px-4 py-2 text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  {detail.transactions.length === 0 ? (
                    <p className="text-sm text-gray-500">No transactions yet.</p>
                  ) : (
                    detail.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium capitalize text-[#052836]">
                            {transaction.type.replace("_", " ")}
                          </p>
                          <p className="font-semibold">${Number(transaction.amount).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {transaction.description || "No description"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>{transaction.date}</span>
                          {transaction.performedBy && (
                            <span>By {transaction.performedBy}</span>
                          )}
                          {transaction.orderNumber && (
                            <span>Order {transaction.orderNumber}</span>
                          )}
                          <span>
                            Balance after: ${Number(transaction.balanceAfter).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsPanel;
