interface RequestInfoCardProps {
  requestId: string;

  patientName: string;

  mrn: string;

  testsCount: number;
}

const RequestInfoCard = ({
  requestId,
  patientName,
  mrn,
  testsCount,
}: RequestInfoCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#052836]">
            Request: {requestId}
          </h2>

          <p className="text-gray-500">
            Patient: {patientName} ({mrn})
          </p>
        </div>

        <div className="rounded-xl bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-600">
          {testsCount} Tests Requested
        </div>
      </div>
    </div>
  );
};

export default RequestInfoCard;
