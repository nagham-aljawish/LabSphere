/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import PatientInfoCard from "../../components/receptionist/patientProfile/PatientInfoCard";
import PatientProfileTabs from "../../components/receptionist/patientProfile/PatientProfileTabs";
import {
  getPatientPayments,
  getReceptionOrders,
  getReceptionPatient,
  type ReceptionPaymentRecord,
  type ReceptionPatient,
  type ReceptionRequest,
} from "../../services";

const PatientProfilePage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<ReceptionPatient | null>(null);
  const [orders, setOrders] = useState<ReceptionRequest[]>([]);
  const [payments, setPayments] = useState<ReceptionPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(patientId);

    if (!id) {
      setLoading(false);
      return;
    }

    Promise.all([
      getReceptionPatient(id),
      getReceptionOrders(undefined, id),
      getPatientPayments(id),
    ])
      .then(([patientData, patientOrders, patientPayments]) => {
        setPatient(patientData);
        setOrders(patientOrders);
        setPayments(patientPayments);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-10 text-center text-red-500">Patient not found</div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Patient Profile"
        description="View patient information, tests and payments"
      />

      <PatientInfoCard patient={patient} />
      <PatientProfileTabs patient={patient} orders={orders} payments={payments} />
    </section>
  );
};

export default PatientProfilePage;
