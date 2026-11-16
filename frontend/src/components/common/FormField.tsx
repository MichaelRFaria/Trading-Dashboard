import React from 'react';

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
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400" htmlFor={htmlFor}>
        {label}
      </label>

      {children}
    </div>
  );
}
