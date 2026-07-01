import SectionHeader from "../../shared/SectionHeader";

const TestProgress = () => {
  return (
    <section id="track-sample" className="scroll-mt-20 bg-[#C4E2FA] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          title="Track Your Test Progress"
          description="Follow your laboratory test status step by step."
        />

        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-10">
          <p className="text-center text-gray-500">
            No active tests to track right now. Create a lab request at the
            reception desk to follow your sample here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestProgress;
