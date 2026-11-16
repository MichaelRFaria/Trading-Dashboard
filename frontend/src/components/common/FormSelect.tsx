import FormField from '@/src/components/common/FormField';
import React from 'react';

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
};

export default function FormSelect({
  label,
  id,
  children,
  ...props
}: FormSelectProps) {
  return (
    <FormField label={label} htmlFor={id!}>
      <select
        id={id!}
        {...props}
        className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
      >
        {children}
      </select>
    </FormField>
  );
}
