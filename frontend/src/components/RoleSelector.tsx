type Role =| "Admin"| "Doctor"| "Technician"| "Reception"| "Patient";

interface RoleSelectorProps {
  roles: Role[];
  selectedRole: Role | null;
  onSelect: (role: Role) => void;
}

const RoleSelector = ({roles,selectedRole,onSelect,}: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {roles.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => onSelect(role)}
          className={`rounded-lg border p-3 text-sm font-medium transition-all duration-200
          ${
            selectedRole === role
              ? "bg-[#052836] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
