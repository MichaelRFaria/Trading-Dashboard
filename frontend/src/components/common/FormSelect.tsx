import FormField from '@/src/components/common/FormField';

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
        className="rounded border border-gray-600 bg-gray-800 px-2 py-1"
      >
        {children}
      </select>
    </FormField>
  );
}
