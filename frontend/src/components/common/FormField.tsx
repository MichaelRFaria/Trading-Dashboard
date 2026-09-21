type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

// generalised html form field abstraction. later will be used specialised form fields (input, select, etc)
export default function FormField({
  label,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <label htmlFor={htmlFor}>{label}</label>

      {children}
    </div>
  );
}
