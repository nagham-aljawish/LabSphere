import TestCard from "./TestCard";
import type { LabTest } from "../../../data/testsData";

interface TestsListProps {
  tests: LabTest[];
}

const TestsList = ({ tests }: TestsListProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-[#4DB7E5] bg-white shadow-md">
      {tests.map((test) => (
        <TestCard
          key={test.id}
          name={test.name}
          description={test.description}
          price={test.price}
          available={test.available}
        />
      ))}
    </div>
  );
};

export default TestsList;
