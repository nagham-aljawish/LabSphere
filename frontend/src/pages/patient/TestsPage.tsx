/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import type { LabTest } from "../../services";
import { getTests } from "../../services";

import TestsList from "../../components/patient/tests/TestsList";

const PAGE_SIZE = 6;

const TestsPage = () => {
  const [search, setSearch] = useState("");
  const [tests, setTests] = useState<LabTest[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getTests()
      .then(setTests)
      .catch(() => setError("Failed to load tests"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase()),
  );

  const visibleTests = filteredTests.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTests.length;

  const handleLoadMore = async () => {
    setLoadingMore(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    setVisibleCount((count) => count + PAGE_SIZE);
    setLoadingMore(false);
  };

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
          <h1 className="text-3xl font-bold">Explore Laboratory Tests</h1>

          <p className="mt-2 text-white/80">
            Browse available laboratory tests, check prices, availability, and
            preparation instructions.
          </p>
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

        {loading && (
          <p className="text-center text-[#052836]">Loading tests...</p>
        )}

        {error && (
          <p className="rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && filteredTests.length === 0 && (
          <p className="rounded-xl bg-white px-4 py-6 text-center text-[#052836] shadow-md">
            No tests found matching your search.
          </p>
        )}

        {!loading && !error && filteredTests.length > 0 && (
          <>
            <TestsList tests={visibleTests} />

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#052836] bg-white px-10 py-3 font-semibold text-[#052836] transition hover:bg-[#052836] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "View More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TestsPage;
