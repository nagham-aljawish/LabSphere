interface PageHeroProps {
  image: string;
}

const PageHero = ({ image }: PageHeroProps) => {
  return (
    <section className="relative mt-20 w-full overflow-hidden">
      <div className="relative h-[420px] w-full sm:h-[560px] md:h-[calc(100dvh-5rem)]">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    </section>
  );
};

export default PageHero;
