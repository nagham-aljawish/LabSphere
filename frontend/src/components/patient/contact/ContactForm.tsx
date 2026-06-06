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
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-lg">
      <form className="space-y-6">
        {fields.map((field) => (
          <ContactField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
          />
        ))}

        <button
          type="submit"
          className="
            w-full rounded-full bg-[#052836]
            py-3 font-semibold text-white
            transition hover:bg-[#074057]
          "
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
