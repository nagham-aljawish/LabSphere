interface PageHeroProps {
  image: string;
}

const PageHero = ({ image }: PageHeroProps) => {
  return (
    <section className="pt-20">
      <img
        src={image}
        alt="Page Banner"
        className="h-[450px] md:h-[650px] w-full object-cover"
      />
    </section>
  );
};

export default PageHero;
