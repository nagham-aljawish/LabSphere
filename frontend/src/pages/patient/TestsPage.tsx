import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { labTests, testsPageData } from "../../data/testsData";

import TestsList from "../../components/patient/tests/TestsList";

const TestsPage = () => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredTests = labTests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase()),
  );

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
          <h1 className="text-3xl font-bold">{testsPageData.title}</h1>

          <p className="mt-2 text-white/80">{testsPageData.description}</p>
        </div>

        <div className="mb-8 flex gap-4">
          <input
            type="text"
            placeholder="Search for a test"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-full border border-[#88D6E7] px-5 py-3 outline-none"
          />

          <button className="rounded-full bg-[#052836] px-8 py-3 font-medium text-white transition hover:bg-[#041f2a]">
            Search
          </button>
        </div>

        <TestsList tests={filteredTests} />
      </div>
    </section>
  );
};

export default TestsPage;
