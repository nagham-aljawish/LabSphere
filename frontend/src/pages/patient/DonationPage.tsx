import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import DonationForm from "../../components/patient/payment/DonationForm";
import { useAuth } from "../../context/AuthContext";

const DonationPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "patient") {
      navigate("/home");
    }
  }, [isAuthenticated, user?.role, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-[#052836] transition hover:text-[#D62221]"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="mb-8 rounded-3xl bg-[#052836] px-8 py-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Make a Donation</h1>

          <p className="mt-2 text-white/80">
            Support patients and contribute to healthcare services.
          </p>
        </div>

        <div className="flex justify-center">
          <DonationForm
            title="Make a Donation"
            description="Help patients receive essential laboratory tests by contributing to their medical expenses."
            amounts={[5, 10, 15, 20]}
            buttonText="Donate Now"
            footer="Your donation helps patients access necessary laboratory tests."
          />
        </div>
      </div>
    </section>
  );
};

export default DonationPage;
