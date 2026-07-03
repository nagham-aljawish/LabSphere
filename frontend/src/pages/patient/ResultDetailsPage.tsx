/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import ResultDetailsTable from "../../components/patient/results/ResultDetailsTable";
import ResultPreparationSection from "../../components/patient/results/ResultPreparationSection";
import { useAuth } from "../../context/AuthContext";
import type { ResultDetails } from "../../services";
import { getResultDetails } from "../../services";

const ResultDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [result, setResult] = useState<ResultDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!id) {
      setError("Invalid result");
      setLoading(false);
      return;
    }

    getResultDetails(Number(id))
      .then(setResult)
      .catch(() => setError("Result not found"))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated, navigate]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
        <div className="mx-auto max-w-6xl px-6 text-center text-[#052836]">
          Loading result...
        </div>
      </section>
    );
  }

  if (error || !result) {
    return (
      <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
        <div className="mx-auto max-w-6xl px-6 text-center text-red-700">
          {error || "Result Not Found"}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#052836] transition hover:text-[#D62221]"
        >
          <FaArrowLeft />

          <span>Back</span>
        </button>

        <div className="mb-8 rounded-3xl bg-[#052836] p-8 text-white">
          <h1 className="text-3xl font-bold">{result.reportName}</h1>

          <p className="mt-2 text-white/80">FHIR-Based Laboratory Result</p>
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
          <div className="grid gap-4 md:grid-cols-2">
            <p>
              <strong>Patient:</strong> {result.patientName}
            </p>

            <p>
              <strong>Patient ID:</strong> {result.patientId}
            </p>

            <p>
              <strong>Order Number:</strong> {result.orderNumber}
            </p>

            <p>
              <strong>Date:</strong> {result.date}
            </p>
          </div>
        </div>

        <ResultPreparationSection tests={result.tests} />

        <ResultDetailsTable tests={result.tests} />
      </div>
    </section>
  );
};

export default ResultDetailsPage;
