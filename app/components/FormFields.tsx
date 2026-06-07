export function Input({ label, name, type = "text", defaultValue, required, className = "" }: {
  label: string; name: string; type?: string; defaultValue?: string | number; required?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}

export function Select({ label, name, options, defaultValue, required }: {
  label: string; name: string;
  options: string[] | { label: string; value: string }[];
  defaultValue?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
      >
        {options.map((o) => {
          const labelText = typeof o === "string" ? o : o.label;
          const value = typeof o === "string" ? o : o.value;
          return <option key={value} value={value}>{labelText}</option>;
        })}
      </select>
    </div>
  );
}

export function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <input
        name={name}
        type="checkbox"
        id={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-border"
      />
      <label htmlFor={name} className="text-sm">{label}</label>
    </div>
  );
}
