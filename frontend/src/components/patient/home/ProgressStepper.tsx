import ProgressStep from "./ProgressStep";

interface Step {
  label: string;
  icon: React.ElementType;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

const ProgressStepper = ({ steps, currentStep }: ProgressStepperProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center px-4 py-6">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center">
            <ProgressStep
              label={step.label}
              icon={step.icon}
              isCompleted={index < currentStep}
              isCurrent={index === currentStep}
            />

            {index !== steps.length - 1 && (
              <div
                className={`
                  h-1 w-16 md:w-24 lg:w-32
                  ${index < currentStep ? "bg-[#052836]" : "bg-gray-300"}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;
