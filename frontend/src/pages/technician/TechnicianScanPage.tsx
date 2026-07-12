import { useState } from "react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import QRScannerCard from "../../components/technician/scan/QRScannerCard";
import SampleInfoCard from "../../components/technician/scan/SampleInfoCard";
import EmptySample from "../../components/technician/scan/EmptySample";

import { technicianSampleMock } from "../../data/technicianScanData";

const TechnicianScanPage = () => {
  const [sample, setSample] = useState(false);

  const handleScan = () => {
    // فقط إظهار بيانات العينة
    setSample(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Scan Sample"
        description="Scan or manually enter the QR code to receive a sample."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <QRScannerCard onScan={handleScan} />

        {sample ? (
          <SampleInfoCard sample={technicianSampleMock} />
        ) : (
          <EmptySample />
        )}
      </div>
    </div>
  );
};

export default TechnicianScanPage;
