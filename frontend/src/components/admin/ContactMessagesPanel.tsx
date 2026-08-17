/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";

import {
  ApiError,
  getContactMessages,
  markContactMessageRead,
  type ContactMessage,
} from "../../services";

const statuses = ["new", "read", "all"];

interface ContactMessagesPanelProps {
  compact?: boolean;
  defaultFilter?: string;
  onUpdated?: () => void;
}

const ContactMessagesPanel = ({
  compact = false,
  defaultFilter = "new",
  onUpdated,
}: ContactMessagesPanelProps) => {
  const [filter, setFilter] = useState(defaultFilter);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getContactMessages(filter === "all" ? undefined : filter)
      .then(setMessages)
      .catch(() => setError("Failed to load contact messages."))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleMarkRead = async (messageId: number) => {
    setProcessingId(messageId);
    setError("");

    try {
      await markContactMessageRead(messageId);

      if (filter === "new" || compact) {
        setMessages((prev) => prev.filter((item) => item.id !== messageId));
      } else {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === messageId ? { ...item, status: "read" } : item,
          ),
        );
      }

      onUpdated?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to mark message as read.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const visibleMessages = compact ? messages.slice(0, 3) : messages;

  return (
    <div>
      {!compact && (
        <div className="mb-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${
                filter === status
                  ? "bg-cyan-500 text-white"
                  : "bg-white text-[#052836] shadow-sm"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[#052836]" size={28} />
        </div>
      ) : visibleMessages.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-8 text-center text-gray-500">
          No contact messages found.
        </p>
      ) : (
        <div className="space-y-3">
          {visibleMessages.map((message) => {
            const isNew = message.status === "new";

            return (
              <div
                key={message.id}
                className={`rounded-2xl border p-4 shadow-sm ${
                  isNew
                    ? "border-cyan-200 bg-cyan-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-[#052836]" />
                      <h3 className="font-semibold text-[#052836]">
                        {message.subject || "General Inquiry"}
                      </h3>
                      {isNew && (
                        <span className="rounded-full bg-[#D62221] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {message.name}
                      {message.email ? ` · ${message.email}` : ""}
                      {message.phone ? ` · ${message.phone}` : ""}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#052836]">
                      {message.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>

                  {isNew && (
                    <button
                      type="button"
                      disabled={processingId === message.id}
                      onClick={() => handleMarkRead(message.id)}
                      className="rounded-xl bg-[#052836] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      {processingId === message.id ? "Saving..." : "Mark as read"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPanel;
