interface StaffRequestCardProps {
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
  processing?: boolean;
  onApprove: () => void;
  onReject: () => void;
}

const StaffRequestCard = ({
  name,
  email,
  phone,
  role,
  createdAt,
  processing = false,
  onApprove,
  onReject,
}: StaffRequestCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#052836]">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{email}</p>
          {phone && <p className="text-sm text-gray-500">{phone}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
              {role}
            </span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              Pending Approval
            </span>
            {createdAt && (
              <span className="text-xs text-gray-400">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={processing}
            onClick={onReject}
            className="rounded-xl border border-red-200 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            Reject
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={onApprove}
            className="rounded-xl bg-[#052836] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {processing ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffRequestCard;
