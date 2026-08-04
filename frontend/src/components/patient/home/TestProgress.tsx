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

import SectionHeader from "../../shared/SectionHeader";
import { useAuth } from "../../../context/AuthContext";
import { getPatientTracking, type PatientTrackingOrder } from "../../../services";
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

/** Active orders first (newest), then completed (newest). */
function sortOrders(orders: PatientTrackingOrder[]): PatientTrackingOrder[] {
  return [...orders].sort((a, b) => {
    const aDone = isOrderComplete(a) ? 1 : 0;
    const bDone = isOrderComplete(b) ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;

    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });
}

const OrderTrackingCard = ({ order }: { order: PatientTrackingOrder }) => {
  const testNames = normalizeTestNames(order.tests);
  const completed = isOrderComplete(order);
  const step = Math.min(Math.max(order.currentStep, 0), progressSteps.length - 1);

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
            <strong>Current stage:</strong> {formatStepLabel(order)}
          </p>
          {order.createdAt && (
            <p className="text-xs text-slate-500">
              Created: {new Date(order.createdAt).toLocaleString()}
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

      <div>
        <p className="mb-2 text-sm font-semibold text-[#052836]">
          Tests{testNames.length > 1 ? ` (${testNames.length})` : ""}:
        </p>
        {testNames.length > 0 ? (
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
        ) : (
          <p className="text-sm text-slate-500">—</p>
        )}
      </div>

      <ProgressStepper steps={progressSteps} currentStep={step} />
    </article>
  );
};

const TestProgress = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [orders, setOrders] = useState<PatientTrackingOrder[]>([]);
  const [loading, setLoading] = useState(false);
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
      return;
    }

    setLoading(true);
    refreshTracking().finally(() => setLoading(false));

    const interval = window.setInterval(() => {
      refreshTracking();
    }, 10000);

    const onFocus = () => {
      refreshTracking();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [authLoading, isAuthenticated, isPatient, refreshTracking]);

  const activeCount = orders.filter((o) => !isOrderComplete(o)).length;
  const totalTests = orders.reduce(
    (sum, order) => sum + normalizeTestNames(order.tests).length,
    0,
  );

  return (
    <section id="track-sample" className="scroll-mt-20 bg-[#C4E2FA] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          title="Track Your Test Progress"
          description="Follow every laboratory order and all of your tests step by step."
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
                <strong className="text-[#052836]">{orders.length}</strong>{" "}
                order{orders.length === 1 ? "" : "s"} ·{" "}
                <strong className="text-[#052836]">{totalTests}</strong> test
                {totalTests === 1 ? "" : "s"}
                {activeCount > 0
                  ? ` · ${activeCount} in progress`
                  : " · all completed"}
              </p>

              <div className="space-y-5">
                {orders.map((order) => (
                  <OrderTrackingCard
                    key={order.orderId ?? order.orderNumber}
                    order={order}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestProgress;
