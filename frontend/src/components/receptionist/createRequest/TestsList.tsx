import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { LabTest } from "../../../services";

interface TestsListProps {
  tests: LabTest[];
  onAdd: (test: LabTest) => void;
}

const INITIAL_VISIBLE = 4;

const TestsList = ({ tests, onAdd }: TestsListProps) => {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredTests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return tests;
    }

    return tests.filter(
      (test) =>
        test.name.toLowerCase().includes(query) ||
        test.category?.toLowerCase().includes(query) ||
        test.sampleType?.toLowerCase().includes(query) ||
        test.description?.toLowerCase().includes(query),
    );
  }, [search, tests]);

  const isSearching = search.trim().length > 0;
  const visibleTests =
    isSearching || showAll
      ? filteredTests
      : filteredTests.slice(0, INITIAL_VISIBLE);

  const hasMore = !isSearching && filteredTests.length > INITIAL_VISIBLE;

  return (
    <div>
      <div className="relative mb-6">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setShowAll(false);
          }}
          placeholder="Search tests by name, category, or sample type..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-[#052836] shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      {filteredTests.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-md">
          No tests found for &quot;{search}&quot;
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {visibleTests.map((test) => (
              <div
                key={test.id}
                className="rounded-3xl bg-white p-5 shadow-md transition hover:shadow-lg"
              >
                <h3 className="font-semibold text-[#052836]">{test.name}</h3>

                {test.category && (
                  <p className="mt-2 text-sm text-gray-500">{test.category}</p>
                )}

                <div className="mt-4 space-y-2 text-sm">
                  {test.sampleType && (
                    <p>
                      <span className="font-medium">Sample:</span>{" "}
                      {test.sampleType}
                    </p>
                  )}

                  <p className="text-gray-600">{test.description}</p>

                  <p className="font-semibold text-cyan-600">${test.price}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onAdd(test)}
                  className="mt-5 w-full rounded-xl bg-cyan-500 py-3 font-medium text-white transition hover:bg-cyan-600"
                >
                  Add Test
                </button>
              </div>
            ))}
          </div>

          {hasMore && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-6 w-full rounded-2xl border border-[#052836]/20 bg-white py-3 text-sm font-medium text-[#052836] shadow-sm transition hover:bg-gray-50"
            >
              View All ({filteredTests.length} tests)
            </button>
          )}

          {!isSearching && showAll && filteredTests.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="mt-6 w-full rounded-2xl border border-[#052836]/20 bg-white py-3 text-sm font-medium text-[#052836] shadow-sm transition hover:bg-gray-50"
            >
              Show Less
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TestsList;
