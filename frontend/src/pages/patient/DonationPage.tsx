import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import DonationForm from "../../components/patient/payment/DonationForm";

import { donationPageData } from "../../data/paymentData";

const DonationPage = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-[#052836] transition hover:text-[#D62221]"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="mb-8 rounded-3xl bg-[#052836] px-8 py-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">{donationPageData.title}</h1>

          <p className="mt-2 text-white/80">{donationPageData.description}</p>
        </div>

        <div className="flex justify-center">
          <DonationForm {...donationPageData.form} />
        </div>
      </div>
    </section>
  );
};

export default DonationPage;
