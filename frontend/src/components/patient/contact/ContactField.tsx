interface ContactFieldProps {
  label: string;
  placeholder: string;
  type: string;
}

const ContactField = ({ label, placeholder, type }: ContactFieldProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#052836]">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={5}
          className="
            w-full rounded-lg border-2 border-[#88D6E7]
            px-4 py-3 outline-none
            focus:border-[#052836]
          "
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="
            w-full rounded-lg border-2 border-[#88D6E7]
            px-4 py-3 outline-none
            focus:border-[#052836]
          "
        />
      )}
    </div>
  );
};

export default ContactField;
