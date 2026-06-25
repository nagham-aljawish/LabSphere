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
    <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-bold text-[#052836] sm:text-xl">
            Request: {requestId}
          </h2>

          <p className="break-words text-sm text-gray-500 sm:text-base">
            Patient: {patientName} ({mrn})
          </p>
        </div>

        <div className="w-fit rounded-xl bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-600">
          {testsCount} Tests Requested
        </div>
      </div>
    </div>
  );
};

export default RequestInfoCard;
