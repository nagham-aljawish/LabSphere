import { useEffect, useState } from "react";
import { FaFlask } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import SectionHeader from "../../shared/SectionHeader";
import PopularTestCard from "./PopularTestCard";
import { getTests } from "../../../services";

const PopularTests = () => {
  const [tests, setTests] = useState<
    { id: number; title: string; preparationInstructions: string }[]
  >([]);
  const [selectedTest, setSelectedTest] = useState<{
    title: string;
    preparationInstructions: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTests()
      .then((items) =>
        setTests(
          items.slice(0, 6).map((test) => ({
            id: test.id,
            title: test.name,
            preparationInstructions: test.preparationInstructions,
          })),
        ),
      )
      .catch(() => setTests([]));
  }, []);

  useEffect(() => {
    if (!selectedTest) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTest(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedTest]);

  if (tests.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#D7E4E9] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Our Popular Tests"
          description="Comprehensive Lab Testing for Your Health."
        />

        <div className="mt-12">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {tests.map((test) => (
              <SwiperSlide key={test.id}>
                <PopularTestCard
                  title={test.title}
                  icon={FaFlask}
                  onLearnMore={() => setSelectedTest(test)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {selectedTest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setSelectedTest(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-[#052836]">{selectedTest.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              {selectedTest.preparationInstructions}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="rounded-xl border border-[#052836] px-4 py-2 font-medium text-[#052836] transition hover:bg-[#052836] hover:text-white"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(`/home/tests?search=${encodeURIComponent(selectedTest.title)}`)
                }
                className="rounded-xl bg-[#052836] px-4 py-2 font-medium text-white transition hover:bg-[#0A3B4F]"
              >
                Open Test Page
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PopularTests;
