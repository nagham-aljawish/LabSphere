import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import SectionHeader from "../../shared/SectionHeader";
import PopularTestCard from "./PopularTestCard";

interface Test {
  id: number;
  title: string;
  icon: React.ElementType;
}

interface PopularTestsProps {
  title: string;
  description: string;
  tests: Test[];
}

const PopularTests = ({ title, description, tests }: PopularTestsProps) => {
  return (
    <section className="bg-[#D7E4E9] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader title={title} description={description} />

        <div className="mt-12">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },

              640: {
                slidesPerView: 2,
              },

              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {tests.map((test) => (
              <SwiperSlide key={test.id}>
                <PopularTestCard title={test.title} icon={test.icon} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularTests;
