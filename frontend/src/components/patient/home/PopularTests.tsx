import { useEffect, useState } from "react";
import { FaFlask } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import SectionHeader from "../../shared/SectionHeader";
import PopularTestCard from "./PopularTestCard";
import { getTests } from "../../../services";

const PopularTests = () => {
  const [tests, setTests] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    getTests()
      .then((items) =>
        setTests(items.slice(0, 6).map((test) => ({ id: test.id, title: test.name }))),
      )
      .catch(() => setTests([]));
  }, []);

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
                <PopularTestCard title={test.title} icon={FaFlask} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularTests;
