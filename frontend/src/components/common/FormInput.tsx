import FormField from '@/src/components/common/FormField';
import React from 'react';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function FormInput({ label, id, ...props }: FormInputProps) {
  return (
    <FormField label={label} htmlFor={id!}>
      <input
        id={id!}
        {...props}
        className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
      />
    </FormField>
  );
}
