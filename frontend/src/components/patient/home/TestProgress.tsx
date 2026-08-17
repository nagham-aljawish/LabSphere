import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClipboardList,
  FaFlask,
  FaMicroscope,
  FaTruck,
  FaVial,
  FaUserMd,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";

import SectionHeader from "../../shared/SectionHeader";
import { useAuth } from "../../../context/AuthContext";
import { getPatientTracking, type PatientTrackingOrder } from "../../../services";
import { formatDateTime, parseApiDate } from "../../../utils/datetime";
import ProgressStepper from "./ProgressStepper";

const progressSteps = [
  { label: "Prepared", icon: FaClipboardList },
  { label: "Collected", icon: FaVial },
  { label: "Received in Lab", icon: FaTruck },
  { label: "Laboratory Analysis", icon: FaMicroscope },
  { label: "Result Entry", icon: FaFlask },
  { label: "Doctor Review", icon: FaUserMd },
  { label: "Completed", icon: FaCheckCircle },
];

function formatStepLabel(order: PatientTrackingOrder): string {
  if (order.currentStepLabel) {
    return order.currentStepLabel;
  }

  const step = Math.min(
    Math.max(order.currentStep, 0),
    progressSteps.length - 1,
  );
  return progressSteps[step]?.label ?? "Prepared";
}

function normalizeTestNames(tests: PatientTrackingOrder["tests"]): string[] {
  if (!Array.isArray(tests)) return [];
  return tests
    .map((t) => (typeof t === "string" ? t : String(t ?? "")).trim())
    .filter(Boolean);
}

function isOrderComplete(order: PatientTrackingOrder): boolean {
  return order.currentStep >= 6 || order.orderStatus === "completed";
}

/** Newest samples/orders first; keep same-order samples together. */
function sortOrders(orders: PatientTrackingOrder[]): PatientTrackingOrder[] {
  return [...orders].sort((a, b) => {
    const aTime = a.createdAt ? parseApiDate(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? parseApiDate(b.createdAt).getTime() : 0;
    if (bTime !== aTime) return bTime - aTime;

    if ((b.orderId ?? 0) !== (a.orderId ?? 0)) {
      return (b.orderId ?? 0) - (a.orderId ?? 0);
    }

    return (a.orderSampleId ?? 0) - (b.orderSampleId ?? 0);
  });
}

const INITIAL_VISIBLE = 1;

const OrderTrackingCard = ({ order }: { order: PatientTrackingOrder }) => {
  const testNames = normalizeTestNames(order.tests);
  const completed = isOrderComplete(order);
  const step = Math.min(Math.max(order.currentStep, 0), progressSteps.length - 1);
  const primaryTest = testNames[0] ?? "Lab test";

  return (
    <article
      className={`space-y-4 rounded-2xl border p-4 md:p-5 ${
        completed
          ? "border-slate-200 bg-slate-50"
          : "border-sky-100 bg-[#F4F8FB]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 text-sm text-[#052836]">
          <p>
            <strong>Order:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Test:</strong> {primaryTest}
          </p>
          <p>
            <strong>Current stage:</strong> {formatStepLabel(order)}
          </p>
          {order.sampleId && (
            <p className="text-xs text-slate-500">Sample: {order.sampleId}</p>
          )}
          {order.createdAt && (
            <p className="text-xs text-slate-500">
              Created: {formatDateTime(order.createdAt)}
            </p>
          )}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            completed
              ? "bg-emerald-100 text-emerald-800"
              : "bg-sky-100 text-sky-800"
          }`}
        >
          {completed ? "Completed" : "In progress"}
        </span>
      </div>

      {testNames.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-[#052836]">
            Tests ({testNames.length}):
          </p>
          <ul className="flex flex-wrap gap-2">
            {testNames.map((testName, index) => (
              <li
                key={`${order.orderId}-${testName}-${index}`}
                className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#052836] shadow-sm ring-1 ring-sky-100"
              >
                {testName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ProgressStepper steps={progressSteps} currentStep={step} />
    </article>
  );
};

const TestProgress = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [orders, setOrders] = useState<PatientTrackingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [error, setError] = useState("");

  const isPatient = useMemo(() => user?.role === "patient", [user?.role]);

  const refreshTracking = useCallback(async () => {
    try {
      const data = await getPatientTracking();
      const list =
        Array.isArray(data.orders) && data.orders.length > 0
          ? data.orders
          : data.currentOrder
            ? [data.currentOrder]
            : [];
      setOrders(sortOrders(list));
      setError("");
    } catch {
      setOrders([]);
      setError("Unable to load tracking details right now.");
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !isPatient) {
      setOrders([]);
      setError("");
      setVisibleCount(INITIAL_VISIBLE);
      return;
    }

    setLoading(true);
    refreshTracking().finally(() => setLoading(false));

    const interval = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      refreshTracking();
    }, 45000);

    const onFocus = () => {
      refreshTracking();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [authLoading, isAuthenticated, isPatient, refreshTracking]);

  useEffect(() => {
    // Keep the expanded window when new orders arrive, but never below initial.
    setVisibleCount((count) => {
      if (orders.length === 0) return INITIAL_VISIBLE;
      return Math.min(Math.max(count, INITIAL_VISIBLE), orders.length);
    });
  }, [orders.length]);

  const visibleOrders = orders.slice(0, visibleCount);
  const hasMore = visibleCount < orders.length;
  const activeCount = orders.filter((o) => !isOrderComplete(o)).length;
  const uniqueOrderCount = new Set(orders.map((o) => o.orderId)).size;

  const handleViewMore = async () => {
    setLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setVisibleCount((count) => Math.min(count + INITIAL_VISIBLE, orders.length));
    setLoadingMore(false);
  };

  return (
    <section id="track-sample" className="scroll-mt-20 bg-[#C4E2FA] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          title="Track Your Test Progress"
          description="Follow every laboratory test step by step — each analysis has its own tracking."
        />

        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-10">
          {loading ? (
            <p className="text-center text-gray-500">
              Loading your test progress...
            </p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500">
              No tests to track right now. Create a lab request at the
              reception desk to follow your samples here.
            </p>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <strong className="text-[#052836]">{visibleOrders.length}</strong>
                {orders.length > 1 ? (
                  <>
                    {" "}
                    of <strong className="text-[#052836]">{orders.length}</strong>
                  </>
                ) : null}{" "}
                test{orders.length === 1 ? "" : "s"}
                {uniqueOrderCount > 0
                  ? ` · ${uniqueOrderCount} order${uniqueOrderCount === 1 ? "" : "s"}`
                  : ""}
                {activeCount > 0
                  ? ` · ${activeCount} in progress`
                  : " · all completed"}
                {orders.length > 1 ? " · newest first" : ""}
              </p>

              <div className="space-y-5">
                {visibleOrders.map((order) => (
                  <OrderTrackingCard
                    key={`${order.orderId}-${order.orderSampleId ?? order.sampleId ?? "order"}`}
                    order={order}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleViewMore}
                    disabled={loadingMore}
                    className="flex min-w-[160px] items-center justify-center gap-2 rounded-full border-2 border-[#052836] bg-white px-10 py-3 font-semibold text-[#052836] transition hover:bg-[#052836] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      `View More (${orders.length - visibleCount})`
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestProgress;
