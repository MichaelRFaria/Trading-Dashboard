import FormField from '@/src/components/common/FormField';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function FormInput({ label, id, ...props }: FormInputProps) {
  return (
    <FormField label={label} htmlFor={id!}>
      <input
        id={id!}
        {...props}
        className="rounded border border-gray-600 bg-gray-800 px-2 py-1"
      />
    </FormField>
  );
}
