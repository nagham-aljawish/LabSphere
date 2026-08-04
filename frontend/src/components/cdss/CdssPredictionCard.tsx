import { Brain, ClipboardList, Gauge, ShieldAlert, ShieldCheck } from "lucide-react";

import type { CdssPrediction } from "../../services/types";

const DISEASE_LABELS: Record<string, string> = {
  diabetes: "Diabetes",
  anemia: "Anemia",
  thalassemia: "Thalassemia",
  liver: "Liver Disease",
};

interface Props {
  cdss: CdssPrediction;
  compact?: boolean;
}

const CdssPredictionCard = ({ cdss, compact = false }: Props) => {
  const positive = cdss.outcome === "positive";
  const diseaseLabel = DISEASE_LABELS[cdss.disease] ?? cdss.disease;
  const confidence =
    cdss.confidence !== null && cdss.confidence !== undefined
      ? Math.max(0, Math.min(100, cdss.confidence))
      : null;

  return (
    <div
      className={`rounded-3xl border shadow-md ${
        positive
          ? "border-amber-200 bg-amber-50"
          : "border-emerald-200 bg-emerald-50"
      } ${compact ? "p-5" : "p-6"}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-violet-100 p-2 text-violet-700">
            <Brain size={18} />
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#052836]">
              CDSS Decision Support
            </h3>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {diseaseLabel} Model
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${
            positive
              ? "bg-amber-500 text-white"
              : "bg-emerald-500 text-white"
          }`}
        >
          {positive ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
          {positive ? "Positive" : "Negative"}
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Prediction
          </p>
          <p className="mt-1 text-base font-bold text-[#052836]">
            {cdss.prediction ?? "—"}
          </p>
        </div>

        {confidence !== null && (
          <div className="rounded-2xl bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Gauge size={14} /> Confidence
              </span>
              <span className="text-sm font-bold text-[#052836]">
                {confidence.toFixed(2)}%
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${
                  positive ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white/70 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <ClipboardList size={14} /> Recommendation
          </p>
          <p className="mt-1 text-sm text-[#052836]">
            {cdss.recommendation ?? "—"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs italic text-gray-500">
        This is an AI-generated clinical decision support suggestion and must be
        confirmed by the reviewing physician.
      </p>
    </div>
  );
};

export default CdssPredictionCard;
