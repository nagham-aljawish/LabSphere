import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  required,
  minLength,
  className = "w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 pr-12 outline-none focus:border-[#052836]",
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className={className}
      />

      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#052836]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
