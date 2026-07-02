interface InvoiceCardProps {
  requestId: string;

  patientName: string;

  mrn: string;

  phone: string;

  tests: {
    id: number;
    name: string;
    price: number;
  }[];

  discount: number;
  discountPercentage?: number;
}

const InvoiceCard = ({
  requestId,
  patientName,
  mrn,
  phone,
  tests,
  discount,
  discountPercentage = 0,
}: InvoiceCardProps) => {
  const subtotal = tests.reduce((sum, test) => sum + test.price, 0);

  const total = subtotal - discount;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold text-[#052836]">Invoice Details</h2>

      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <span className="text-gray-500">Request ID</span>

        <span className="font-semibold text-[#052836]">{requestId}</span>
      </div>

      <div className="mb-6 rounded-2xl bg-cyan-50 p-4">
        <p className="font-semibold">{patientName}</p>

        <p className="text-sm text-gray-600">{mrn}</p>

        <p className="text-sm text-gray-600">{phone}</p>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <div key={test.id} className="flex justify-between">
            <span>{test.name}</span>

            <span>${test.price}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>${subtotal}</span>
        </div>

        <div className="mt-2 flex justify-between text-green-600">
          <span>
            Support Discount
            {discountPercentage > 0 ? ` (${discountPercentage}%)` : ""}
          </span>

          <span>-${discount.toFixed(2)}</span>
        </div>

        <div className="mt-4 flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
