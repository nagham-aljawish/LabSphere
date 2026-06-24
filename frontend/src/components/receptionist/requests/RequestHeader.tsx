import {  Plus } from "lucide-react";

const RequestHeader = () => {
  return (
    <section className="mb-8 rounded-3xl bg-gradient-to-r from-[#052836] to-[#0A4258] p-8 text-white shadow-lg">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-3xl font-bold text-white">
              Requests Management
            </h1>

            <p className="text-[#D7E4E9]">
              Track and manage all laboratory test requests
            </p>
          </div>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-medium transition hover:scale-105"
        >
          <Plus size={18} />
          New Request
        </button>
      </div>
    </section>
  );
};

export default RequestHeader;
