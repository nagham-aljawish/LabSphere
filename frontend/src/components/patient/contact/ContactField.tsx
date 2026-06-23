interface ContactFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const ContactField = ({
  name,
  label,
  placeholder,
  type,
  value,
  onChange,
}: ContactFieldProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#052836]">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={5}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          required
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
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          required={type !== "tel"}
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
