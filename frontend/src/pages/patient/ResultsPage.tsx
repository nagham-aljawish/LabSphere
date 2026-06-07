import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ResultsFilter from "../../components/patient/results/ResultsFilter";
import ResultsTable from "../../components/patient/results/ResultsTable";

import { resultsData } from "../../data/resultsData";

const ResultsPage = () => {
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  const filteredResults =
    filter === "all"
      ? resultsData
      : resultsData.filter((result) => result.status === filter);

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
          <h1 className="text-3xl font-bold">My Test Results</h1>

          <p className="mt-2 text-white/80">
            View and manage your laboratory reports.
          </p>
        </div>

        <ResultsFilter activeFilter={filter} onChange={setFilter} />

        <ResultsTable results={filteredResults} />
      </div>
    </section>
  );
};

export default ResultsPage;
