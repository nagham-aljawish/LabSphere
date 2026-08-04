import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

import ResultsFilter from "../../components/patient/results/ResultsFilter";
import ResultsTable from "../../components/patient/results/ResultsTable";
import { useAuth } from "../../context/AuthContext";
import type { Result } from "../../services";
import { getMyResults } from "../../services";

const ResultsPage = () => {
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const focusDownload = searchParams.get("action") === "download";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    getMyResults()
      .then(setResults)
      .catch(() => setError("Failed to load results"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const filteredResults =
    filter === "all"
      ? results
      : results.filter((result) => result.status === filter);

  return (
    <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-[#052836] transition hover:text-[#D62221]"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="mb-8 rounded-3xl bg-[#052836] px-8 py-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">
            {focusDownload ? "Download Results" : "My Test Results"}
          </h1>

          <p className="mt-2 text-white/80">
            {focusDownload
              ? "Choose a report and download it as PDF."
              : "View and manage your laboratory reports."}
          </p>
        </div>

        {focusDownload && !loading && !error && results.length > 0 && (
          <p className="mb-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
            Click the download icon on any paid report to save the PDF to your
            device.
          </p>
        )}

        {loading && (
          <p className="mb-6 text-center text-[#052836]">Loading results...</p>
        )}

        {error && (
          <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && results.length === 0 && (
          <p className="rounded-2xl bg-white px-4 py-6 text-center text-slate-600 shadow">
            No approved results yet. Once your doctor accepts a report, it will
            appear here for viewing and PDF download.
          </p>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <ResultsFilter activeFilter={filter} onChange={setFilter} />
            <ResultsTable
              results={filteredResults}
              highlightDownload={focusDownload}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default ResultsPage;
