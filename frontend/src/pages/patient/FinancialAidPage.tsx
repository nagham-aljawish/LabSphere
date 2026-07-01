import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import FinancialAidForm from "../../components/patient/payment/FinancialAidForm";
import { useAuth } from "../../context/AuthContext";

const FinancialAidPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "patient") {
      navigate("/home");
    }
  }, [isAuthenticated, user?.role, navigate]);

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
          <h1 className="text-3xl font-bold">Request Financial Support</h1>

          <p className="mt-2 text-white/80">
            Submit a request for financial assistance for your laboratory tests.
          </p>
        </div>

        <div className="flex justify-center">
          <FinancialAidForm
            title="Request Financial Support"
            description="Submit a request for financial assistance for your laboratory tests. Your request will be reviewed by the administration."
            buttonText="Request Support"
          />
        </div>
      </div>
    </section>
  );
};

export default FinancialAidPage;
