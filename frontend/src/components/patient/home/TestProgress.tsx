import ProgressStepper from "./ProgressStepper";
import SectionHeader from "../../shared/SectionHeader";

import { testProgressData, progressSteps } from "../../../data/homeData";

const TestProgress = () => {
  return (
    <section id="track-sample" className="scroll-mt-20 bg-[#C4E2FA] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          title={testProgressData.title}
          description={testProgressData.description}
        />

        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-10">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#052836]">
              {testProgressData.testName}
            </h3>

            <p className="mt-2 text-gray-500">
              Current Status:
              <span className="ml-2 font-semibold text-[#88D6E7]">
                {progressSteps[testProgressData.currentStep].label}
              </span>
            </p>
          </div>

          <ProgressStepper
            steps={progressSteps}
            currentStep={testProgressData.currentStep}
          />
        </div>
      </div>
    </section>
  );
};

export default TestProgress;
