import { useState } from "react";

import { ApiError, sendContactMessage } from "../../../services";
import ContactField from "./ContactField";

interface Field {
  name: string;
  label: string;
  placeholder: string;
  type: string;
}

interface ContactFormProps {
  fields: Field[];
}

const ContactForm = ({ fields }: ContactFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await sendContactMessage({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: "General Inquiry",
        message: formData.message,
      });

      setSuccess("Message sent successfully!");
      setFormData({});
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to send message";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-lg">
      {error && (
        <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <ContactField
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            value={formData[field.name] ?? ""}
            onChange={handleChange}
          />
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="
            w-full rounded-full bg-[#052836]
            py-3 font-semibold text-white
            transition hover:bg-[#074057]
            disabled:opacity-60
          "
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
